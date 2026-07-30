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
  .action(async (filePath) => {
    const { ledgerEndpoint, useHttps, accessToken } = conf;

    const api = new CantonLedgerApi(ledgerEndpoint, {
      useHttps: useHttps.toUpperCase() === "TRUE",
      accessToken,
    });

    const result = await api.uploadPackage(filePath);

    console.log("result:", result);
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
