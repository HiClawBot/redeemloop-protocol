# RedeemLoop v0.10.26 Release Notes

## English

v0.10.26 adds a bilingual beta operator runbook for the remaining external certification and publication steps.

### Changed

- Added `docs/BETA_OPERATOR_RUNBOOK.md`.
- Linked the runbook from the English and Chinese README files.
- Linked the runbook from the beta readiness guide.
- The runbook covers GitHub secret setup, funded EVM evidence, WooCommerce evidence, private evidence validation, public release-note generation, strict release gate execution, and GitHub Release publication.

### Verification

- Documentation link scan for the new runbook.
- `corepack pnpm --silent beta:release:gate -- --manifest docs/examples/beta-evidence.manifest.example.json --json`
- `git diff --check`

### Remaining Beta Gap

This release reduces release-operator error, but it does not create live evidence. The first public beta still requires the commerce certification API key, funded EVM wallet certification evidence, live WooCommerce mark-as-paid evidence, and generated public-safe bilingual beta release notes.

## 中文

v0.10.26 新增双语 beta 发布操作手册，用于完成剩余外部认证和发布步骤。

### 变更

- 新增 `docs/BETA_OPERATOR_RUNBOOK.md`。
- 在英文 README 和中文 README 中链接该手册。
- 在 beta readiness guide 中链接该手册。
- 手册覆盖 GitHub secret 设置、funded EVM evidence、WooCommerce evidence、私有 evidence 校验、公开 release notes 生成、strict release gate 运行，以及 GitHub Release 发布。

### 验证

- 检查新增 runbook 的文档链接。
- `corepack pnpm --silent beta:release:gate -- --manifest docs/examples/beta-evidence.manifest.example.json --json`
- `git diff --check`

### 剩余 Beta 缺口

本版本降低发布操作员误操作风险，但不会生成 live evidence。首个公开 beta 仍需要 commerce certification API key、funded EVM wallet certification evidence、真实 WooCommerce mark-as-paid evidence，以及生成后的公开安全双语 beta release notes。
