const ledgerEndpoint = process.env.LEDGER_ENDPOINT ?? "";
const useHttps = process.env.USE_HTTPS ?? "false";
const accessToken = process.env.ACCESS_TOKEN;

const conf = {
  ledgerEndpoint,
  useHttps,
  accessToken,
};

export default conf;
