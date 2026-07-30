const ledgerEndpoint = process.env.LEDGER_ENDPOINT ?? "";
const networkEndpoints = (process.env.NETWORK_ENDPOINTS ?? "").split(",");
const useHttps = process.env.USE_HTTPS ?? "false";
const accessToken = process.env.ACCESS_TOKEN;

const conf = {
  ledgerEndpoint,
  networkEndpoints,
  useHttps,
  accessToken,
};

export default conf;
