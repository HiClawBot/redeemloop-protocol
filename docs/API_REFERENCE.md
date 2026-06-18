# RedeemLoop API Reference v0.5.1

## English

Base URL:

```text
http://localhost:8787
```

When `REDEEMLOOP_API_KEYS` is configured, merchant-scoped requests require:

```http
Authorization: Bearer <merchant-api-key>
```

### Core Setup

```http
POST /v1/merchants
GET  /v1/merchants/:merchantId
POST /v1/merchants/:merchantId/domains/verify
POST /v1/merchant-vaults
GET  /v1/merchant-vaults?merchantId=...
POST /v1/merchant-vaults/:vaultId/verification-challenge
POST /v1/merchant-vaults/:vaultId/verify-signature
POST /v1/entitlements
GET  /v1/entitlements/:entitlementId
PATCH /v1/entitlements/:entitlementId
POST /v1/bindings
GET  /v1/bindings/:bindingId
GET  /v1/bindings?merchantId=...&sku=...
PATCH /v1/bindings/:bindingId
POST /v1/bindings/:bindingId/pause
POST /v1/bindings/:bindingId/activate
```

### PaymentIntent

```http
POST /v1/payment-intents
GET  /v1/payment-intents?merchantId=...&bindingId=...&status=...&orderId=...
GET  /v1/payment-intents/:intentId
POST /v1/payment-intents/:intentId/connect-wallet
POST /v1/payment-intents/:intentId/select-asset
POST /v1/payment-intents/:intentId/check-balance
POST /v1/payment-intents/:intentId/transfer-requested
POST /v1/payment-intents/:intentId/broadcasted
POST /v1/payment-intents/:intentId/cancel
POST /v1/payment-intents/expire-stale
```

For Bitcoin Rune assets, `transfer-requested` accepts `network`, `feeRate`, `changeAddress`, `payerPublicKey`, and `runeUtxos`, then returns `transfer.bitcoin.psbtBase64`. This API response remains a PSBT fixture boundary. Real wallet flows should prefer the adapter-level UniSat `sendRunes` or Xverse `runes_transfer` path, then submit indexer-backed proof.

For EVM ERC-20 assets, `transfer-requested` returns `transfer.evm.transaction` for wallet sending. Trusted EVM receipt recheck uses `RPC_URL` for one-chain deployments or `EVM_RPC_URLS` for chain-specific RPC routing across Ethereum, BSC, Polygon, and Arbitrum.

### Settlement

```http
POST /v1/settlement/proofs
GET  /v1/settlement/proofs/:proofId
POST /v1/settlement/recheck/:intentId
POST /v1/settlement/evm/recheck/:intentId
POST /v1/settlement/rune/recheck/:intentId
```

`POST /v1/settlement/rune/recheck/:intentId` accepts `txid`, optional `from`, and optional `confirmations`. It uses the configured `RuneIndexerAdapter`; by default the API creates an Xverse adapter from `XVERSE_API_KEY`, `XVERSE_NETWORK`, and optional `XVERSE_API_BASE_URL`.

### Webhooks

```http
POST /v1/webhook-endpoints
GET  /v1/webhook-endpoints?merchantId=...
POST /v1/webhook-endpoints/:id/test
GET  /v1/webhook-events?merchantId=...
GET  /v1/webhook-events/:eventId
GET  /v1/webhook-deliveries?merchantId=...
GET  /v1/webhook-deliveries/:deliveryId
POST /v1/webhook-deliveries/drain-pending
POST /v1/webhook-deliveries/:deliveryId/attempt
POST /v1/webhook-deliveries/:deliveryId/replay
```

### Audit Logs

```http
GET /v1/audit-logs?merchantId=...&entityType=...&entityId=...&action=...
```

v0.4.5 records audit entries for merchant vault creation, vault challenge creation, vault signature verification, PaymentIntent creation, PaymentIntent state changes, settlement proof advancement, and expiration cleanup.

### Sandbox Health and Config

```http
GET /health
GET /v1/config
GET /v1/diagnostics/evm-rpc
GET /v1/diagnostics/shopify
```

`GET /v1/diagnostics/evm-rpc` reports ETH/BSC/Polygon/Arbitrum RPC status, source, origin, latest block height, and latency. It does not return the full RPC URL to avoid leaking provider API keys.
`GET /v1/diagnostics/shopify` reports private-app Admin API readiness without returning the Admin access token.

## 中文

Base URL：

```text
http://localhost:8787
```

配置 `REDEEMLOOP_API_KEYS` 后，商户级请求必须携带：

```http
Authorization: Bearer <merchant-api-key>
```

### 核心配置

```http
POST /v1/merchants
GET  /v1/merchants/:merchantId
POST /v1/merchants/:merchantId/domains/verify
POST /v1/merchant-vaults
GET  /v1/merchant-vaults?merchantId=...
POST /v1/merchant-vaults/:vaultId/verification-challenge
POST /v1/merchant-vaults/:vaultId/verify-signature
POST /v1/entitlements
GET  /v1/entitlements/:entitlementId
PATCH /v1/entitlements/:entitlementId
POST /v1/bindings
GET  /v1/bindings/:bindingId
GET  /v1/bindings?merchantId=...&sku=...
PATCH /v1/bindings/:bindingId
POST /v1/bindings/:bindingId/pause
POST /v1/bindings/:bindingId/activate
```

### PaymentIntent

```http
POST /v1/payment-intents
GET  /v1/payment-intents?merchantId=...&bindingId=...&status=...&orderId=...
GET  /v1/payment-intents/:intentId
POST /v1/payment-intents/:intentId/connect-wallet
POST /v1/payment-intents/:intentId/select-asset
POST /v1/payment-intents/:intentId/check-balance
POST /v1/payment-intents/:intentId/transfer-requested
POST /v1/payment-intents/:intentId/broadcasted
POST /v1/payment-intents/:intentId/cancel
POST /v1/payment-intents/expire-stale
```

对于 Bitcoin Rune 资产，`transfer-requested` 可接收 `network`、`feeRate`、`changeAddress`、`payerPublicKey` 和 `runeUtxos`，并返回 `transfer.bitcoin.psbtBase64`。该 API 响应仍是 PSBT fixture boundary。真实钱包流程应优先使用 adapter 层 UniSat `sendRunes` 或 Xverse `runes_transfer` 路径，然后提交 indexer-backed proof。

对于 EVM ERC-20 资产，`transfer-requested` 会返回 `transfer.evm.transaction`，用于钱包发起交易。可信 EVM receipt recheck 在单链部署中使用 `RPC_URL`，在 Ethereum、BSC、Polygon、Arbitrum 多链部署中可使用 `EVM_RPC_URLS` 做按 chainId 的 RPC 路由。

### Settlement

```http
POST /v1/settlement/proofs
GET  /v1/settlement/proofs/:proofId
POST /v1/settlement/recheck/:intentId
POST /v1/settlement/evm/recheck/:intentId
POST /v1/settlement/rune/recheck/:intentId
```

`POST /v1/settlement/rune/recheck/:intentId` 接收 `txid`、可选 `from` 和可选 `confirmations`。它会使用配置好的 `RuneIndexerAdapter`；默认情况下 API 会根据 `XVERSE_API_KEY`、`XVERSE_NETWORK` 和可选 `XVERSE_API_BASE_URL` 创建 Xverse adapter。

### Webhooks

```http
POST /v1/webhook-endpoints
GET  /v1/webhook-endpoints?merchantId=...
POST /v1/webhook-endpoints/:id/test
GET  /v1/webhook-events?merchantId=...
GET  /v1/webhook-events/:eventId
GET  /v1/webhook-deliveries?merchantId=...
GET  /v1/webhook-deliveries/:deliveryId
POST /v1/webhook-deliveries/drain-pending
POST /v1/webhook-deliveries/:deliveryId/attempt
POST /v1/webhook-deliveries/:deliveryId/replay
```

### Audit Logs

```http
GET /v1/audit-logs?merchantId=...&entityType=...&entityId=...&action=...
```

v0.4.5 会记录 merchant vault 创建、vault challenge 创建、vault 签名验证、PaymentIntent 创建、PaymentIntent 状态变化、settlement proof 推进和过期清理等审计事件。

### Sandbox Health 和 Config

```http
GET /health
GET /v1/config
GET /v1/diagnostics/evm-rpc
GET /v1/diagnostics/shopify
```

`GET /v1/diagnostics/evm-rpc` 会返回 ETH/BSC/Polygon/Arbitrum 的 RPC 状态、来源、origin、最新块高和延迟。接口不会返回完整 RPC URL，以避免泄漏 provider API key。
`GET /v1/diagnostics/shopify` 会返回 private-app Admin API 准备状态，但不会返回 Admin access token。
