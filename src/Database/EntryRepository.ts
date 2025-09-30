import type { Entry } from "../Entities/Entry";
import { getDatabase } from "./database";

const getAll = async () => {
  const db = await getDatabase();
  return (await db.getAllFromIndex("entries", "by-creation")).reverse();
};
const insert = async (entry: Entry) => {
  const db = await getDatabase();
  await db.add("entries", entry);
};
const get = async (id: string) => {
  const db = await getDatabase();
  return await db.get("entries", id);
};
export const EntryRepository = { getAll, get, insert };
