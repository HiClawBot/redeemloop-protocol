# Rune Production Certification Track

## English

RedeemLoop v0.6.0 adds certification-track hardening for Bitcoin Rune settlement. It does not claim live production certification yet.

### Added Boundaries

- `createFailoverRuneIndexerAdapter([...])` for primary/fallback indexer attempts.
- Failover attempt metadata in `proof.rawProof.failover`.
- `manualReviewOnIndexerError` on `POST /v1/settlement/rune/recheck/:intentId`.
- Manual-review transition when indexers are lagging or unavailable and the caller explicitly asks for manual review.

### API

```http
POST /v1/settlement/rune/recheck/:intentId
```

```json
{
  "txid": "btc_txid",
  "from": "bc1payer",
  "confirmations": 1,
  "manualReviewOnIndexerError": true
}
```

If the configured indexer fails and `manualReviewOnIndexerError` is true, the API returns `202` and moves the `PaymentIntent` to `manual_review`.

### Live Certification Checklist

1. Record wallet provider, wallet version, network, Rune ID/name, merchant vault, and payer address.
2. Complete one UniSat wallet-native `sendRunes` transfer.
3. Complete one Xverse `runes_transfer` transfer.
4. Confirm both txids through the primary indexer.
5. Repeat confirmation with a fallback indexer or mocked fallback in a controlled test.
6. Confirm webhook delivery and commerce mark-as-paid output.
7. Record any indexer lag, conflicting proof, or manual-review intervention.

## 中文

RedeemLoop v0.6.0 为 Bitcoin Rune settlement 增加认证轨道加固，但还不声称已经完成 live production certification。

### 新增边界

- `createFailoverRuneIndexerAdapter([...])`，支持 primary/fallback indexer 尝试。
- 在 `proof.rawProof.failover` 中记录 failover attempt metadata。
- `POST /v1/settlement/rune/recheck/:intentId` 支持 `manualReviewOnIndexerError`。
- 当 indexer lagging 或不可用，且调用方明确要求 manual review 时，PaymentIntent 会进入 `manual_review`。

### API

```http
POST /v1/settlement/rune/recheck/:intentId
```

```json
{
  "txid": "btc_txid",
  "from": "bc1payer",
  "confirmations": 1,
  "manualReviewOnIndexerError": true
}
```

如果配置的 indexer 失败且 `manualReviewOnIndexerError` 为 true，API 会返回 `202`，并将 `PaymentIntent` 推进到 `manual_review`。

### Live Certification Checklist

1. 记录 wallet provider、wallet version、network、Rune ID/name、merchant vault 和 payer address。
2. 完成一次 UniSat 钱包原生 `sendRunes` 转账。
3. 完成一次 Xverse `runes_transfer` 转账。
4. 通过 primary indexer 确认两笔 txid。
5. 使用 fallback indexer 或受控 mocked fallback 再次确认。
6. 确认 webhook delivery 和 commerce mark-as-paid 输出。
7. 记录任何 indexer lag、conflicting proof 或 manual-review intervention。
