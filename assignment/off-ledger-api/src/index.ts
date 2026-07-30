import assert from "node:assert/strict";
import { Command } from "commander";

import conf from "./config";
import { Bot } from "./lib/Bot";
import { CantonLedgerApi } from "./lib/CantonLedgerApi";

const program = new Command();

program
  .name("canton-request")
  .description("CLI to Canton off-ledger request and bot")
  .version("0.1.0");

program
  .command("upload-package")
  .description("Upload a package to a remote canton endpoint")
  .argument("<dar-filepath>", "filepath to the daml package")
  .option(
    "--network",
    "upload the package to all network nodes, specified by NETWORK_ENDPOINTS env",
  )
  .action(async (filePath, opts) => {
    const { ledgerEndpoint, networkEndpoints, useHttps, accessToken } = conf;

    const endpoints = opts?.network ? networkEndpoints : [ledgerEndpoint];

    for (const endpoint of endpoints) {
      const api = new CantonLedgerApi(endpoint, {
        useHttps: useHttps.toUpperCase() === "TRUE",
        accessToken,
      });

      const result = await api.uploadPackage(filePath);
      assert(result);
    }
  });

program
  .command("list-participant-id")
  .description("List participant ID")
  .option(
    "--network",
    "list participant IDs of the network, specified by NETWORK_ENDPOINTS env",
  )
  .action(async (opts) => {
    const { ledgerEndpoint, networkEndpoints, useHttps, accessToken } = conf;

    const endpoints = opts?.network ? networkEndpoints : [ledgerEndpoint];

    for (const endpoint of endpoints) {
      const api = new CantonLedgerApi(endpoint, {
        useHttps: useHttps.toUpperCase() === "TRUE",
        accessToken,
      });

      const result = await api.getParticipantId();

      console.log(`${endpoint}:`, result);
    }
  });

program
  .command("list-package-ids")
  .description("List all package IDs of a remote canton endpoint")
  .action(async () => {
    const { ledgerEndpoint, useHttps, accessToken } = conf;

    const api = new CantonLedgerApi(ledgerEndpoint, {
      useHttps: useHttps.toUpperCase() === "TRUE",
      accessToken,
    });

    const result = await api.getPackages();
    console.log("result:", result);
  });

program
  .command("list-package-info")
  .description("List all package info of a remote canton endpoint")
  .option("-p, --package <string>", "package name filter")
  .option("--pid <string>", "participantId")
  .action(async (opts) => {
    const { ledgerEndpoint, useHttps, accessToken } = conf;

    const api = new CantonLedgerApi(ledgerEndpoint, {
      useHttps: useHttps.toUpperCase() === "TRUE",
      accessToken,
    });

    const result = await api.getPackagesWithVettedInfo(opts.package, opts.pid);
    console.log("result:", result);
  });

program.command("submit-and-wait-for-tx").action(async (_opts) => {
  const { ledgerEndpoint, useHttps, accessToken } = conf;

  const api = new CantonLedgerApi(ledgerEndpoint, {
    useHttps: useHttps.toUpperCase() === "TRUE",
    accessToken,
  });

  const result = await api.submitAndWaitForTx();
  console.log("result:", result);
});

program
  .command("bot")
  .description(
    "bot that listen to a specific template and send an exercise choice correspondingly.",
  )
  .option("-p, --polling <value>", "polling time in seconds", "5")
  .action(async (opts) => {
    const { ledgerEndpoint, useHttps, accessToken } = conf;

    const api = new CantonLedgerApi(ledgerEndpoint, {
      useHttps: useHttps.toUpperCase() === "TRUE",
      accessToken,
    });

    await Bot.execute(api, opts);
  });

await program.parseAsync(process.argv);
