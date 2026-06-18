# RedeemLoop v0.4.2 Release Notes

## English

RedeemLoop v0.4.2 connects the Bitcoin Rune wallet/indexer beta to the API settlement loop.

This version adds:

- `POST /v1/settlement/rune/recheck/:intentId`.
- API wiring for a configured `RuneIndexerAdapter`.
- Default Xverse API indexer construction from `XVERSE_API_KEY`, `XVERSE_NETWORK`, and optional `XVERSE_API_BASE_URL`.
- SDK helper `client.recheckRuneSettlement(intentId, { txid, from, confirmations })`.
- Tests proving a Rune txid can be rechecked through an indexer adapter, converted into a `VoucherPaymentProof`, and advanced to a paid `PaymentIntent`.
- Clear errors when Rune settlement recheck is called without indexer credentials.
- Updated bilingual docs for real Rune merchant integration.

Known limits:

- This still has not been live-certified here with funded UniSat/Xverse wallets and a real Xverse API key.
- The API `transfer.bitcoin.psbtBase64` response remains a PSBT fixture boundary, not a production PSBT builder.
- Multi-indexer failover and browser live-test runbooks remain future hardening work.
- RedeemLoop still does not etch Runes, inscribe Ordinals, mint NFTs, custody assets, price tokens, or route secondary markets.

## 中文

RedeemLoop v0.4.2 把 Bitcoin Rune 钱包/索引器 beta 接入 API settlement loop。

这一版新增：

- `POST /v1/settlement/rune/recheck/:intentId`。
- API 支持配置好的 `RuneIndexerAdapter`。
- 默认可通过 `XVERSE_API_KEY`、`XVERSE_NETWORK` 和可选 `XVERSE_API_BASE_URL` 创建 Xverse API indexer。
- SDK helper：`client.recheckRuneSettlement(intentId, { txid, from, confirmations })`。
- 新增测试，证明 Rune txid 可以通过 indexer adapter recheck，转换成 `VoucherPaymentProof`，并把 `PaymentIntent` 推进到 paid。
- 缺少 indexer credentials 时返回明确错误。
- 更新真实 Rune 商户集成相关双语文档。

已知限制：

- 当前仍未在本环境中使用有余额的 UniSat/Xverse 钱包和真实 Xverse API key 完成 live certification。
- API `transfer.bitcoin.psbtBase64` 响应仍是 PSBT fixture boundary，不是生产级 PSBT builder。
- 多索引器容灾和浏览器 live-test runbook 仍是后续 hardening 工作。
- RedeemLoop 仍不 etch Rune、不 inscribe Ordinal、不 mint NFT、不托管资产、不做 token 定价、不做二级市场路由。
