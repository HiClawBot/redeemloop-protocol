# RedeemLoop v0.2.3 Release Notes

## English

RedeemLoop v0.2.3 is the Trusted EVM Settlement Worker release.

This version adds:

- ERC-20 `Transfer` receipt verification in `@redeemloop/adapters`.
- `POST /v1/settlement/evm/recheck/:intentId` for trusted settlement rechecks.
- `broadcastTxid` tracking on PaymentIntent.
- SDK `recheckEvmSettlement`.
- Configurable confirmation policy through `EVM_MIN_CONFIRMATIONS`.
- Tests for adapter-level receipt verification and API-level trusted settlement.

Known limits:

- The worker currently supports EVM ERC-20 voucher assets only.
- A configured `RPC_URL` is required outside tests.
- Client-submitted proofs remain available for sandbox/manual flows.

## 中文

RedeemLoop v0.2.3 是 Trusted EVM Settlement Worker 版本。

这一版新增：

- `@redeemloop/adapters` 中的 ERC-20 `Transfer` receipt 校验。
- `POST /v1/settlement/evm/recheck/:intentId` 可信 settlement recheck。
- PaymentIntent 上的 `broadcastTxid` 跟踪。
- SDK `recheckEvmSettlement`。
- 通过 `EVM_MIN_CONFIRMATIONS` 配置确认数策略。
- adapter 层 receipt 校验和 API 层 trusted settlement 测试。

已知限制：

- worker 当前只支持 EVM ERC-20 提货资产。
- 测试之外需要配置 `RPC_URL`。
- 客户端提交 proof 仍保留用于 sandbox/manual flow。
