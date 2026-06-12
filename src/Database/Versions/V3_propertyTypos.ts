import type { Transaction } from "dexie";
import type { DatabaseVersion } from ".";

const version: DatabaseVersion = {
  stores: {
    categories: "id, &name, precedence",
    entries: "id, createdAtTimestampMilliseconds, categoryID",
    messages: "id, createdAtTimestampMilliseconds",
  },
  upgrade: async (tx: Transaction) => {
    const fixMillisecondsTypo = (obj: {
      createdAtTimestampMiliseconds?: number;
      createdAtTimestampMilliseconds?: number;
      updatedAtTimestampMiliseconds?: number;
      updatedAtTimestampMilliseconds?: number;
    }) => {
      obj.createdAtTimestampMilliseconds = obj.createdAtTimestampMiliseconds;
      delete obj.createdAtTimestampMiliseconds;
      if (obj.updatedAtTimestampMiliseconds) {
        obj.updatedAtTimestampMilliseconds = obj.updatedAtTimestampMiliseconds;
        delete obj.updatedAtTimestampMiliseconds;
      }
    };
    const messagesTable = tx.table("messages").toCollection();
    const entriesTable = tx.table("entries").toCollection();

    await messagesTable.modify(fixMillisecondsTypo);
    await messagesTable.modify(
      (message: {
        initialEntryInformation?: {
          moneyExpent?: number;
          moneySpent?: number;
        };
      }) => {
        if (message.initialEntryInformation) {
          message.initialEntryInformation.moneySpent =
            message.initialEntryInformation.moneyExpent;
          delete message.initialEntryInformation.moneyExpent;
        }
      },
    );
    await entriesTable.modify(fixMillisecondsTypo);
    await entriesTable.modify(
      (entry: { moneyExpent?: number; moneySpent?: number }) => {
        if (entry.moneyExpent) {
          entry.moneySpent = entry.moneyExpent;
          delete entry.moneyExpent;
        }
      },
    );
  },
};
export default version;
