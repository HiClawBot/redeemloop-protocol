#!/usr/bin/env node

const mode = process.argv.includes("--production") ? "production" : "sandbox";

const required = mode === "production"
  ? ["REDEEMLOOP_STORAGE_FILE", "REDEEMLOOP_API_KEYS", "REDEEMLOOP_EMBED_ALLOWED_ORIGINS"]
  : ["REDEEMLOOP_STORAGE_FILE"];

const recommended = [
  "EVM_MIN_CONFIRMATIONS",
  "WEBHOOK_MAX_ATTEMPTS",
];

const missing = required.filter((name) => !process.env[name]);
const warnings = recommended.filter((name) => !process.env[name]);

if (process.env.REDEEMLOOP_API_KEYS) {
  validateApiKeys(process.env.REDEEMLOOP_API_KEYS);
}

if (process.env.REDEEMLOOP_EMBED_ALLOWED_ORIGINS === "*") {
  warnings.push("REDEEMLOOP_EMBED_ALLOWED_ORIGINS should not be '*' outside local experiments");
}

if (process.env.EVM_RPC_URLS) {
  validateEvmRpcUrls(process.env.EVM_RPC_URLS);
}

if (mode === "production" && process.env.RELAYER_DRY_RUN !== "false") {
  warnings.push("RELAYER_DRY_RUN should be false only after commerce and settlement credentials are ready");
}

if (process.env.XVERSE_NETWORK && !["mainnet", "signet", "testnet4"].includes(process.env.XVERSE_NETWORK)) {
  throw new Error("XVERSE_NETWORK must be mainnet, signet, or testnet4");
}

if (mode === "production" && !process.env.XVERSE_API_KEY) {
  warnings.push("XVERSE_API_KEY is required before enabling API-level Rune settlement recheck");
}

if (missing.length > 0) {
  console.error(`RedeemLoop env check failed for ${mode}:`);
  for (const name of missing) console.error(`- Missing ${name}`);
  process.exit(1);
}

console.log(`RedeemLoop env check passed for ${mode}.`);
if (warnings.length > 0) {
  console.log("Warnings:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

function validateApiKeys(input) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("REDEEMLOOP_API_KEYS cannot be empty");
  if (trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("REDEEMLOOP_API_KEYS JSON must be an object");
    }
    return;
  }
  for (const entry of trimmed.split(",")) {
    if (!entry.trim()) continue;
    if (!entry.includes(":")) {
      throw new Error("REDEEMLOOP_API_KEYS entries must use merchantId:apiKey");
    }
  }
}

function validateEvmRpcUrls(input) {
  const trimmed = input.trim();
  if (!trimmed) throw new Error("EVM_RPC_URLS cannot be empty");
  if (trimmed.startsWith("{")) {
    const parsed = JSON.parse(trimmed);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("EVM_RPC_URLS JSON must be an object");
    }
    for (const [chainId, rpcUrl] of Object.entries(parsed)) {
      validateChainId(chainId, "EVM_RPC_URLS");
      if (typeof rpcUrl !== "string" || !rpcUrl.trim()) throw new Error(`EVM_RPC_URLS.${chainId} must be a URL`);
    }
    return;
  }
  for (const entry of trimmed.split(",")) {
    if (!entry.trim()) continue;
    const separator = entry.indexOf(":");
    if (separator <= 0) throw new Error("EVM_RPC_URLS entries must use chainId:rpcUrl");
    validateChainId(entry.slice(0, separator), "EVM_RPC_URLS");
    if (!entry.slice(separator + 1).trim()) throw new Error("EVM_RPC_URLS entries must include rpcUrl");
  }
}

function validateChainId(value, fieldName) {
  const numberValue = Number(value);
  if (!Number.isSafeInteger(numberValue) || numberValue <= 0) throw new Error(`${fieldName} chainId must be a positive integer`);
}
