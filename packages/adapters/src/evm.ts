import {
  encodeFunctionData,
  getAddress,
  parseAbi,
  type Address,
  type Hex,
} from "viem";
import type { VoucherAssetDescriptor, VoucherPaymentProof } from "@redeemloop/core";

export const erc20TransferAbi = parseAbi(["function transfer(address to, uint256 amount) returns (bool)"]);

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
