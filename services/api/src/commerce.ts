import { createHmac, timingSafeEqual } from "node:crypto";

export type CommerceProvider = "shopify" | "woocommerce" | "custom";

export interface CommerceAdapterConfig {
  dryRun: boolean;
  shopifyShopDomain?: string;
  shopifyAdminAccessToken?: string;
  shopifyApiVersion: string;
  shopifyWebhookSecret?: string;
  woocommerceStoreUrl?: string;
  woocommerceConsumerKey?: string;
  woocommerceConsumerSecret?: string;
  woocommerceWebhookSecret?: string;
}

export interface ShopifyAdapterDiagnostics {
  provider: "shopify";
  status: "ok" | "dry_run" | "missing_config";
  dryRun: boolean;
  apiVersion: string;
  shopDomainConfigured: boolean;
  adminAccessTokenConfigured: boolean;
  webhookSecretConfigured: boolean;
  adminGraphqlUrl?: string;
  missing: string[];
}

export interface CommerceMarkAsPaidInput {
  provider: CommerceProvider;
  orderId: string;
  paymentId: string;
  merchantId: string;
  chainId?: number;
  voucherToken: string;
  assetId?: string;
  amount: string;
  receiver: string;
  txHash?: string;
  intentId?: string;
  redemptionId?: string;
}

export interface CommerceMarkAsPaidResult {
  provider: CommerceProvider;
  orderId: string;
  markedPaid: boolean;
  dryRun: boolean;
  request: {
    method: "POST" | "PUT";
    url: string;
    headers: string[];
    body: unknown;
  };
  response?: unknown;
}

export function normalizeProvider(value: unknown): CommerceProvider {
  if (value === "shopify" || value === "woocommerce" || value === "custom") return value;
  throw new Error("provider must be shopify, woocommerce, or custom");
}

export function requireString(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} is required`);
  }
  return value.trim();
}

export function optionalString(value: unknown, fieldName: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value !== "string") throw new Error(`${fieldName} must be a string`);
  return value.trim();
}

export function hmacSha256Base64(secret: string, rawBody: string): string {
  return createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
}

export function verifyBase64HmacSha256(secret: string, rawBody: string, signature: string | undefined): boolean {
  if (!signature) return false;
  const expected = createHmac("sha256", secret).update(rawBody, "utf8").digest();
  const provided = Buffer.from(signature, "base64");
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(expected, provided);
}

export function redeemLoopWebhookSignature(secret: string, timestamp: string, nonce: string, rawBody: string): string {
  return createHmac("sha256", secret).update(`${timestamp}.${nonce}.${rawBody}`, "utf8").digest("hex");
}

export function verifyRedeemLoopWebhookSignature(
  secret: string,
  timestamp: string | undefined,
  nonce: string | undefined,
  rawBody: string,
  signature: string | undefined,
): boolean {
  if (!timestamp || !nonce || !signature) return false;
  const expected = Buffer.from(redeemLoopWebhookSignature(secret, timestamp, nonce, rawBody), "hex");
  const provided = Buffer.from(signature, "hex");
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(expected, provided);
}

export async function markCommerceOrderAsPaid(
  input: CommerceMarkAsPaidInput,
  config: CommerceAdapterConfig,
): Promise<CommerceMarkAsPaidResult> {
  if (input.provider === "shopify") {
    return markShopifyOrderAsPaid(input, config);
  }
  if (input.provider === "woocommerce") {
    return markWooCommerceOrderAsPaid(input, config);
  }
  return customMarkAsPaid(input, config);
}

export function extractShopifyOrderId(payload: unknown): string {
  const body = payload as Record<string, unknown>;
  const orderGid = optionalString(body.admin_graphql_api_id, "admin_graphql_api_id");
  if (orderGid) return orderGid;
  const id = requireString(body.id, "orderId");
  return toShopifyOrderGid(id);
}

export function getShopifyAdapterDiagnostics(config: CommerceAdapterConfig): ShopifyAdapterDiagnostics {
  const missing = [
    config.shopifyShopDomain ? "" : "SHOPIFY_SHOP_DOMAIN",
    config.shopifyAdminAccessToken ? "" : "SHOPIFY_ADMIN_ACCESS_TOKEN",
  ].filter(Boolean);
  return {
    provider: "shopify",
    status: config.dryRun ? "dry_run" : missing.length ? "missing_config" : "ok",
    dryRun: config.dryRun,
    apiVersion: config.shopifyApiVersion,
    shopDomainConfigured: Boolean(config.shopifyShopDomain),
    adminAccessTokenConfigured: Boolean(config.shopifyAdminAccessToken),
    webhookSecretConfigured: Boolean(config.shopifyWebhookSecret),
    adminGraphqlUrl: config.shopifyShopDomain ? shopifyAdminGraphqlUrl(config.shopifyShopDomain, config.shopifyApiVersion) : undefined,
    missing,
  };
}

export function extractWooCommerceOrderId(payload: unknown): string {
  const body = payload as Record<string, unknown>;
  const nestedOrder = body.order as Record<string, unknown> | undefined;
  if (nestedOrder?.id !== undefined) return requireString(String(nestedOrder.id), "order.id");
  return requireString(String(body.id ?? ""), "orderId");
}

function markShopifyOrderAsPaid(
  input: CommerceMarkAsPaidInput,
  config: CommerceAdapterConfig,
): Promise<CommerceMarkAsPaidResult> {
  const shopDomain = config.shopifyShopDomain ?? "example.myshopify.com";
  const url = shopifyAdminGraphqlUrl(shopDomain, config.shopifyApiVersion);
  const body = {
    query: `
      mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
        orderMarkAsPaid(input: $input) {
          userErrors {
            field
            message
          }
          order {
            id
            name
            displayFinancialStatus
          }
        }
      }
    `,
    variables: {
      input: {
        id: toShopifyOrderGid(input.orderId),
      },
    },
  };
  const request = {
    method: "POST" as const,
    url,
    headers: ["Content-Type: application/json", "X-Shopify-Access-Token: <redacted>"],
    body,
  };

  if (config.dryRun) {
    return Promise.resolve({
      provider: "shopify",
      orderId: input.orderId,
      markedPaid: false,
      dryRun: true,
      request,
    });
  }

  const diagnostics = getShopifyAdapterDiagnostics(config);
  if (diagnostics.status === "missing_config") {
    throw new Error(`Shopify Admin API config is incomplete: ${diagnostics.missing.join(", ")}`);
  }

  const accessToken = config.shopifyAdminAccessToken;
  if (!accessToken) {
    throw new Error("Shopify Admin API config is incomplete: SHOPIFY_ADMIN_ACCESS_TOKEN");
  }

  return postJson(url, body, {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": accessToken,
  }).then((response) => {
    assertShopifyMarkAsPaidAccepted(response);
    return {
      provider: "shopify" as const,
      orderId: input.orderId,
      markedPaid: true,
      dryRun: false,
      request,
      response,
    };
  });
}

function markWooCommerceOrderAsPaid(
  input: CommerceMarkAsPaidInput,
  config: CommerceAdapterConfig,
): Promise<CommerceMarkAsPaidResult> {
  const storeUrl = normalizeStoreUrl(config.woocommerceStoreUrl ?? "https://example.com");
  const url = `${storeUrl}/wp-json/wc/v3/orders/${encodeURIComponent(input.orderId)}`;
  const body = {
    set_paid: true,
    status: "processing",
    meta_data: [
      { key: "_redeemloop_payment_id", value: input.paymentId },
      { key: "_redeemloop_intent_id", value: input.intentId ?? input.paymentId },
      { key: "_redeemloop_merchant_id", value: input.merchantId },
      { key: "_redeemloop_chain_id", value: input.chainId === undefined ? "" : String(input.chainId) },
      { key: "_redeemloop_voucher_token", value: input.voucherToken },
      { key: "_redeemloop_asset_id", value: input.assetId ?? "" },
      { key: "_redeemloop_receiver", value: input.receiver },
      { key: "_redeemloop_amount", value: input.amount },
      { key: "_redeemloop_tx_hash", value: input.txHash ?? "" },
      { key: "_redeemloop_legacy_reference", value: input.redemptionId ?? "" },
    ],
  };
  const request = {
    method: "PUT" as const,
    url,
    headers: ["Content-Type: application/json", "Authorization: Basic <redacted>"],
    body,
  };

  if (config.dryRun || !config.woocommerceStoreUrl || !config.woocommerceConsumerKey || !config.woocommerceConsumerSecret) {
    return Promise.resolve({
      provider: "woocommerce",
      orderId: input.orderId,
      markedPaid: false,
      dryRun: true,
      request,
    });
  }

  const credentials = Buffer.from(`${config.woocommerceConsumerKey}:${config.woocommerceConsumerSecret}`).toString("base64");
  return postJson(url, body, {
    Authorization: `Basic ${credentials}`,
    "Content-Type": "application/json",
  }, "PUT").then((response) => ({
    provider: "woocommerce" as const,
    orderId: input.orderId,
    markedPaid: true,
    dryRun: false,
    request,
    response,
  }));
}

function customMarkAsPaid(input: CommerceMarkAsPaidInput, config: CommerceAdapterConfig): CommerceMarkAsPaidResult {
  return {
    provider: "custom",
    orderId: input.orderId,
    markedPaid: !config.dryRun,
    dryRun: config.dryRun,
    request: {
      method: "POST",
      url: "redeemloop://custom-commerce/mark-as-paid",
      headers: ["Content-Type: application/json"],
      body: {
        paymentId: input.paymentId,
        intentId: input.intentId ?? input.paymentId,
        orderId: input.orderId,
        merchantId: input.merchantId,
        chainId: input.chainId ?? null,
        voucherToken: input.voucherToken,
        assetId: input.assetId ?? null,
        amount: input.amount,
        receiver: input.receiver,
        txHash: input.txHash ?? null,
        legacyReference: input.redemptionId ?? null,
      },
    },
  };
}

async function postJson(url: string, body: unknown, headers: Record<string, string>, method: "POST" | "PUT" = "POST") {
  const response = await fetch(url, {
    method,
    headers,
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(`Commerce adapter request failed with ${response.status}: ${JSON.stringify(payload)}`);
  }
  return payload;
}

function assertShopifyMarkAsPaidAccepted(response: unknown): void {
  const body = recordOf(response);
  const topLevelErrors = arrayOfRecords(body.errors)
    .map((error) => stringOf(error.message) ?? JSON.stringify(error))
    .filter(Boolean);
  if (topLevelErrors.length) {
    throw new Error(`Shopify Admin GraphQL error: ${topLevelErrors.join("; ")}`);
  }

  const data = recordOf(body.data);
  const result = recordOf(data.orderMarkAsPaid);
  const userErrors = arrayOfRecords(result.userErrors)
    .map((error) => {
      const field = Array.isArray(error.field) ? error.field.join(".") : stringOf(error.field);
      const message = stringOf(error.message) ?? JSON.stringify(error);
      return field ? `${field}: ${message}` : message;
    })
    .filter(Boolean);
  if (userErrors.length) {
    throw new Error(`Shopify orderMarkAsPaid user error: ${userErrors.join("; ")}`);
  }
}

function toShopifyOrderGid(orderId: string): string {
  if (orderId.startsWith("gid://shopify/Order/")) return orderId;
  return `gid://shopify/Order/${orderId}`;
}

function shopifyAdminGraphqlUrl(shopDomain: string, apiVersion: string): string {
  return `https://${shopDomain}/admin/api/${apiVersion}/graphql.json`;
}

function normalizeStoreUrl(url: string): string {
  return url.replace(/\/+$/, "");
}

function recordOf(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}

function arrayOfRecords(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.map(recordOf) : [];
}

function stringOf(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
