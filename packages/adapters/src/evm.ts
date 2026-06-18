import {
  decodeEventLog,
  encodeFunctionData,
  getAddress,
  parseAbi,
  parseAbiItem,
  type Address,
  type Hex,
} from "viem";
import type { VoucherAssetDescriptor, VoucherPaymentProof } from "@redeemloop/core";

export const erc20TransferAbi = parseAbi(["function transfer(address to, uint256 amount) returns (bool)"]);
export const erc20BalanceOfAbi = parseAbi(["function balanceOf(address account) view returns (uint256)"]);
export const erc20TransferEvent = parseAbiItem("event Transfer(address indexed from, address indexed to, uint256 value)");

export interface EvmChainConfig {
  chainNamespace: "eip155";
  chainId: number;
  chainIdHex: Hex;
  name: string;
  shortName: string;
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  rpcUrls: string[];
  blockExplorerUrls: string[];
  aliases: string[];
}

export interface Eip1193RequestArguments {
  method: string;
  params?: readonly unknown[] | Record<string, unknown>;
}

export interface Eip1193Provider {
  request<T = unknown>(args: Eip1193RequestArguments): Promise<T>;
}

export interface EvmWalletAccount {
  address: Address;
  chainId: number;
  chainIdHex: Hex;
}

export interface EvmWalletAdapterOptions {
  chains?: readonly EvmChainConfig[];
}

export interface EvmWalletConnectInput {
  chainId?: number;
  switchChain?: boolean;
}

export interface EvmWalletSendInput {
  from?: string;
  switchChain?: boolean;
}

export interface EvmWalletAdapter {
  connect(input?: EvmWalletConnectInput): Promise<EvmWalletAccount>;
  switchChain(chainId: number): Promise<void>;
  addChain(chainId: number): Promise<void>;
  sendErc20Transfer(transfer: Erc20TransferRequest, input?: EvmWalletSendInput): Promise<Hex>;
}

export const redeemLoopEvmChains = [
  {
    chainNamespace: "eip155",
    chainId: 1,
    chainIdHex: "0x1",
    name: "Ethereum Mainnet",
    shortName: "ETH",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://ethereum-rpc.publicnode.com"],
    blockExplorerUrls: ["https://etherscan.io"],
    aliases: ["ethereum", "eth", "erc20"],
  },
  {
    chainNamespace: "eip155",
    chainId: 56,
    chainIdHex: "0x38",
    name: "BNB Smart Chain",
    shortName: "BSC",
    nativeCurrency: { name: "BNB", symbol: "BNB", decimals: 18 },
    rpcUrls: ["https://bsc-dataseed.binance.org"],
    blockExplorerUrls: ["https://bscscan.com"],
    aliases: ["bsc", "bnb", "binance-smart-chain", "bep20"],
  },
  {
    chainNamespace: "eip155",
    chainId: 137,
    chainIdHex: "0x89",
    name: "Polygon PoS",
    shortName: "POL",
    nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"],
    aliases: ["polygon", "polygon-pos", "matic", "pol"],
  },
  {
    chainNamespace: "eip155",
    chainId: 42161,
    chainIdHex: "0xa4b1",
    name: "Arbitrum One",
    shortName: "ARB",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: ["https://arb1.arbitrum.io/rpc"],
    blockExplorerUrls: ["https://arbiscan.io"],
    aliases: ["arbitrum", "arbitrum-one", "arb"],
  },
] as const satisfies readonly EvmChainConfig[];

export const supportedRedeemLoopEvmChainIds = redeemLoopEvmChains.map((chain) => chain.chainId);

export interface Erc20BalanceCheckInput {
  account: string;
  asset: VoucherAssetDescriptor;
  requiredAmount?: string;
  balance?: string;
}

export interface Erc20BalanceCheckRequest {
  chainNamespace: "eip155";
  chainId: number;
  assetType: "erc20";
  account: Address;
  contract: Address;
  requiredAmount: string;
  call: {
    chainId: number;
    to: Address;
    data: Hex;
    functionName: "balanceOf";
    args: [Address];
  };
  providedBalance?: string;
  hasSufficientBalance?: boolean;
  shortfall?: string;
}

export interface Erc20TransferRequestInput {
  from?: string;
  to: string;
  asset: VoucherAssetDescriptor;
  amount?: string;
}

export interface Erc20TransferRequest {
  chainNamespace: "eip155";
  chainId: number;
  assetType: "erc20";
  from?: Address;
  to: Address;
  contract: Address;
  amount: string;
  transaction: {
    chainId: number;
    from?: Address;
    to: Address;
    data: Hex;
    value: "0x0";
    functionName: "transfer";
    args: [Address, string];
  };
}

export interface Erc20PaymentProofInput {
  proofId: string;
  intentId: string;
  asset: VoucherAssetDescriptor;
  txid: string;
  from: string;
  to: string;
  amount?: string;
  blockNumber?: number;
  blockHash?: string;
  confirmations?: number;
  logIndex?: number;
  status?: VoucherPaymentProof["status"];
  rawProof?: unknown;
}

export interface Erc20ReceiptLog {
  address: string;
  topics: readonly Hex[];
  data: Hex;
  logIndex?: number;
}

export interface Erc20TransactionReceiptLike {
  transactionHash?: Hex;
  blockNumber?: bigint | number;
  blockHash?: Hex;
  status?: "success" | "reverted" | string;
  logs: Erc20ReceiptLog[];
}

export interface VerifyErc20TransferReceiptInput {
  proofId?: string;
  intentId: string;
  txid: string;
  receipt: Erc20TransactionReceiptLike;
  asset: VoucherAssetDescriptor;
  from: string;
  to: string;
  amount?: string;
  currentBlockNumber?: bigint | number;
  minConfirmations?: number;
  rawProof?: unknown;
}

export function getRedeemLoopEvmChainConfig(chainIdOrAlias: number | string, chains: readonly EvmChainConfig[] = redeemLoopEvmChains): EvmChainConfig {
  if (typeof chainIdOrAlias === "number") {
    const config = chains.find((chain) => chain.chainId === chainIdOrAlias);
    if (config) return config;
  } else {
    const normalized = chainIdOrAlias.trim().toLowerCase();
    const numeric = normalized.startsWith("0x") ? Number.parseInt(normalized, 16) : Number(normalized);
    const config = Number.isSafeInteger(numeric)
      ? chains.find((chain) => chain.chainId === numeric)
      : chains.find((chain) => chain.aliases.includes(normalized) || chain.shortName.toLowerCase() === normalized);
    if (config) return config;
  }
  throw new Error(`Unsupported EVM chain: ${chainIdOrAlias}`);
}

export function evmChainIdToHex(chainId: number): Hex {
  if (!Number.isSafeInteger(chainId) || chainId <= 0) throw new Error("chainId must be a positive integer");
  return `0x${chainId.toString(16)}` as Hex;
}

export function parseEvmChainId(value: unknown): number {
  if (typeof value === "number" && Number.isSafeInteger(value) && value > 0) return value;
  if (typeof value !== "string" || !value.trim()) throw new Error("chainId must be a hex or decimal string");
  const normalized = value.trim().toLowerCase();
  const parsed = normalized.startsWith("0x") ? Number.parseInt(normalized, 16) : Number(normalized);
  if (!Number.isSafeInteger(parsed) || parsed <= 0) throw new Error("chainId must be a positive integer");
  return parsed;
}

export function createEip1193EvmWalletAdapter(provider: Eip1193Provider, options: EvmWalletAdapterOptions = {}): EvmWalletAdapter {
  const chains = options.chains ?? redeemLoopEvmChains;
  return {
    async connect(input = {}) {
      const accounts = await provider.request<string[]>({ method: "eth_requestAccounts" });
      const address = normalizeWalletAccount(accounts);
      if (input.chainId !== undefined && input.switchChain !== false) {
        await ensureEvmWalletChain(provider, input.chainId, chains);
      }
      const chainIdHex = await provider.request<string>({ method: "eth_chainId" });
      const chainId = parseEvmChainId(chainIdHex);
      return { address, chainId, chainIdHex: evmChainIdToHex(chainId) };
    },
    async switchChain(chainId) {
      await ensureEvmWalletChain(provider, chainId, chains);
    },
    async addChain(chainId) {
      await addEvmWalletChain(provider, getRedeemLoopEvmChainConfig(chainId, chains));
    },
    async sendErc20Transfer(transfer, input = {}) {
      if (input.switchChain !== false) {
        await ensureEvmWalletChain(provider, transfer.chainId, chains);
      }
      const from = input.from ?? transfer.transaction.from ?? normalizeWalletAccount(await provider.request<string[]>({ method: "eth_requestAccounts" }));
      const txid = await provider.request<unknown>({
        method: "eth_sendTransaction",
        params: [
          {
            from: getAddress(from),
            to: transfer.transaction.to,
            data: transfer.transaction.data,
            value: transfer.transaction.value,
          },
        ],
      });
      if (typeof txid !== "string" || !/^0x[0-9a-fA-F]+$/.test(txid)) throw new Error("Wallet did not return a transaction hash");
      return txid as Hex;
    },
  };
}

export async function ensureEvmWalletChain(
  provider: Eip1193Provider,
  chainId: number,
  chains: readonly EvmChainConfig[] = redeemLoopEvmChains,
): Promise<void> {
  const target = evmChainIdToHex(chainId);
  const current = await provider.request<string>({ method: "eth_chainId" }).catch(() => undefined);
  if (current && parseEvmChainId(current) === chainId) return;
  try {
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: target }],
    });
  } catch (error) {
    if (!isUnknownChainError(error)) throw error;
    await addEvmWalletChain(provider, getRedeemLoopEvmChainConfig(chainId, chains));
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: target }],
    });
  }
}

export async function addEvmWalletChain(provider: Eip1193Provider, chain: EvmChainConfig): Promise<void> {
  await provider.request({
    method: "wallet_addEthereumChain",
    params: [
      {
        chainId: chain.chainIdHex,
        chainName: chain.name,
        nativeCurrency: chain.nativeCurrency,
        rpcUrls: chain.rpcUrls,
        blockExplorerUrls: chain.blockExplorerUrls,
      },
    ],
  });
}

export function buildErc20TransferRequest(input: Erc20TransferRequestInput): Erc20TransferRequest {
  assertErc20Asset(input.asset);
  const amount = input.amount ?? input.asset.requiredAmount;
  assertPositiveIntegerString(amount, "amount");
  const receiver = getAddress(input.to);
  const contract = getAddress(input.asset.contract);
  const from = input.from ? getAddress(input.from) : undefined;
  const data = encodeFunctionData({
    abi: erc20TransferAbi,
    functionName: "transfer",
    args: [receiver, BigInt(amount)],
  });

  return {
    chainNamespace: "eip155",
    chainId: input.asset.chainId,
    assetType: "erc20",
    from,
    to: receiver,
    contract,
    amount,
    transaction: {
      chainId: input.asset.chainId,
      from,
      to: contract,
      data,
      value: "0x0",
      functionName: "transfer",
      args: [receiver, amount],
    },
  };
}

export function buildErc20BalanceCheckRequest(input: Erc20BalanceCheckInput): Erc20BalanceCheckRequest {
  assertErc20Asset(input.asset);
  const account = getAddress(input.account);
  const contract = getAddress(input.asset.contract);
  const requiredAmount = input.requiredAmount ?? input.asset.requiredAmount;
  assertPositiveIntegerString(requiredAmount, "requiredAmount");
  const data = encodeFunctionData({
    abi: erc20BalanceOfAbi,
    functionName: "balanceOf",
    args: [account],
  });
  const evaluated = input.balance === undefined ? {} : evaluateErc20Balance(input.balance, requiredAmount);

  return {
    chainNamespace: "eip155",
    chainId: input.asset.chainId,
    assetType: "erc20",
    account,
    contract,
    requiredAmount,
    call: {
      chainId: input.asset.chainId,
      to: contract,
      data,
      functionName: "balanceOf",
      args: [account],
    },
    providedBalance: input.balance,
    ...evaluated,
  };
}

export function evaluateErc20Balance(balance: string, requiredAmount: string): {
  hasSufficientBalance: boolean;
  shortfall: string;
} {
  assertNonNegativeIntegerString(balance, "balance");
  assertPositiveIntegerString(requiredAmount, "requiredAmount");
  const balanceValue = BigInt(balance);
  const requiredValue = BigInt(requiredAmount);
  return {
    hasSufficientBalance: balanceValue >= requiredValue,
    shortfall: balanceValue >= requiredValue ? "0" : String(requiredValue - balanceValue),
  };
}

export function createErc20PaymentProof(input: Erc20PaymentProofInput): VoucherPaymentProof {
  assertErc20Asset(input.asset);
  const amount = input.amount ?? input.asset.requiredAmount;
  assertPositiveIntegerString(amount, "amount");
  return {
    proofId: input.proofId,
    intentId: input.intentId,
    chainNamespace: "eip155",
    chainId: input.asset.chainId,
    txid: input.txid,
    blockNumber: input.blockNumber,
    blockHash: input.blockHash,
    confirmations: input.confirmations ?? 0,
    from: getAddress(input.from),
    to: getAddress(input.to),
    assetType: "erc20",
    assetId: input.asset.assetId,
    contract: getAddress(input.asset.contract),
    amount,
    logIndex: input.logIndex,
    status: input.status ?? "seen",
    rawProof: input.rawProof,
  };
}

export function verifyErc20TransferReceipt(input: VerifyErc20TransferReceiptInput): VoucherPaymentProof {
  assertErc20Asset(input.asset);
  if (input.receipt.status === "reverted") throw new Error("EVM transaction receipt is reverted");
  const txid = input.receipt.transactionHash ?? input.txid;
  if (txid.toLowerCase() !== input.txid.toLowerCase()) throw new Error("EVM transaction receipt hash does not match txid");
  const contract = getAddress(input.asset.contract);
  const expectedFrom = getAddress(input.from);
  const expectedTo = getAddress(input.to);
  const amount = input.amount ?? input.asset.requiredAmount;
  assertPositiveIntegerString(amount, "amount");
  const expectedAmount = BigInt(amount);
  const matchingLog = input.receipt.logs.find((log) => {
    if (getAddress(log.address) !== contract) return false;
    try {
      const decoded = decodeEventLog({
        abi: [erc20TransferEvent],
        data: log.data,
        topics: log.topics as [Hex, ...Hex[]],
      });
      if (decoded.eventName !== "Transfer") return false;
      const args = decoded.args as { from: Address; to: Address; value: bigint };
      return getAddress(args.from) === expectedFrom && getAddress(args.to) === expectedTo && args.value === expectedAmount;
    } catch {
      return false;
    }
  });
  if (!matchingLog) throw new Error("No matching ERC-20 Transfer log found for PaymentIntent");

  const confirmations = confirmationCount(input.receipt.blockNumber, input.currentBlockNumber);
  const minConfirmations = input.minConfirmations ?? 1;

  return {
    proofId: input.proofId ?? `proof_evm_${input.txid.slice(2, 14)}_${matchingLog.logIndex ?? 0}`,
    intentId: input.intentId,
    chainNamespace: "eip155",
    chainId: input.asset.chainId,
    txid: input.txid,
    blockNumber: input.receipt.blockNumber === undefined ? undefined : Number(input.receipt.blockNumber),
    blockHash: input.receipt.blockHash,
    confirmations,
    from: expectedFrom,
    to: expectedTo,
    assetType: "erc20",
    assetId: input.asset.assetId,
    contract,
    amount,
    logIndex: matchingLog.logIndex,
    status: confirmations >= minConfirmations ? "confirmed" : "seen",
    rawProof: input.rawProof,
  };
}

export function assertErc20Asset(asset: VoucherAssetDescriptor): asserts asset is VoucherAssetDescriptor & {
  chainNamespace: "eip155";
  chainId: number;
  assetType: "erc20";
  contract: Address;
} {
  if (asset.chainNamespace !== "eip155") throw new Error("EVM transfer requests require chainNamespace=eip155");
  if (asset.assetType !== "erc20") throw new Error("EVM transfer requests currently support ERC-20 voucher assets");
  if (!Number.isSafeInteger(asset.chainId) || Number(asset.chainId) <= 0) throw new Error("asset.chainId must be a positive integer");
  if (!asset.contract) throw new Error("asset.contract is required for ERC-20 transfer requests");
  getAddress(asset.contract);
  assertPositiveIntegerString(asset.requiredAmount, "asset.requiredAmount");
}

function assertPositiveIntegerString(value: string, fieldName: string): void {
  if (!/^[0-9]+$/.test(value) || BigInt(value) <= 0n) {
    throw new Error(`${fieldName} must be a positive integer string`);
  }
}

function assertNonNegativeIntegerString(value: string, fieldName: string): void {
  if (!/^[0-9]+$/.test(value)) {
    throw new Error(`${fieldName} must be a non-negative integer string`);
  }
}

function confirmationCount(receiptBlock: bigint | number | undefined, currentBlock: bigint | number | undefined): number {
  if (receiptBlock === undefined) return 0;
  const receiptBlockValue = BigInt(receiptBlock);
  const currentBlockValue = currentBlock === undefined ? receiptBlockValue : BigInt(currentBlock);
  if (currentBlockValue < receiptBlockValue) return 0;
  const confirmations = currentBlockValue - receiptBlockValue + 1n;
  return confirmations > BigInt(Number.MAX_SAFE_INTEGER) ? Number.MAX_SAFE_INTEGER : Number(confirmations);
}

function normalizeWalletAccount(accounts: unknown): Address {
  if (!Array.isArray(accounts) || typeof accounts[0] !== "string") throw new Error("Wallet did not return an EVM account");
  return getAddress(accounts[0]);
}

function isUnknownChainError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const record = error as { code?: unknown; message?: unknown };
  return record.code === 4902 || (typeof record.message === "string" && /unrecognized|unknown|not added/i.test(record.message));
}
