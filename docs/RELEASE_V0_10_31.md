# RedeemLoop v0.10.31 Release Notes

## English

v0.10.31 adds a narrow secret-readiness check for the first beta release path.

### Changed

- Added `scripts/check-beta-secrets.mjs`.
- Added `pnpm beta:secrets:check`.
- The command verifies required GitHub repository secret names with `gh secret list`.
- It can also check matching local environment variables with `--env`.
- It never reads or prints secret values.
- Beta readiness docs, the operator runbook, and the beta release execution plan now use this narrower check before the full evidence preflight.

### Verification

- `node --check scripts/check-beta-secrets.mjs`
- `corepack pnpm --silent beta:secrets:check -- --help`
- `corepack pnpm --silent beta:secrets:check -- --repo RedeemLoopProtocol/redeemloop-protocol --json`
- `corepack pnpm --silent beta:release:preflight -- --manifest evidence/beta-evidence.manifest.json --github --repo RedeemLoopProtocol/redeemloop-protocol --json`
- Scoped `git diff --check` on the v0.10.31 files.

### Remaining Beta Gap

This release does not add the missing secret or create live certification evidence. The first public beta still requires `REDEEMLOOP_COMMERCE_CERTIFICATION_API_KEY`, funded EVM wallet certification evidence, live WooCommerce mark-as-paid evidence, generated public-safe bilingual beta release notes, and a passing final gate.

## 中文

v0.10.31 为首个 beta 发布路径新增一个聚焦的 secret readiness 检查。

### 变更

- 新增 `scripts/check-beta-secrets.mjs`。
- 新增 `pnpm beta:secrets:check`。
- 该命令通过 `gh secret list` 检查必需 GitHub repository secret 名称。
- 也可以通过 `--env` 检查当前本地环境变量是否存在。
- 它不会读取或打印 secret 值。
- Beta readiness 文档、operator runbook 和 beta release execution plan 现在会在完整 evidence preflight 前使用这个更窄的检查。

### 验证

- `node --check scripts/check-beta-secrets.mjs`
- `corepack pnpm --silent beta:secrets:check -- --help`
- `corepack pnpm --silent beta:secrets:check -- --repo RedeemLoopProtocol/redeemloop-protocol --json`
- `corepack pnpm --silent beta:release:preflight -- --manifest evidence/beta-evidence.manifest.json --github --repo RedeemLoopProtocol/redeemloop-protocol --json`
- 对 v0.10.31 相关文件运行 scoped `git diff --check`。

### 剩余 Beta 缺口

本版本不会添加缺失 secret，也不会生成真实认证 evidence。首个公开 beta 仍需要 `REDEEMLOOP_COMMERCE_CERTIFICATION_API_KEY`、funded EVM wallet certification evidence、真实 WooCommerce mark-as-paid evidence、生成后的公开安全双语 beta release notes，以及通过最终 gate。
