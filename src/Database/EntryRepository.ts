import type { Entry } from "../Entities/Entry";
import { getDatabase } from "./database";

const getAll = async () => {
  const db = await getDatabase();
  return await db.getAll("entries");
};
const insert = async (entry: Entry) => {
  const db = await getDatabase();
  await db.add("entries", entry);
};

export const EntryRepository = { getAll, insert };
