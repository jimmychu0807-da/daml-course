import { Command } from "commander";

import conf from "./config";
import { CantonLedgerApi } from "./lib/CantonLedgerApi";

// const PACKAGE_PATH = "../templates/.daml/dist/assignment-templates-0.0.1.dar";

// const USER = "ledger-api-user";

// async function main() {
//   const api = new CantonLedgerApi(SERVER_ENDPOINT, {
//     useHttps: false,
//     access_token: ACCESS_TOKEN,
//   });

//   console.log("--- Upload package ---");
//   let result = await api.uploadPackage(PACKAGE_PATH);
//   console.log(result);

//   console.log("--- Listing packages ---");
//   result = await api.getPackages();
//   console.log(result);

//   console.log("--- Listing parties ---");
//   result = await api.getParties();
//   console.log(result);

//   console.log("--- allocate local party ---");
//   result = await api.allocateParty("Alice", USER);
//   console.log(result);

//   console.log("--- Listing parties ---");
//   result = await api.getParties();
//   console.log(result);
// }

// main().catch((err) => {
//   console.error(err);
//   process.exitCode = 1;
// });

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

await program.parseAsync(process.argv);
