# Changelog

## Unreleased

### Added

- Concrete EVM ERC-20 transfer request builder in `@redeemloop/adapters`.
- EVM ERC-20 balance check request builder and PaymentIntent check-balance API.
- `transfer.evm.transaction` response on `POST /v1/payment-intents/:intentId/transfer-requested` for wallet-ready ERC-20 `transfer(merchantVault, requiredAmount)` calls.
- Phase 0 console display for generated balance and transfer requests.

### 中文说明

- 在 `@redeemloop/adapters` 中新增具体 EVM ERC-20 transfer request builder。
- 新增 EVM ERC-20 balance check request builder 和 PaymentIntent check-balance API。
- `POST /v1/payment-intents/:intentId/transfer-requested` 现在返回 `transfer.evm.transaction`，可直接用于钱包发起 ERC-20 `transfer(merchantVault, requiredAmount)`。
- Phase 0 控制台会展示生成的 balance request 和 transfer request。

## v0.2.0 - 2026-06-17

RedeemLoop Phase 0 has been realigned as a non-issuing voucher payment gateway.

### Added

- `@redeemloop/core` with v0.2 protocol types, validators, idempotency helpers, and the PaymentIntent state machine.
- `@redeemloop/adapters` with EVM, PSBT builder, wallet, and indexer adapter interfaces.
- `@redeemloop/sdk` with a TypeScript client for entitlements, bindings, PaymentIntents, and settlement proofs.
- v0.2 Fastify APIs for merchants, merchant vaults, entitlements, Asset Bindings, PaymentIntents, settlement proofs, and webhook endpoints.
- Receipt proof handling that advances PaymentIntents and triggers dry-run mark-as-paid adapters.
- v0.2 webhook endpoint test requests with `X-RedeemLoop-Timestamp`, `X-RedeemLoop-Nonce`, and HMAC signature headers.
- Local Phase 0 console for Asset Binding, Voucher Tender, PaymentIntent, receipt confirmation, and mark-as-paid demo flows.
- v0.2 docs, whitepaper, construction guide, API model, boundary document, integration guide, commerce adapter guide, and release notes.
- Bilingual English/Chinese README for the public release.

### Changed

- Public positioning changed from an issuance/redemption system to "bring your own voucher asset, RedeemLoop binds and settles."
- Commerce flow now centers on external voucher payment and mark-as-paid instead of commerce-order workaround language.
- The Solidity package is documented as an EVM ERC-20 voucher asset example, not a core issuance module.
- Legacy v0.1 relayer routes remain only as compatibility coverage while new integrations use `/v1/payment-intents` and `/v1/settlement/proofs`.

### Security

- Added validator coverage for voucher asset descriptors, bindings, PaymentIntents, and settlement proofs.
- Added proof idempotency keys and mark-as-paid idempotency keys.
- Commerce adapter metadata now carries `intentId` and generic `assetId`.
- Public docs clarify that RedeemLoop does not custody assets or private keys.

### Known Limitations

- Service state is still in-memory.
- Mark-as-paid adapters default to dry-run unless platform credentials are configured.
- EVM ERC-20 tender is the only implemented runtime path; Bitcoin, Fractal, Rune, and Inscription support is currently interface-level.
- Contracts are unaudited example code.

## v0.2.0 - 2026-06-17 中文说明

RedeemLoop Phase 0 已重新对齐为非发行型提货券支付网关。

### 新增

- `@redeemloop/core`：v0.2 协议类型、校验器、幂等 helper 和 PaymentIntent 状态机。
- `@redeemloop/adapters`：EVM、PSBT builder、钱包、索引器 adapter interfaces。
- `@redeemloop/sdk`：entitlement、binding、PaymentIntent、settlement proof 的 TypeScript client。
- v0.2 Fastify API：merchant、merchant vault、entitlement、Asset Binding、PaymentIntent、settlement proof、webhook endpoint。
- 收券 proof 处理：推进 PaymentIntent，并触发 dry-run mark-as-paid adapter。
- v0.2 webhook endpoint 测试请求：包含 `X-RedeemLoop-Timestamp`、`X-RedeemLoop-Nonce` 和 HMAC 签名头。
- 本地 Phase 0 控制台：Asset Binding、Voucher Tender、PaymentIntent、收券确认、mark-as-paid 演示。
- v0.2 文档、白皮书、施工文档、API 模型、边界文档、集成指南、电商适配指南和发布说明。
- 英文 + 中文 README。

### 变更

- 对外定位改为“厂商自带提货资产，RedeemLoop 做绑定与结算”。
- 电商流程以外部提货券支付和 mark-as-paid 为中心。
- Solidity 包被标记为 EVM ERC-20 提货资产示例，不是核心发行模块。
- 旧 v0.1 relayer 路由仅作为兼容覆盖保留，新集成使用 `/v1/payment-intents` 和 `/v1/settlement/proofs`。

### 安全

- 增加 voucher asset descriptor、binding、PaymentIntent、settlement proof 校验覆盖。
- 增加 proof 幂等 key 和 mark-as-paid 幂等 key。
- Commerce adapter metadata 现在携带 `intentId` 和通用 `assetId`。
- 公开文档明确 RedeemLoop 不托管资产或私钥。

### 已知限制

- 服务状态仍为内存存储。
- mark-as-paid adapter 默认 dry-run，除非配置平台凭证。
- 当前只有 EVM ERC-20 tender 是已实现运行路径；Bitcoin、Fractal、Rune、Inscription 当前为接口级支持。
- 合约是未审计示例代码。
