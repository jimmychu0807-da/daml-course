import {CantonLedgerApi} from "./lib/CantonLedgerApi";

const SERVER_ENDPOINT = "localhost:2975";
const ACCESS_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2NhbnRvbi5uZXR3b3JrLmdsb2JhbCIsInN1YiI6ImxlZGdlci1hcGktdXNlciJ9.A0VZW69lWWNVsjZmDDpVvr1iQ_dJLga3f-K2bicdtsc";

async function main() {
  const api = new CantonLedgerApi(SERVER_ENDPOINT, {
    useHttps: false,
    access_token: ACCESS_TOKEN
  });
  let result = await api.listDars();
  console.log("--- Listing packages ---");
  console.log(result);
}

await main();
