import type { DBSchema } from "idb";
import type { Message } from "../Entities/Message";
import type { Entry } from "../Entities/Entry";
import type { Category } from "../Entities/Category";

export interface FinnDB extends DBSchema {
  messages: {
    value: Message;
    key: string;
    indexes: { "by-creation": number };
  };
  entries: {
    value: Entry;
    key: string;
    indexes: { "by-creation": number };
  };
  categories: {
    value: Category;
    key: string;
    indexes: { "by-precedence": number };
  };
}
