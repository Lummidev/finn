import type { Transaction } from "dexie";
import type { Message } from "../../Entities/Message";
import type { DatabaseVersion } from ".";
const version: DatabaseVersion = {
  upgrade: (tx: Transaction) => {
    return tx
      .table("messages")
      .toCollection()
      .modify((message: Message) => {
        if (message.messageType === "error") {
          message.errorCode = "parserError.noMoney";
          delete message.content;
        }
      });
  },
};

export default version;
