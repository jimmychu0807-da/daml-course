import {CantonLedgerApi} from "./lib/CantonLedgerApi";

const SERVER_ENDPOINT = "localhost:2975";

const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2NhbnRvbi5uZXR3b3JrLmdsb2JhbCIsInN1YiI6ImxlZGdlci1hcGktdXNlciJ9.A0VZW69lWWNVsjZmDDpVvr1iQ_dJLga3f-K2bicdtsc";

const PACKAGE_PATH = "../templates/.daml/dist/assignment-templates-0.0.1.dar";

const USER = "ledger-api-user";

async function main() {
  const api = new CantonLedgerApi(SERVER_ENDPOINT, {
    useHttps: false,
    access_token: ACCESS_TOKEN
  });

  console.log("--- Upload package ---");
  let result = await api.uploadPackage(PACKAGE_PATH);
  console.log(result);

  console.log("--- Listing packages ---");
  result = await api.getPackages();
  console.log(result);

  console.log("--- Listing parties ---");
  result = await api.getParties();
  console.log(result);

  console.log("--- allocate local party ---");
  result = await api.allocateParty("Alice", USER);
  console.log(result);

  console.log("--- Listing parties ---");
  result = await api.getParties();
  console.log(result);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
