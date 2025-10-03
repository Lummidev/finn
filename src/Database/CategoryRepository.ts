import { v4 } from "uuid";
import type { Category } from "../Entities/Category";
import { database } from "./database";

const getAll = async (): Promise<Category[]> => {
  return await database.categories.orderBy("precedence").toArray();
};
const insert = async (props: Omit<Category, "id" | "precedence">) => {
  const { name, words } = props;
  const category: Category = {
    id: v4(),
    precedence: 0,
    name,
    words,
  };
  await database.categories.add(category);
  return category;
};
const get = async (id: string): Promise<Category | undefined> => {
  return await database.categories.get(id);
};
export const CategoryRepository = { getAll, get, insert };
