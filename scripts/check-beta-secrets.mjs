#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const REQUIRED_SECRETS = [
  {
    name: "REDEEMLOOP_EVM_RPC_URLS",
    purpose: "Inject read-only EVM RPC endpoints into production-readiness and wallet certification evidence workflows.",
  },
  {
    name: "REDEEMLOOP_COMMERCE_CERTIFICATION_API_KEY",
    purpose: "Call the RedeemLoop commerce confirmation API for WooCommerce certification evidence.",
  },
];

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

try {
  const input = normalizeInput(args);
  if (!input.github && !input.env) throw new Error("At least one of --github or --env must be enabled");

  const checks = [];
  const nextActions = [];

  if (input.github) collectGithubChecks(input, checks, nextActions);
  if (input.env) collectEnvChecks(checks, nextActions);

  const report = {
    checkedAt: new Date().toISOString(),
    repo: input.repo,
    checks,
    nextActions: dedupe(nextActions),
    summary: summarizeChecks(checks),
  };

  if (input.json) console.log(JSON.stringify(report, null, 2));
  else printReport(report);

  process.exitCode = report.summary.fail > 0 ? 1 : 0;
} catch (error) {
  console.error(`RedeemLoop beta secret readiness check failed: ${errorMessage(error)}`);
  process.exit(1);
}

function collectGithubChecks(input, output, nextActions) {
  if (!input.repo) {
    output.push(fail("github.repo", "GitHub repository could not be inferred; pass --repo owner/name", undefined));
    return;
  }
  output.push(pass("github.repo", "GitHub repository selected for secret checks", input.repo));

  const result = spawnSync("gh", ["secret", "list", "--repo", input.repo], {
    cwd: process.cwd(),
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
  if (result.status !== 0) {
    output.push(fail("github.secrets", "Could not list GitHub repository secrets with gh", summaryOutput(result.stderr || result.stdout || result.error?.message || "")));
    return;
  }

  const names = new Set(result.stdout.split(/\r?\n/).map((line) => line.trim().split(/\s+/)[0]).filter(Boolean));
  for (const secret of REQUIRED_SECRETS) {
    if (names.has(secret.name)) {
      output.push(pass(`github.secret.${secret.name}`, "Required repository secret is present", secret.purpose));
    } else {
      output.push(fail(`github.secret.${secret.name}`, "Required repository secret is missing", secret.purpose));
      nextActions.push(`Set ${secret.name} in GitHub repository Actions secrets.`);
      nextActions.push(`printf '%s' "$${secret.name}" | gh secret set ${secret.name} --repo ${input.repo} --body-file -`);
    }
  }
}

function collectEnvChecks(output, nextActions) {
  for (const secret of REQUIRED_SECRETS) {
    if (stringValue(process.env[secret.name])) {
      output.push(pass(`env.${secret.name}`, "Required local environment variable is present", secret.purpose));
    } else {
      output.push(fail(`env.${secret.name}`, "Required local environment variable is missing", secret.purpose));
      nextActions.push(`Export ${secret.name} in the shell only when running local certification commands.`);
    }
  }
}

function parseArgs(argv) {
  const parsed = {
    github: true,
    env: false,
    json: false,
    help: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    else if (arg === "--github") parsed.github = true;
    else if (arg === "--no-github") parsed.github = false;
    else if (arg === "--env") parsed.env = true;
    else if (arg === "--json") parsed.json = true;
    else if (arg === "--help" || arg === "-h") parsed.help = true;
    else if (arg === "--repo") parsed.repo = requireNextValue(argv, ++index, arg);
    else throw new Error(`Unknown argument: ${arg}`);
  }
  return parsed;
}

function normalizeInput(raw) {
  return {
    repo: raw.repo ?? inferGithubRepo(),
    github: raw.github,
    env: raw.env,
    json: raw.json,
  };
}

function inferGithubRepo() {
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

function printHelp() {
  console.log(`RedeemLoop beta secret readiness check

Usage:
  node scripts/check-beta-secrets.mjs [--repo owner/name] [--env] [--json]

Options:
  --repo OWNER/NAME  GitHub repository. Defaults to the origin remote.
  --github          Check required GitHub repository secret names. Enabled by default.
  --no-github       Skip GitHub secret-name checks.
  --env             Also check matching local environment variables.
  --json            Print a machine-readable report.
  --help, -h        Show this help.

This command is read-only. It checks secret names and environment-variable presence only; it never reads or prints secret values.
`);
}

function printReport(report) {
  console.log("RedeemLoop beta secret readiness");
  if (report.repo) console.log(`Repository: ${report.repo}`);
  console.log("");
  for (const item of report.checks) {
    console.log(`[${item.status.toUpperCase()}] ${item.name} - ${item.message}`);
  }
  console.log("");
  console.log(`Summary: ${report.summary.pass} pass, ${report.summary.warn} warn, ${report.summary.fail} fail, ${report.summary.skip} skip`);
  if (report.nextActions.length > 0) {
    console.log("");
    console.log("Next actions:");
    for (const action of report.nextActions) console.log(`- ${action}`);
  }
}

function requireNextValue(argv, index, flag) {
  const value = argv[index];
  if (!value || value.startsWith("--")) throw new Error(`${flag} requires a value`);
  return value;
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

function dedupe(items) {
  return Array.from(new Set(items.filter(Boolean)));
}

function stringValue(value) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function summaryOutput(value) {
  return String(value ?? "").trim().split(/\r?\n/).slice(0, 6).join("\n") || undefined;
}

function errorMessage(error) {
  return error instanceof Error ? error.message : String(error);
}
