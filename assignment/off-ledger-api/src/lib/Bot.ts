import type { CantonLedgerApi } from "./CantonLedgerApi";

type CmdBotOpts = {
  polling: number;
};

const Bot = {
  execute: async (api: CantonLedgerApi, opts: CmdBotOpts) => {
    const pollingMs = Number(opts.polling) * 1000;

    while (true) {
      // your bot work here (query / exercise / etc.)
      const now = new Date();
      console.log(now.toLocaleString());

      const res = await api.getUpdates();
      console.log("--- getUpdates() ---\n", res);

      await new Promise((resolve) => setTimeout(resolve, pollingMs));
    }
  },
};

export { Bot };
