import { v4 } from "uuid";
import type { Category } from "../Entities/Category";
import { database } from "./database";
import { EntryRepository } from "./EntryRepository";

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

const update = async (updatedCategory: Category) => {
  await database.categories.put(updatedCategory);
};

const remove = async (id: string) => {
  await EntryRepository.removeCategoryFromAll(id);
  await database.categories.delete(id);
};
export const CategoryRepository = { getAll, get, insert, update, remove };
