# RedeemLoop v0.10.32 Release Notes

## English

v0.10.32 adds a read-only planner for the remaining live certification runs.

### Changed

- Added `scripts/plan-beta-certification-runs.mjs`.
- Added `pnpm beta:certification:plan`.
- Added `docs/examples/beta-certification-inputs.example.json`.
- The planner validates funded EVM and WooCommerce workflow input formats before dispatch.
- It checks that both planned workflow runs describe the same PaymentIntent, chain ID, transaction hash, voucher token, receiver, and raw amount.
- It can optionally print copyable `gh workflow run` commands with `--commands`.
- The planner does not send transactions, call commerce APIs, read secrets, or dispatch workflows.
- Beta readiness docs, the operator runbook, and the beta release execution plan now include the planner before running certification workflows.

### Verification

- `node --check scripts/plan-beta-certification-runs.mjs`
- `corepack pnpm --silent beta:certification:plan -- --help`
- `corepack pnpm --silent beta:certification:plan -- --input docs/examples/beta-certification-inputs.example.json --json`
- `corepack pnpm --silent beta:certification:plan -- --input docs/examples/beta-certification-inputs.example.json --commands`
- Negative fixture check for mismatched WooCommerce transaction hash.
- Scoped `git diff --check` on the v0.10.32 files.

### Remaining Beta Gap

This release does not create the live artifacts. The first public beta still requires `REDEEMLOOP_COMMERCE_CERTIFICATION_API_KEY`, one funded ERC-20 voucher transfer, the EVM certification workflow artifact, the WooCommerce mark-as-paid workflow artifact, generated public-safe bilingual beta release notes, and a passing final gate.

## 中文

v0.10.32 为剩余 live certification runs 新增只读 planner。

### 变更

- 新增 `scripts/plan-beta-certification-runs.mjs`。
- 新增 `pnpm beta:certification:plan`。
- 新增 `docs/examples/beta-certification-inputs.example.json`。
- Planner 会在 dispatch 前校验 funded EVM 和 WooCommerce workflow input 格式。
- 它会检查两个 planned workflow runs 是否描述同一个 PaymentIntent、chain ID、transaction hash、voucher token、receiver 和 raw amount。
- 它可以通过 `--commands` 可选输出可复制的 `gh workflow run` 命令。
- Planner 不发交易、不调用 commerce API、不读取 secret，也不触发 workflow。
- Beta readiness 文档、operator runbook 和 beta release execution plan 现在会在运行 certification workflows 前加入该 planner。

### 验证

- `node --check scripts/plan-beta-certification-runs.mjs`
- `corepack pnpm --silent beta:certification:plan -- --help`
- `corepack pnpm --silent beta:certification:plan -- --input docs/examples/beta-certification-inputs.example.json --json`
- `corepack pnpm --silent beta:certification:plan -- --input docs/examples/beta-certification-inputs.example.json --commands`
- 使用 WooCommerce transaction hash 不一致的 negative fixture 校验失败路径。
- 对 v0.10.32 相关文件运行 scoped `git diff --check`。

### 剩余 Beta 缺口

本版本不会生成 live artifacts。首个公开 beta 仍需要 `REDEEMLOOP_COMMERCE_CERTIFICATION_API_KEY`、一笔 funded ERC-20 提货券转账、EVM certification workflow artifact、WooCommerce mark-as-paid workflow artifact、生成后的公开安全双语 beta release notes，以及通过最终 gate。
