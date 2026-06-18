# Shopify Mark-as-Paid Adapter Alpha

## English

RedeemLoop v0.5.1 improves the Shopify private-app alpha path. It is intended for pilot merchants that already have a Shopify Admin API access token.

### Scope

- Shopify Admin GraphQL `orderMarkAsPaid` request construction.
- `GET /v1/diagnostics/shopify` configuration diagnostics.
- Mocked Admin API integration tests for success and `userErrors`.
- Shopify webhook order ID parsing from `admin_graphql_api_id` or numeric `id`.
- HMAC verification for `/v1/webhooks/shopify/mark-as-paid`.

This is not a Shopify payment app and has not gone through Shopify app review.

### Configuration

```bash
SHOPIFY_SHOP_DOMAIN=merchant.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
SHOPIFY_ADMIN_API_VERSION=2026-04
SHOPIFY_WEBHOOK_SECRET=...
RELAYER_DRY_RUN=false
```

Before enabling live mark-as-paid, call:

```http
GET /v1/diagnostics/shopify
```

The response reports whether the shop domain, Admin API token, webhook secret, and Admin API version are configured. It never returns the access token.

### Pilot Flow

1. Create an Asset Binding with a Shopify commerce target.
2. Complete voucher settlement through the normal PaymentIntent flow.
3. RedeemLoop calls Shopify Admin GraphQL `orderMarkAsPaid`.
4. If Shopify returns GraphQL `errors` or `userErrors`, RedeemLoop returns a diagnostic error and does not mark the local commerce payment as paid.
5. Keep `RELAYER_DRY_RUN=true` until the private app token and store permissions are verified.

## 中文

RedeemLoop v0.5.1 改进 Shopify private-app alpha 路径，面向已经拥有 Shopify Admin API access token 的 pilot 商户。

### 范围

- 构造 Shopify Admin GraphQL `orderMarkAsPaid` 请求。
- `GET /v1/diagnostics/shopify` 配置诊断。
- 使用 mocked Admin API 测试成功响应和 `userErrors`。
- 从 `admin_graphql_api_id` 或数字 `id` 解析 Shopify order ID。
- `/v1/webhooks/shopify/mark-as-paid` 的 HMAC 校验。

这不是 Shopify payment app，也尚未通过 Shopify app review。

### 配置

```bash
SHOPIFY_SHOP_DOMAIN=merchant.myshopify.com
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
SHOPIFY_ADMIN_API_VERSION=2026-04
SHOPIFY_WEBHOOK_SECRET=...
RELAYER_DRY_RUN=false
```

启用 live mark-as-paid 前先调用：

```http
GET /v1/diagnostics/shopify
```

响应会显示 shop domain、Admin API token、webhook secret 和 Admin API version 是否配置完成。接口不会返回 access token。

### Pilot 流程

1. 创建带 Shopify commerce target 的 Asset Binding。
2. 通过正常 PaymentIntent 流程完成 voucher settlement。
3. RedeemLoop 调用 Shopify Admin GraphQL `orderMarkAsPaid`。
4. 如果 Shopify 返回 GraphQL `errors` 或 `userErrors`，RedeemLoop 会返回诊断错误，并且不会把本地 commerce payment 标记为 paid。
5. 在 private app token 和店铺权限验证完成前，保持 `RELAYER_DRY_RUN=true`。
