# RedeemLoop v0.5.1

## English

RedeemLoop v0.5.1 upgrades the Shopify mark-as-paid path from dry-run surface to private-app alpha integration support.

### Added

- `GET /v1/diagnostics/shopify`.
- SDK `getShopifyDiagnostics()`.
- Shopify Admin GraphQL response handling for top-level `errors` and `orderMarkAsPaid.userErrors`.
- Mocked Shopify Admin API tests for paid success and user-error failure.
- Shopify order ID normalization from numeric IDs to `gid://shopify/Order/...`.
- Bilingual Shopify adapter alpha guide.

### Verification

- `pnpm --filter @redeemloop/api lint && pnpm --filter @redeemloop/api test`
- `pnpm --filter @redeemloop/sdk lint && pnpm --filter @redeemloop/sdk test`

### Known Limits

- This is a private-app alpha path, not a reviewed Shopify payment app.
- No live Shopify store/token certification was run in this environment.
- Keep `RELAYER_DRY_RUN=true` until a pilot store confirms Admin API permissions and order lifecycle behavior.

## 中文

RedeemLoop v0.5.1 将 Shopify mark-as-paid 从 dry-run 表面升级为 private-app alpha integration support。

### 新增

- `GET /v1/diagnostics/shopify`。
- SDK `getShopifyDiagnostics()`。
- Shopify Admin GraphQL 顶层 `errors` 和 `orderMarkAsPaid.userErrors` 处理。
- Mocked Shopify Admin API 测试，覆盖 paid success 和 user-error failure。
- Shopify 数字 order ID 自动规范化为 `gid://shopify/Order/...`。
- 新增双语 Shopify adapter alpha guide。

### 验证

- `pnpm --filter @redeemloop/api lint && pnpm --filter @redeemloop/api test`
- `pnpm --filter @redeemloop/sdk lint && pnpm --filter @redeemloop/sdk test`

### 已知限制

- 这是 private-app alpha 路径，不是已经过审的 Shopify payment app。
- 当前环境没有执行真实 Shopify store/token certification。
- 在 pilot store 确认 Admin API 权限和订单生命周期前，保持 `RELAYER_DRY_RUN=true`。
