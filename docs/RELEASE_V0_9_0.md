# RedeemLoop v0.9.0 Release Notes

## English

RedeemLoop v0.9.0 turns the v0.8 POS QR and livestream short-link pilot APIs into customer-openable hosted payment pages.

### Added

- Hosted payment pages:
  - `/s/[slug]` for short links.
  - `/pay/[intentId]` for POS QR or direct PaymentIntent links.
- Token-scoped public payment session APIs:
  - `GET /v1/public/short-links/:slug?checkoutToken=...`
  - `GET /v1/public/payment-sessions/:intentId?checkoutToken=...`
  - `POST /v1/public/payment-sessions/:intentId/connect-wallet`
  - `POST /v1/public/payment-sessions/:intentId/transfer-requested`
  - `POST /v1/public/payment-sessions/:intentId/broadcasted`
  - `POST /v1/public/payment-sessions/:intentId/settlement/evm/recheck`
- POS QR and short-link creation responses now include `checkoutToken` and hosted checkout URLs.
- SDK helpers for public session lookup and customer-side EVM payment flow.
- API tests covering merchant API key protection plus token-scoped customer payment.

### Status

This is a hosted payment page alpha. It is suitable for sandbox and controlled pilot testing. It still requires deployment-owned HTTPS hosting, production RPC configuration, real wallet certification, managed database storage, and live commerce certification before production claims.

## 中文

RedeemLoop v0.9.0 把 v0.8 的 POS QR 和直播短链 pilot API 推进为用户可直接打开的 hosted payment pages。

### 新增

- Hosted payment pages：
  - `/s/[slug]` 用于短链。
  - `/pay/[intentId]` 用于 POS QR 或直接 PaymentIntent 链接。
- Token-scoped public payment session APIs：
  - `GET /v1/public/short-links/:slug?checkoutToken=...`
  - `GET /v1/public/payment-sessions/:intentId?checkoutToken=...`
  - `POST /v1/public/payment-sessions/:intentId/connect-wallet`
  - `POST /v1/public/payment-sessions/:intentId/transfer-requested`
  - `POST /v1/public/payment-sessions/:intentId/broadcasted`
  - `POST /v1/public/payment-sessions/:intentId/settlement/evm/recheck`
- POS QR 和短链创建响应新增 `checkoutToken` 和 hosted checkout URL。
- SDK 新增 public session lookup 和用户侧 EVM 支付流程 helper。
- API 测试覆盖商户 API key 保护以及 token-scoped 用户侧支付。

### 状态

这是 hosted payment page alpha，适合 sandbox 和受控 pilot 测试。它仍需要部署方提供 HTTPS hosting、生产 RPC 配置、真实钱包认证、托管数据库存储和真实电商认证，之后才能做生产级声明。
