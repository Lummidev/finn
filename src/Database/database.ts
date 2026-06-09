import Dexie, { type EntityTable } from "dexie";
import type { Category } from "../Entities/Category";
import type { Entry } from "../Entities/Entry";
import type { Message } from "../Entities/Message";

const database = new Dexie("FinnDB") as Dexie & {
  categories: EntityTable<Category, "id">;
  entries: EntityTable<Entry, "id">;
  messages: EntityTable<Message, "id">;
};
database.version(1).stores({
  categories: "id, &name, precedence",
  entries: "id, createdAtTimestampMiliseconds, categoryID",
  messages: "id, createdAtTimestampMiliseconds",
});
database.version(2).upgrade((tx) => {
  return tx
    .table("messages")
    .toCollection()
    .modify((message: Message) => {
      if (message.messageType === "error") {
        message.errorCode = "parserError.noMoney";
        delete message.content;
      }
    });
});
export { database };
