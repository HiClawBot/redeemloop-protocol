# RedeemLoop v0.6.0

## English

RedeemLoop v0.6.0 starts the Rune production certification track with failover indexer boundaries and manual-review recovery.

### Added

- `createFailoverRuneIndexerAdapter(...)`.
- Rune indexer failover attempt metadata in `proof.rawProof.failover`.
- `manualReviewOnIndexerError` support for API-level Rune settlement recheck.
- Rune recheck `202 manual_review` response when configured indexers fail and manual review is requested.
- Bilingual Rune production certification track guide.

### Verification

- `pnpm --filter @redeemloop/adapters lint && pnpm --filter @redeemloop/adapters test`
- `pnpm --filter @redeemloop/api lint && pnpm --filter @redeemloop/api test`
- `pnpm --filter @redeemloop/sdk lint && pnpm --filter @redeemloop/sdk test`

### Known Limits

- No funded UniSat/Xverse live transfer certification was run in this environment.
- Multi-indexer support is now an adapter boundary; deployments still need real secondary indexer credentials.
- The PSBT payload remains a fixture boundary, not a production PSBT engine.

## 中文

RedeemLoop v0.6.0 启动 Rune production certification track，新增 indexer failover 边界和 manual-review 恢复。

### 新增

- `createFailoverRuneIndexerAdapter(...)`。
- 在 `proof.rawProof.failover` 中记录 Rune indexer failover attempt metadata。
- API-level Rune settlement recheck 支持 `manualReviewOnIndexerError`。
- 当配置的 indexer 失败且请求 manual review 时，Rune recheck 返回 `202 manual_review`。
- 新增双语 Rune production certification track guide。

### 验证

- `pnpm --filter @redeemloop/adapters lint && pnpm --filter @redeemloop/adapters test`
- `pnpm --filter @redeemloop/api lint && pnpm --filter @redeemloop/api test`
- `pnpm --filter @redeemloop/sdk lint && pnpm --filter @redeemloop/sdk test`

### 已知限制

- 当前环境没有执行有余额的 UniSat/Xverse live transfer certification。
- Multi-indexer support 目前是 adapter boundary；实际部署仍需要真实 secondary indexer credentials。
- PSBT payload 仍是 fixture boundary，不是生产级 PSBT engine。
