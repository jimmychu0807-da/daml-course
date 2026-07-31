import type { CantonLedgerApi } from "./CantonLedgerApi";
import { VERBOSE } from "../config";

type CmdBotOpts = {
  polling: number;
  partyId: string;
  templateId: string;
};

let botCmdReplySeq = 0;

const Bot = {
  execute: async (api: CantonLedgerApi, opts: CmdBotOpts) => {
    const { polling, partyId, templateId } = opts;
    const pollingMs = Number(polling) * 1000;
    let offset = 0;

    console.log(`Connecting to ${api.remoteEndpoint}`);

    while (true) {
      // your bot work here (query / exercise / etc.)
      const now = new Date();
      const res = await api.getUpdates({
        offset,
        partyId,
        templateId,
      });

      if (VERBOSE) {
        console.log(`${now.toLocaleString()}:`);
        console.dir(res, { depth: null, colors: true });
      }

      const parsedUpdates = parseUpdates(res as any[]);

      for (const update of parsedUpdates) {
        if ("OffsetCheckpoint" in update) {
          const cp = update.OffsetCheckpoint.value;
          if (cp.offset && cp.offset > offset) {
            // update the offset where it is listened to
            offset = cp.offset;
          }
        } else if ("Transaction" in update) {
          const tx = update.Transaction.value;

          console.log("observe:", tx);

          // currently we only process transaction with first event is a CreatedEvent
          if (!('CreatedEvent' in tx.events[0])) {
            continue;
          }

          const exCmdObj = parseTxEventForExerciseChoice(tx.events[0], partyId);

          const res = await api.submitCmds(exCmdObj);

          console.log("Exercise Choice result:", res);
        }
      }

      await new Promise((resolve) => setTimeout(resolve, pollingMs));
    }
  },
};

function parseUpdates(updates: any[]) {
  return updates.map((o) => o.update);
}

function parseTxEventForExerciseChoice(txEvent: any, partyId: string) {
  const { contractId, templateId } = txEvent.CreatedEvent;
  const retObj = {
    commands: {
      commands: [{
        ExerciseCommand: {
          templateId,
          contractId,
          choice: "Accept",
          choiceArgument: {},
        }
      }],
      commandId: `botCmd-${botCmdReplySeq}`,
      actAs: [partyId]
    }
  };

  botCmdReplySeq += 1;

  return retObj;
}

export { Bot };
