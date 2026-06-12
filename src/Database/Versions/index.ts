import type { Transaction } from "dexie";

import V1_initial from "./V1_initial";
import V2_messageErrors from "./V2_messageErrors";
import V3_propertyTypos from "./V3_propertyTypos";

export interface DatabaseVersion {
  stores?: Record<string, string>;
  upgrade?: (tx: Transaction) => PromiseLike<unknown> | void;
}
export const versions: DatabaseVersion[] = [
  V1_initial,
  V2_messageErrors,
  V3_propertyTypos,
];
