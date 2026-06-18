import type { RedeemLoopPaymentIntent, VoucherPaymentProof } from "@redeemloop/core";
import { createEip1193EvmWalletAdapter, type Eip1193Provider } from "@redeemloop/adapters";
import type {
  CheckBalanceResponse,
  CreatePaymentIntentInput,
  RedeemLoopClient,
  SettlementProofResponse,
  TransferRequestResponse,
} from "@redeemloop/sdk";

export type RedeemLoopPayStep =
  | "creating_intent"
  | "checking_balance"
  | "requesting_transfer"
  | "sending_wallet_transaction"
  | "broadcasting"
  | "rechecking_settlement"
  | "submitting_proof"
  | "complete";

export interface RedeemLoopPayFlowInput extends CreatePaymentIntentInput {
  payerAddress?: string;
  balance?: string;
  txid?: string;
  proofStatus?: VoucherPaymentProof["status"];
  autoSubmitProof?: boolean;
  autoSendEvmTransaction?: boolean;
  autoRecheckEvmSettlement?: boolean;
  switchEvmChain?: boolean;
  evmProvider?: Eip1193Provider;
}

export interface RedeemLoopPayFlowResult {
  intent: RedeemLoopPaymentIntent;
  balanceCheck?: CheckBalanceResponse["balanceCheck"];
  transfer?: TransferRequestResponse["transfer"];
  broadcastedTxid?: string;
  proof?: SettlementProofResponse;
}

export interface RunRedeemLoopPayFlowOptions {
  onStep?: (step: RedeemLoopPayStep) => void;
}

export async function runRedeemLoopPayFlow(
  client: RedeemLoopClient,
  input: RedeemLoopPayFlowInput,
  options: RunRedeemLoopPayFlowOptions = {},
): Promise<RedeemLoopPayFlowResult> {
  options.onStep?.("creating_intent");
  let intent = await client.createPaymentIntent({
    bindingId: input.bindingId,
    orderId: input.orderId,
    channel: input.channel,
    skuLines: input.skuLines,
    payerAddress: input.payerAddress,
    assetId: input.assetId,
    storeId: input.storeId,
    expiresAt: input.expiresAt,
    intentId: input.intentId,
  });

  let balanceCheck: CheckBalanceResponse["balanceCheck"] | undefined;
  if (input.payerAddress) {
    options.onStep?.("checking_balance");
    const checked = await client.checkBalance(intent.intentId, {
      payerAddress: input.payerAddress,
      assetId: input.assetId,
      balance: input.balance,
    });
    intent = checked;
    balanceCheck = checked.balanceCheck;
  }

  options.onStep?.("requesting_transfer");
  const transferResponse = await client.requestTransfer(intent.intentId, {
    payerAddress: input.payerAddress,
    assetId: input.assetId,
  });
  intent = transferResponse;

  let broadcastedTxid: string | undefined;
  if (input.autoSendEvmTransaction) {
    if (!transferResponse.transfer.evm) throw new Error("EVM wallet send requires an EVM transfer request");
    const provider = input.evmProvider ?? getInjectedEvmProvider();
    if (!provider) throw new Error("No injected EVM wallet provider found");
    options.onStep?.("sending_wallet_transaction");
    const wallet = createEip1193EvmWalletAdapter(provider);
    const txid = await wallet.sendErc20Transfer(transferResponse.transfer.evm, {
      from: input.payerAddress,
      switchChain: input.switchEvmChain !== false,
    });
    options.onStep?.("broadcasting");
    const broadcasted = await client.markBroadcasted(intent.intentId, { txid });
    intent = broadcasted;
    broadcastedTxid = broadcasted.txid;
  } else if (input.txid) {
    options.onStep?.("broadcasting");
    const broadcasted = await client.markBroadcasted(intent.intentId, { txid: input.txid });
    intent = broadcasted;
    broadcastedTxid = broadcasted.txid;
  }

  let proof: SettlementProofResponse | undefined;
  if (input.autoRecheckEvmSettlement && broadcastedTxid && input.payerAddress && transferResponse.transfer.evm) {
    options.onStep?.("rechecking_settlement");
    proof = await client.recheckEvmSettlement(intent.intentId, {
      txid: broadcastedTxid,
      from: input.payerAddress,
    });
    if (proof.paymentIntent) intent = proof.paymentIntent;
  } else if (input.autoSubmitProof && broadcastedTxid && input.payerAddress) {
    const asset = intent.selectedAsset ?? intent.acceptedAssets[0];
    if (!asset) throw new Error("PaymentIntent has no accepted asset to submit proof for");
    options.onStep?.("submitting_proof");
    proof = await client.submitSettlementProof({
      intentId: intent.intentId,
      chainNamespace: asset.chainNamespace,
      chainId: asset.chainId,
      txid: broadcastedTxid,
      from: input.payerAddress,
      to: intent.merchantVault,
      assetType: asset.assetType,
      assetId: asset.assetId,
      contract: asset.contract,
      tokenId: asset.tokenId,
      amount: asset.requiredAmount,
      status: input.proofStatus ?? "confirmed",
      confirmations: input.proofStatus === "seen" ? 0 : 1,
    });
    if (proof.paymentIntent) intent = proof.paymentIntent;
  }

  options.onStep?.("complete");
  return {
    intent,
    balanceCheck,
    transfer: transferResponse.transfer,
    broadcastedTxid,
    proof,
  };
}

function getInjectedEvmProvider(): Eip1193Provider | undefined {
  if (typeof globalThis === "undefined") return undefined;
  return (globalThis as { ethereum?: Eip1193Provider }).ethereum;
}
