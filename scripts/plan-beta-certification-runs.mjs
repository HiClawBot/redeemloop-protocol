#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

try {
  const input = await loadInput(args);
  const plan = buildPlan(input, args);

  if (args.json) console.log(JSON.stringify(plan, null, 2));
  else printPlan(plan, args);

  process.exitCode = plan.summary.fail > 0 ? 1 : 0;
} catch (error) {
  console.error(`RedeemLoop beta certification plan failed: ${errorMessage(error)}`);
  process.exit(1);
}

async function loadInput(rawArgs) {
  if (!rawArgs.input) throw new Error("--input is required");
  const path = resolve(rawArgs.input);
  const raw = await readFile(path, "utf8");
  const parsed = JSON.parse(raw);
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Input file must contain a JSON object");
  return { path, value: parsed };
}

function buildPlan(input, rawArgs) {
  const checks = [];
  const source = normalizeInput(input.value, checks);
  const repo = rawArgs.repo ?? source.repo ?? inferRepoFallback();
  const commands = rawArgs.commands && checks.every((item) => item.status !== "fail") ? workflowCommands(source, repo) : undefined;

  return {
    checkedAt: new Date().toISOString(),
    inputPath: publicPath(input.path),
    repo,
    checks,
    summary: summarizeChecks(checks),
    workflowInputs: summarizeWorkflowInputs(source),
    commands,
    nextActions: nextActions(checks, rawArgs.commands),
  };
}

function normalizeInput(raw, output) {
  const evm = objectValue(raw.evm, "evm", output);
  const commerce = objectValue(raw.woocommerce ?? raw.commerce, "woocommerce", output);
  const source = {
    repo: optionalString(raw.repo, "repo", output),
    evm: evm ? normalizeEvm(evm, output) : undefined,
    commerce: commerce ? normalizeCommerce(commerce, output) : undefined,
  };

  if (source.evm && source.commerce) collectConsistencyChecks(source, output);
  return source;
}

function normalizeEvm(raw, output) {
  return {
    chainId: positiveInteger(raw.chain_id ?? raw.chainId, "evm.chain_id", output),
    walletName: requiredString(raw.wallet_name ?? raw.walletName, "evm.wallet_name", output),
    walletVersion: requiredString(raw.wallet_version ?? raw.walletVersion, "evm.wallet_version", output),
    intentId: requiredString(raw.intent_id ?? raw.intentId, "evm.intent_id", output),
    txHash: txHash(raw.tx_hash ?? raw.txHash, "evm.tx_hash", output),
    from: address(raw.from, "evm.from", output),
    to: address(raw.to, "evm.to", output),
    contract: address(raw.contract, "evm.contract", output),
    amount: positiveIntegerString(raw.amount, "evm.amount", output),
    minConfirmations: positiveInteger(raw.min_confirmations ?? raw.minConfirmations ?? 1, "evm.min_confirmations", output),
  };
}

function normalizeCommerce(raw, output) {
  return {
    apiBaseUrl: url(raw.api_base_url ?? raw.apiBaseUrl, "woocommerce.api_base_url", output),
    storeUrl: url(raw.store_url ?? raw.storeUrl, "woocommerce.store_url", output),
    orderId: requiredString(raw.order_id ?? raw.orderId, "woocommerce.order_id", output),
    intentId: requiredString(raw.intent_id ?? raw.intentId, "woocommerce.intent_id", output),
    paymentId: optionalString(raw.payment_id ?? raw.paymentId, "woocommerce.payment_id", output),
    chainId: positiveInteger(raw.chain_id ?? raw.chainId, "woocommerce.chain_id", output),
    merchantId: requiredString(raw.merchant_id ?? raw.merchantId, "woocommerce.merchant_id", output),
    voucherToken: address(raw.voucher_token ?? raw.voucherToken, "woocommerce.voucher_token", output),
    amount: positiveIntegerString(raw.amount, "woocommerce.amount", output),
    receiver: address(raw.receiver, "woocommerce.receiver", output),
    txHash: txHash(raw.tx_hash ?? raw.txHash, "woocommerce.tx_hash", output),
  };
}

function collectConsistencyChecks(source, output) {
  sameValue(source.evm.intentId, source.commerce.intentId, "consistency.intent_id", "EVM and WooCommerce must use the same PaymentIntent ID", output);
  sameValue(source.evm.chainId, source.commerce.chainId, "consistency.chain_id", "EVM and WooCommerce must use the same chain ID", output);
  sameValue(source.evm.txHash, source.commerce.txHash, "consistency.tx_hash", "EVM and WooCommerce must use the same transaction hash", output);
  sameValue(source.evm.contract, source.commerce.voucherToken, "consistency.voucher_token", "EVM contract must match WooCommerce voucher token", output);
  sameValue(source.evm.to, source.commerce.receiver, "consistency.receiver", "EVM receiver must match WooCommerce receiver", output);
  sameValue(source.evm.amount, source.commerce.amount, "consistency.amount", "EVM amount must match WooCommerce amount", output);
}

function workflowCommands(source, repo) {
  if (!repo) return undefined;
  return {
    evm: [
      "gh", "workflow", "run", "beta-evm-certification.yml",
      "--repo", repo,
      field("chain_id", source.evm.chainId),
      field("wallet_name", source.evm.walletName),
      field("wallet_version", source.evm.walletVersion),
      field("intent_id", source.evm.intentId),
      field("tx_hash", source.evm.txHash),
      field("from", source.evm.from),
      field("to", source.evm.to),
      field("contract", source.evm.contract),
      field("amount", source.evm.amount),
      field("min_confirmations", source.evm.minConfirmations),
    ].flat().map(shellQuote).join(" "),
    woocommerce: [
      "gh", "workflow", "run", "beta-commerce-certification.yml",
      "--repo", repo,
      field("api_base_url", source.commerce.apiBaseUrl),
      field("store_url", source.commerce.storeUrl),
      field("order_id", source.commerce.orderId),
      field("intent_id", source.commerce.intentId),
      source.commerce.paymentId ? field("payment_id", source.commerce.paymentId) : [],
      field("chain_id", source.commerce.chainId),
      field("merchant_id", source.commerce.merchantId),
      field("voucher_token", source.commerce.voucherToken),
      field("amount", source.commerce.amount),
      field("receiver", source.commerce.receiver),
      field("tx_hash", source.commerce.txHash),
    ].flat().map(shellQuote).join(" "),
  };
}

function summarizeWorkflowInputs(source) {
  return {
    evm: source.evm ? {
      chainId: source.evm.chainId,
      walletName: source.evm.walletName,
      walletVersion: source.evm.walletVersion,
      intentId: source.evm.intentId,
      txHash: redactHex(source.evm.txHash),
      from: redactAddress(source.evm.from),
      to: redactAddress(source.evm.to),
      contract: redactAddress(source.evm.contract),
      amount: source.evm.amount,
      minConfirmations: source.evm.minConfirmations,
    } : undefined,
    woocommerce: source.commerce ? {
      apiBaseUrl: originOnly(source.commerce.apiBaseUrl),
      storeUrl: originOnly(source.commerce.storeUrl),
      orderId: redactText(source.commerce.orderId),
      intentId: source.commerce.intentId,
      paymentId: source.commerce.paymentId ? redactText(source.commerce.paymentId) : undefined,
      chainId: source.commerce.chainId,
      merchantId: source.commerce.merchantId,
      voucherToken: redactAddress(source.commerce.voucherToken),
      amount: source.commerce.amount,
      receiver: redactAddress(source.commerce.receiver),
      txHash: redactHex(source.commerce.txHash),
    } : undefined,
  };
}

function nextActions(checks, commandsRequested) {
  const actions = [];
  if (checks.some((item) => item.status === "fail")) {
    actions.push("Fix the failed input checks before running certification workflows.");
    return actions;
  }
  actions.push("Set or verify REDEEMLOOP_COMMERCE_CERTIFICATION_API_KEY before the WooCommerce workflow.");
  actions.push("Run the EVM workflow only after the ERC-20 transfer is funded and visible in an RPC receipt.");
  actions.push("Run the WooCommerce workflow only against a safe test order that can be marked paid.");
  if (!commandsRequested) actions.push("Re-run with --commands to print copyable gh workflow run commands in a private terminal.");
  return actions;
}

function parseArgs(argv) {
  const parsed = {
    help: false,
    json: false,
    commands: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    else if (arg === "--help" || arg === "-h") parsed.help = true;
    else if (arg === "--json") parsed.json = true;
    else if (arg === "--commands") parsed.commands = true;
    else if (arg === "--input") parsed.input = requireNextValue(argv, ++index, arg);
    else if (arg === "--repo") parsed.repo = requireNextValue(argv, ++index, arg);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return parsed;
}

function printHelp() {
  console.log(`RedeemLoop beta certification run planner

Usage:
  node scripts/plan-beta-certification-runs.mjs --input evidence/private-certification-inputs.json [--repo owner/name] [--commands] [--json]

The command is read-only. It validates certification workflow inputs and checks that
the EVM and WooCommerce evidence will describe the same payment. It does not send
transactions, call commerce APIs, read secrets, or dispatch workflows.

Use --commands only in a private terminal. The generated gh workflow commands contain
full transaction, address, store, and order metadata needed by GitHub Actions.
`);
}

function printPlan(plan, rawArgs) {
  console.log("RedeemLoop beta certification run plan");
  console.log(`Input: ${plan.inputPath}`);
  if (plan.repo) console.log(`Repository: ${plan.repo}`);
  console.log("");
  for (const item of plan.checks) {
    console.log(`[${item.status.toUpperCase()}] ${item.name} - ${item.message}`);
  }
  console.log("");
  console.log(`Summary: ${plan.summary.pass} pass, ${plan.summary.warn} warn, ${plan.summary.fail} fail, ${plan.summary.skip} skip`);
  console.log("");
  console.log("Redacted workflow input summary:");
  console.log(JSON.stringify(plan.workflowInputs, null, 2));
  if (plan.commands) {
    console.log("");
    console.log("Private workflow dispatch commands:");
    console.log(plan.commands.evm);
    console.log(plan.commands.woocommerce);
  } else if (rawArgs.commands) {
    console.log("");
    console.log("Workflow commands were not generated because the plan has failures or no repository was available.");
  }
  if (plan.nextActions.length > 0) {
    console.log("");
    console.log("Next actions:");
    for (const action of plan.nextActions) console.log(`- ${action}`);
  }
}

function objectValue(value, fieldName, output) {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    output.push(pass(`input.${fieldName}`, `${fieldName} input object is present`, undefined));
    return value;
  }
  output.push(fail(`input.${fieldName}`, `${fieldName} input object is required`, undefined));
  return undefined;
}

function requiredString(value, fieldName, output) {
  if (typeof value === "string" && value.trim()) {
    output.push(pass(fieldName, "Required string is present", undefined));
    return value.trim();
  }
  output.push(fail(fieldName, "Required string is missing", undefined));
  return undefined;
}

function optionalString(value, fieldName, output) {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "string" && value.trim()) return value.trim();
  output.push(fail(fieldName, "Optional value must be a string when present", undefined));
  return undefined;
}

function positiveInteger(value, fieldName, output) {
  const numberValue = Number(value);
  if (Number.isSafeInteger(numberValue) && numberValue > 0) {
    output.push(pass(fieldName, "Positive integer is valid", undefined));
    return numberValue;
  }
  output.push(fail(fieldName, "Value must be a positive integer", undefined));
  return undefined;
}

function positiveIntegerString(value, fieldName, output) {
  const normalized = requiredString(value, fieldName, output);
  if (!normalized) return undefined;
  if (/^[0-9]+$/.test(normalized) && BigInt(normalized) > 0n) {
    output.push(pass(`${fieldName}.format`, "Positive integer string is valid", undefined));
    return normalized;
  }
  output.push(fail(`${fieldName}.format`, "Value must be a positive integer string", undefined));
  return undefined;
}

function address(value, fieldName, output) {
  const normalized = requiredString(value, fieldName, output)?.toLowerCase();
  if (!normalized) return undefined;
  if (/^0x[0-9a-f]{40}$/.test(normalized)) {
    output.push(pass(`${fieldName}.format`, "EVM address is valid", redactAddress(normalized)));
    return normalized;
  }
  output.push(fail(`${fieldName}.format`, "Value must be an EVM address", undefined));
  return undefined;
}

function txHash(value, fieldName, output) {
  const normalized = requiredString(value, fieldName, output)?.toLowerCase();
  if (!normalized) return undefined;
  if (/^0x[0-9a-f]{64}$/.test(normalized)) {
    output.push(pass(`${fieldName}.format`, "Transaction hash is valid", redactHex(normalized)));
    return normalized;
  }
  output.push(fail(`${fieldName}.format`, "Value must be a 32-byte hex transaction hash", undefined));
  return undefined;
}

function url(value, fieldName, output) {
  const normalized = requiredString(value, fieldName, output);
  if (!normalized) return undefined;
  try {
    const parsed = new URL(normalized);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
    output.push(pass(`${fieldName}.format`, "URL is valid", parsed.origin));
    return parsed.toString().replace(/\/$/, "");
  } catch {
    output.push(fail(`${fieldName}.format`, "Value must be a valid http(s) URL", undefined));
    return undefined;
  }
}

function sameValue(left, right, name, message, output) {
  if (left === undefined || right === undefined) {
    output.push(fail(name, `${message}; one or both values are missing`, undefined));
    return;
  }
  if (left === right) {
    output.push(pass(name, message, undefined));
  } else {
    output.push(fail(name, message, undefined));
  }
}

function field(name, value) {
  return ["-f", `${name}=${value}`];
}

function shellQuote(value) {
  const text = String(value);
  if (/^[A-Za-z0-9_./:=@-]+$/.test(text)) return text;
  return `'${text.replace(/'/g, `'\\''`)}'`;
}

function pass(name, message, details) {
  return check("pass", name, message, details);
}

function fail(name, message, details) {
  return check("fail", name, message, details);
}

function check(status, name, message, details) {
  return details === undefined ? { name, status, message } : { name, status, message, details };
}

function summarizeChecks(checks) {
  const summary = { pass: 0, warn: 0, fail: 0, skip: 0 };
  for (const item of checks) {
    if (summary[item.status] !== undefined) summary[item.status] += 1;
  }
  return summary;
}

function redactAddress(value) {
  return typeof value === "string" && value.length >= 12 ? `${value.slice(0, 6)}...${value.slice(-4)}` : value;
}

function redactHex(value) {
  return typeof value === "string" && value.length >= 18 ? `${value.slice(0, 10)}...${value.slice(-8)}` : value;
}

function redactText(value) {
  const text = String(value);
  return text.length > 8 ? `${text.slice(0, 3)}...${text.slice(-3)}` : "***";
}

function originOnly(value) {
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

function publicPath(path) {
  const cwd = process.cwd();
  return path.startsWith(cwd) ? path.slice(cwd.length + 1) : path;
}

function inferRepoFallback() {
  const result = spawnSync("git", ["remote", "get-url", "origin"], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) return undefined;
  const remote = result.stdout.trim();
  const match = remote.match(/github\.com[:/]([^/]+)\/(.+?)(?:\.git)?$/);
  if (!match) return undefined;
  return `${match[1]}/${match[2]}`;
}

function requireNextValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
  return value;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
