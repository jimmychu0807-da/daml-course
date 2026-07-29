import { Command } from "commander";

import conf from "./config";
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
  .command("list-packages")
  .description("List all packages of a remote canton endpoint")
  .action(async () => {
    const { ledgerEndpoint, useHttps, accessToken } = conf;

    const api = new CantonLedgerApi(ledgerEndpoint, {
      useHttps: useHttps.toUpperCase() === "TRUE",
      accessToken,
    });

    const result = await api.getPackages();

    console.log("result:", result);
  });

await program.parseAsync(process.argv);
