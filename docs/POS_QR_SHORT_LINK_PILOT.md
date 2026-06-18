# POS QR and Short-Link Pilot

## English

RedeemLoop v0.9.0 adds hosted payment pages on top of the PaymentIntent-native POS QR and livestream short-link pilot APIs.

### POS QR

Register a terminal:

```http
POST /v1/terminals/register
```

Create a terminal-scoped POS PaymentIntent:

```http
POST /v1/pos/payment-intents
```

```json
{
  "bindingId": "bind_coffee",
  "storeId": "tokyo-store-001",
  "terminalId": "pos-07",
  "terminalNonce": "nonce-1",
  "orderId": "POS-1001",
  "baseUrl": "https://pay.example"
}
```

The response includes `paymentIntent`, a `qr` payload, `checkoutToken`, and a hosted `paymentUrl` such as `https://pay.example/pay/pi_...?token=...`. `terminalNonce` is stored to prevent replay for the registered merchant/store/terminal.

### Short Links

Create a livestream or campaign short link:

```http
POST /v1/short-links/payment-intents
```

```json
{
  "bindingId": "bind_coffee",
  "slug": "live-drop",
  "baseUrl": "https://pay.example",
  "channel": "livestream",
  "orderId": "LIVE-1001"
}
```

Resolve it:

```http
GET /v1/short-links/live-drop
```

The merchant creation response includes a tokenized hosted URL such as `https://pay.example/s/live-drop?token=...`.

### Hosted Payment Page

Customer-facing pages should use the public session APIs:

```http
GET  /v1/public/short-links/live-drop?checkoutToken=...
GET  /v1/public/payment-sessions/:intentId?checkoutToken=...
POST /v1/public/payment-sessions/:intentId/connect-wallet
POST /v1/public/payment-sessions/:intentId/transfer-requested
POST /v1/public/payment-sessions/:intentId/broadcasted
POST /v1/public/payment-sessions/:intentId/settlement/evm/recheck
```

These endpoints are scoped to the generated `checkoutToken` and are intended for the hosted `/s/[slug]` and `/pay/[intentId]` pages. They do not require or expose the merchant API key.

Both POS QR and short links reconcile back to the same `PaymentIntent`, settlement proof, webhook, audit log, and commerce mark-as-paid model.

The local POS console can register a terminal, create a POS QR payload, create a short link, open hosted payment URLs, and refresh PaymentIntent status during a pilot run.

## 中文

RedeemLoop v0.9.0 在基于 PaymentIntent 的 POS QR 和直播短链 pilot API 之上，新增 hosted payment page。

### POS QR

注册终端：

```http
POST /v1/terminals/register
```

创建 terminal-scoped POS PaymentIntent：

```http
POST /v1/pos/payment-intents
```

```json
{
  "bindingId": "bind_coffee",
  "storeId": "tokyo-store-001",
  "terminalId": "pos-07",
  "terminalNonce": "nonce-1",
  "orderId": "POS-1001",
  "baseUrl": "https://pay.example"
}
```

响应包含 `paymentIntent`、`qr` payload、`checkoutToken` 和 hosted `paymentUrl`，例如 `https://pay.example/pay/pi_...?token=...`。`terminalNonce` 会按 merchant/store/terminal 保存，用于防重放。

### 短链

创建直播或活动短链：

```http
POST /v1/short-links/payment-intents
```

```json
{
  "bindingId": "bind_coffee",
  "slug": "live-drop",
  "baseUrl": "https://pay.example",
  "channel": "livestream",
  "orderId": "LIVE-1001"
}
```

解析短链：

```http
GET /v1/short-links/live-drop
```

商户创建响应会包含带 token 的 hosted URL，例如 `https://pay.example/s/live-drop?token=...`。

### Hosted Payment Page

用户侧页面应使用 public session API：

```http
GET  /v1/public/short-links/live-drop?checkoutToken=...
GET  /v1/public/payment-sessions/:intentId?checkoutToken=...
POST /v1/public/payment-sessions/:intentId/connect-wallet
POST /v1/public/payment-sessions/:intentId/transfer-requested
POST /v1/public/payment-sessions/:intentId/broadcasted
POST /v1/public/payment-sessions/:intentId/settlement/evm/recheck
```

这些端点只对生成的 `checkoutToken` 对应的 PaymentIntent 生效，用于 hosted `/s/[slug]` 和 `/pay/[intentId]` 页面，不需要也不会暴露商户 API key。

POS QR 和短链都会回到同一套 `PaymentIntent`、settlement proof、webhook、audit log 和 commerce mark-as-paid 模型。

本地 POS console 可以在 pilot run 中注册 terminal、创建 POS QR payload、创建短链、打开 hosted payment URL，并刷新 PaymentIntent 状态。
