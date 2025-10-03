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
  categories: "id, precedence",
  entries: "id, createdAtTimestampMiliseconds",
  messages: "id, createdAtTimestampMiliseconds",
});

export { database };
