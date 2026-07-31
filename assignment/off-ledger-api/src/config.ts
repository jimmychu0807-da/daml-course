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

const botLedgerEndpoint = process.env.BOT_LEDGER_ENDPOINT ?? "";
const botUseHttps = process.env.BOT_USE_HTTPS ?? "false";
const botListeningTemplateId = process.env.BOT_LISTENING_TEMPLATE_ID;
const botListeningPartyId = process.env.BOT_LISTENING_PARTY_ID;
const botAccessToken = process.env.BOT_ACCESS_TOKEN;

const botConf = {
  ledgerEndpoint: botLedgerEndpoint,
  useHttps: botUseHttps,
  listeningTemplateId: botListeningTemplateId,
  listeningPartyId: botListeningPartyId,
  accessToken: botAccessToken,
};

const VERBOSE = true;

export { botConf, conf, VERBOSE };
