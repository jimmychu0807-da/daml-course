import type { CantonLedgerApi } from "./CantonLedgerApi";

type CmdBotOpts = {
  polling: number;
  partyId: string;
  templateId: string;
};

const Bot = {
  execute: async (api: CantonLedgerApi, opts: CmdBotOpts) => {
    const { polling, partyId, templateId } = opts;
    const pollingMs = Number(polling) * 1000;
    const offset = 0;

    console.log(`Connecting to ${api.remoteEndpoint}`);

    while (true) {
      // your bot work here (query / exercise / etc.)
      const now = new Date();
      const res = await api.getUpdates({
        offset,
        partyId,
        templateId,
      });

      console.log(`--- ${now.toLocaleString()} ---`);
      console.dir(res, { depth: null, colors: true });

      await new Promise((resolve) => setTimeout(resolve, pollingMs));
    }
  },
};

export { Bot };
