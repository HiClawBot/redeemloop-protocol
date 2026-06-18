# RedeemLoop v0.5.0

## English

RedeemLoop v0.5.0 adds the first merchant operations console and improves the WooCommerce pilot path.

### Added

- Merchant admin console at `/merchant-admin`.
- API `GET /v1/payment-intents` with merchant, binding, status, and order filters.
- SDK `listPaymentIntents(...)`.
- Merchant admin pilot seed action for vault, entitlement, binding, and webhook setup.
- WooCommerce SKU-to-binding map.
- WooCommerce admin diagnostics for API base URL, merchant ID, default binding ID, and webhook endpoint.
- WooCommerce **Test RedeemLoop connection** action for API credential checks and webhook secret HMAC self-test.
- WooCommerce order-received diagnostics for order status, PaymentIntent ID, and selected binding.
- Bilingual merchant admin and WooCommerce pilot guide.

### Verification

- `pnpm --filter @redeemloop/api lint && pnpm --filter @redeemloop/api test`
- `pnpm --filter @redeemloop/sdk lint && pnpm --filter @redeemloop/sdk test`
- `pnpm --filter @redeemloop/pos-verifier lint && pnpm --filter @redeemloop/pos-verifier build`
- `pnpm verify`
- `pnpm audit --audit-level moderate`

### Known Limits

- Merchant admin is a local pilot console, not a hosted multi-tenant SaaS dashboard.
- PHP CLI was unavailable in this environment, so the WooCommerce plugin syntax check could not be run locally here.
- WooCommerce remains a sandbox/pilot plugin and has not been submitted to the WordPress plugin directory.

## 中文

RedeemLoop v0.5.0 新增第一版 merchant operations console，并改进 WooCommerce pilot 路径。

### 新增

- 新增 merchant admin console：`/merchant-admin`。
- API 新增 `GET /v1/payment-intents`，支持按 merchant、binding、status、order 过滤。
- SDK 新增 `listPaymentIntents(...)`。
- Merchant admin 支持 seed pilot vault、entitlement、binding 和 webhook。
- WooCommerce 新增 SKU-to-binding map。
- WooCommerce 后台诊断显示 API base URL、merchant ID、default binding ID 和 webhook endpoint。
- WooCommerce 新增 **Test RedeemLoop connection**，用于检查 API 凭证和 webhook secret HMAC 自检。
- WooCommerce order-received 页面新增订单状态、PaymentIntent ID 和所选 binding 诊断。
- 新增双语 merchant admin 和 WooCommerce pilot guide。

### 验证

- `pnpm --filter @redeemloop/api lint && pnpm --filter @redeemloop/api test`
- `pnpm --filter @redeemloop/sdk lint && pnpm --filter @redeemloop/sdk test`
- `pnpm --filter @redeemloop/pos-verifier lint && pnpm --filter @redeemloop/pos-verifier build`
- `pnpm verify`
- `pnpm audit --audit-level moderate`

### 已知限制

- Merchant admin 是本地 pilot console，不是托管多租户 SaaS dashboard。
- 当前环境没有 PHP CLI，因此这里无法本地执行 WooCommerce plugin 语法检查。
- WooCommerce 仍是 sandbox/pilot plugin，尚未提交到 WordPress plugin directory。
