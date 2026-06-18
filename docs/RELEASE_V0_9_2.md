# RedeemLoop v0.9.2 Release Notes

## English

RedeemLoop v0.9.2 is a deployment and CI patch for the v0.9.1 official website release.

### Fixed

- GitHub Pages workflow now passes `enablement: true` to `actions/configure-pages`, allowing the workflow to initialize Pages when the repository has not been enabled yet.
- `@redeemloop/react` and `@redeemloop/widget` tests now prebuild `@redeemloop/core`, `@redeemloop/adapters`, and `@redeemloop/sdk`, so clean CI environments can resolve workspace package `dist` entry points.

### Status

No payment behavior changes. The website and scenario model remain the public open-source entry point; production payment readiness still depends on live wallet, RPC, database, and commerce-store certification.

## 中文

RedeemLoop v0.9.2 是 v0.9.1 官网版本的部署与 CI 修复版。

### 修复

- GitHub Pages workflow 现在会向 `actions/configure-pages` 传入 `enablement: true`，当仓库尚未启用 Pages 时，workflow 可以尝试初始化 Pages。
- `@redeemloop/react` 和 `@redeemloop/widget` 测试前会预构建 `@redeemloop/core`、`@redeemloop/adapters` 和 `@redeemloop/sdk`，让干净 CI 环境可以解析 workspace package 的 `dist` 入口。

### 状态

没有支付行为变更。官网和场景模型仍然是开源项目公开入口；生产支付可用度仍取决于真实钱包、RPC、数据库和电商店铺认证。
