/* eslint-disable no-fallthrough */
import { openDB } from "idb";
import type { FinnDB } from "./schema";

export const getDatabase = async () => {
  return await openDB<FinnDB>("finn", 1, {
    upgrade(db, oldVersion) {
      switch (oldVersion) {
        case 0:

        case 1:
          db.createObjectStore("messages", {
            keyPath: "id",
          }).createIndex("by-creation", "createdAtTimestampMiliseconds");
          db.createObjectStore("entries", {
            keyPath: "id",
          }).createIndex("by-creation", "createdAtTimestampMiliseconds");
          db.createObjectStore("categories", {
            keyPath: "id",
          }).createIndex("by-precedence", "precedence");
      }
    },
  });
};
