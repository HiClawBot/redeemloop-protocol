# RedeemLoop v0.4.3 Release Notes

## English

RedeemLoop v0.4.3 adds EVM Multi-Chain Wallet Beta support.

This version adds:

- Default EVM chain catalog for Ethereum Mainnet (`1`), BNB Smart Chain (`56`), Polygon PoS (`137`), and Arbitrum One (`42161`).
- EIP-1193 wallet adapter for injected wallets such as MetaMask, OKX, Trust, and Coinbase Wallet.
- Wallet network switching through `wallet_switchEthereumChain`.
- Wallet network adding through `wallet_addEthereumChain` when the target chain is missing.
- Wallet transaction sending through `eth_sendTransaction`.
- React Pay Button auto-send and auto-recheck options.
- Script widget auto-send and auto-recheck data attributes.
- Chain-specific EVM receipt recheck routing through `EVM_RPC_URLS`.
- Bilingual integration guide at `docs/EVM_MULTI_CHAIN_WALLET.md`.

Known limits:

- This is wallet integration beta, not a claim that every wallet has been live-certified on every chain.
- Merchants still need production RPC URLs for each enabled chain.
- `pay.aifund.com` is useful as a `window.ethereum` UX reference, but should not be a production hard dependency until its HTTPS certificate is valid for that hostname.
- RedeemLoop still does not issue assets, custody assets, price tokens, or route secondary markets.

## 中文

RedeemLoop v0.4.3 新增 EVM Multi-Chain Wallet Beta 支持。

这一版新增：

- 默认 EVM chain catalog：Ethereum Mainnet (`1`)、BNB Smart Chain (`56`)、Polygon PoS (`137`) 和 Arbitrum One (`42161`)。
- 面向 MetaMask、OKX、Trust、Coinbase Wallet 等注入式钱包的 EIP-1193 wallet adapter。
- 通过 `wallet_switchEthereumChain` 切换钱包网络。
- 目标链未添加时，通过 `wallet_addEthereumChain` 添加钱包网络。
- 通过 `eth_sendTransaction` 发起钱包交易。
- React Pay Button 新增自动发交易和自动 recheck 选项。
- Script widget 新增自动发交易和自动 recheck data attributes。
- 可信 EVM receipt recheck 支持通过 `EVM_RPC_URLS` 按 chainId 路由 RPC。
- 新增双语集成指南：`docs/EVM_MULTI_CHAIN_WALLET.md`。

已知限制：

- 这是 wallet integration beta，不代表每个钱包都已在每条链上完成 live certification。
- 商户仍需要为每条启用的链配置生产 RPC URL。
- `pay.aifund.com` 可作为 `window.ethereum` UX 参考，但在该主机名 HTTPS 证书有效前，不应作为生产硬依赖。
- RedeemLoop 仍不发行资产、不托管资产、不做 token 定价、不做二级市场路由。
