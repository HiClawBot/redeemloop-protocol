# RedeemLoop v0.10.21 Release Notes

## English

v0.10.21 adds a read-only beta release preflight so release operators can see the remaining publication blockers before running the final gate.

### Changed

- Added `pnpm beta:release:preflight`.
- The preflight summarizes required evidence artifact readiness from the beta evidence manifest.
- With `--github`, the preflight verifies required GitHub repository secret names through `gh secret list` without reading secret values.
- CI now syntax-checks the preflight script and verifies its help output.
- Beta readiness and execution-plan docs now include the preflight command.

### Verification

- `node --check scripts/beta-release-preflight.mjs`
- `pnpm --silent beta:release:preflight -- --help`
- `pnpm --silent beta:release:preflight -- --manifest docs/examples/beta-evidence.manifest.example.json --json`
- `pnpm --silent beta:release:preflight -- --manifest docs/examples/beta-evidence.manifest.example.json --github --repo RedeemLoopProtocol/redeemloop-protocol --json`
- `pnpm --silent beta:release:gate -- --manifest docs/examples/beta-evidence.manifest.example.json --json`

### Remaining Beta Gap

The preflight is an operator checklist. It does not create live evidence. Funded EVM wallet and WooCommerce test-store artifacts are still required before generating the final beta release summary.

## 中文

v0.10.21 新增只读 beta release preflight，让发布操作员在运行最终 gate 前看清剩余发布阻断项。

### 变更

- 新增 `pnpm beta:release:preflight`。
- Preflight 会根据 beta evidence manifest 汇总必需 evidence artifact 的就绪状态。
- 传入 `--github` 时，preflight 会通过 `gh secret list` 检查必需 GitHub repository secret 名称是否存在，但不会读取 secret 值。
- CI 现在会检查 preflight 脚本语法和 help 输出。
- Beta readiness 和 execution-plan 文档已加入 preflight 命令。

### 验证

- `node --check scripts/beta-release-preflight.mjs`
- `pnpm --silent beta:release:preflight -- --help`
- `pnpm --silent beta:release:preflight -- --manifest docs/examples/beta-evidence.manifest.example.json --json`
- `pnpm --silent beta:release:preflight -- --manifest docs/examples/beta-evidence.manifest.example.json --github --repo RedeemLoopProtocol/redeemloop-protocol --json`
- `pnpm --silent beta:release:gate -- --manifest docs/examples/beta-evidence.manifest.example.json --json`

### 剩余 Beta 缺口

Preflight 是操作员 checklist，不会生成 live evidence。最终生成 beta release summary 前，仍需要 funded EVM wallet 和 WooCommerce test-store artifacts。
