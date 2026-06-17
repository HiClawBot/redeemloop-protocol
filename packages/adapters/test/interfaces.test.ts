import { describe, expect, it } from "vitest";

import {
  buildErc20BalanceCheckRequest,
  buildErc20TransferRequest,
  createErc20PaymentProof,
  type EvmAdapter,
  type IndexerAdapter,
  type PsbtBuilderAdapter,
} from "../src/index.js";
import type { VoucherAssetDescriptor } from "@redeemloop/core";

const runeAsset: VoucherAssetDescriptor = {
  chainNamespace: "bitcoin",
  assetType: "rune",
  assetId: "bitcoin/rune:840000:3",
  runeId: "840000:3",
  requiredAmount: "1",
  termsHash: "terms",
};

describe("adapter contracts", () => {
  it("builds ERC-20 transfer calldata for wallet tender requests", () => {
    const asset: VoucherAssetDescriptor = {
      chainNamespace: "eip155",
      chainId: 8453,
      assetType: "erc20",
      assetId: "eip155:8453/erc20:0x0000000000000000000000000000000000000def",
      contract: "0x0000000000000000000000000000000000000def",
      requiredAmount: "1",
      termsHash: "terms",
    };

    const request = buildErc20TransferRequest({
      from: "0x0000000000000000000000000000000000000123",
      to: "0x0000000000000000000000000000000000000abc",
      asset,
    });

    expect(request).toMatchObject({
      chainNamespace: "eip155",
      chainId: 8453,
      assetType: "erc20",
      amount: "1",
      transaction: {
        value: "0x0",
        functionName: "transfer",
      },
    });
    expect(request.contract.toLowerCase()).toBe(asset.contract);
    expect(request.transaction.to.toLowerCase()).toBe(asset.contract);
    expect(request.transaction.args[0].toLowerCase()).toBe("0x0000000000000000000000000000000000000abc");
    expect(request.transaction.args[1]).toBe("1");
    expect(request.transaction.data.startsWith("0xa9059cbb")).toBe(true);

    expect(
      createErc20PaymentProof({
        proofId: "proof_1",
        intentId: "pi_1",
        asset,
        txid: "0x1234",
        from: "0x0000000000000000000000000000000000000123",
        to: "0x0000000000000000000000000000000000000abc",
        confirmations: 1,
      }),
    ).toMatchObject({
      chainNamespace: "eip155",
      assetType: "erc20",
      amount: "1",
    });
  });

  it("builds ERC-20 balanceOf calldata and evaluates required voucher amount", () => {
    const asset: VoucherAssetDescriptor = {
      chainNamespace: "eip155",
      chainId: 8453,
      assetType: "erc20",
      assetId: "eip155:8453/erc20:0x0000000000000000000000000000000000000def",
      contract: "0x0000000000000000000000000000000000000def",
      requiredAmount: "2",
      termsHash: "terms",
    };

    const enough = buildErc20BalanceCheckRequest({
      account: "0x0000000000000000000000000000000000000123",
      asset,
      balance: "3",
    });
    expect(enough.call.data.startsWith("0x70a08231")).toBe(true);
    expect(enough.call.to.toLowerCase()).toBe(asset.contract);
    expect(enough.hasSufficientBalance).toBe(true);
    expect(enough.shortfall).toBe("0");

    const short = buildErc20BalanceCheckRequest({
      account: "0x0000000000000000000000000000000000000123",
      asset,
      balance: "1",
    });
    expect(short.hasSufficientBalance).toBe(false);
    expect(short.shortfall).toBe("1");
  });

  it("keeps Bitcoin and Fractal transfer support behind PSBT/indexer interfaces", async () => {
    const psbtBuilder: PsbtBuilderAdapter = {
      async buildTransferPsbt(input) {
        return {
          psbtBase64: Buffer.from(`${input.from}:${input.to}:${input.asset.assetId}:${input.amount}`).toString("base64"),
          estimatedFee: "1200",
        };
      },
    };
    const indexer: IndexerAdapter = {
      async getBalance(address, asset) {
        return { address, asset, amount: "2" };
      },
      async getTransferProof(txid, asset) {
        return {
          proofId: "proof_1",
          intentId: "pi_1",
          chainNamespace: asset.chainNamespace,
          txid,
          confirmations: 1,
          from: "bc1payer",
          to: "bc1merchant",
          assetType: asset.assetType,
          assetId: asset.assetId,
          amount: asset.requiredAmount,
          status: "seen",
        };
      },
    };

    await expect(psbtBuilder.buildTransferPsbt({ from: "bc1payer", to: "bc1merchant", asset: runeAsset, amount: "1" })).resolves.toMatchObject({
      estimatedFee: "1200",
    });
    await expect(indexer.getBalance("bc1payer", runeAsset)).resolves.toMatchObject({ amount: "2" });
  });

  it("defines EVM transfer without requiring RedeemLoop-issued tokens", async () => {
    const adapter: EvmAdapter = {
      async getBalance(address, asset) {
        return { address, asset, amount: "1" };
      },
      async requestTransfer() {
        return { txid: "0xabc" };
      },
      async getTransferProof(txid, asset) {
        return {
          proofId: "proof_1",
          intentId: "pi_1",
          chainNamespace: "eip155",
          chainId: asset.chainId,
          txid,
          confirmations: 1,
          from: "0x0000000000000000000000000000000000000123",
          to: "0x0000000000000000000000000000000000000abc",
          assetType: asset.assetType,
          assetId: asset.assetId,
          contract: asset.contract,
          amount: asset.requiredAmount,
          status: "confirmed",
        };
      },
    };

    await expect(adapter.requestTransfer({ from: "0x1", to: "0x2", asset: { ...runeAsset, chainNamespace: "eip155", chainId: 8453 }, amount: "1" })).resolves.toMatchObject({
      txid: "0xabc",
    });
  });
});
