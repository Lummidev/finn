import Dexie, { type EntityTable } from "dexie";
import type { Category } from "../Entities/Category";
import type { Entry } from "../Entities/Entry";
import type { Message } from "../Entities/Message";
import { versions } from "./Versions";
const database = new Dexie("FinnDB") as Dexie & {
  categories: EntityTable<Category, "id">;
  entries: EntityTable<Entry, "id">;
  messages: EntityTable<Message, "id">;
};

for (const [index, version] of versions.entries()) {
  const versionNumber = index + 1;
  const currentVersion = database.version(versionNumber);
  if (version.stores) {
    currentVersion.stores(version.stores);
  }
  if (version.upgrade) {
    currentVersion.upgrade(version.upgrade);
  }
}

export { database };
