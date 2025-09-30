import type { Category } from "../Entities/Category";
import { getDatabase } from "./database";

const getAll = async () => {
  const db = await getDatabase();
  return await db.getAll("categories");
};
const insert = async (category: Category) => {
  const db = await getDatabase();
  await db.add("categories", category);
};
const get = async (id: string) => {
  const db = await getDatabase();
  return await db.get("categories", id);
};
export const CategoryRepository = { getAll, get, insert };
