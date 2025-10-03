import { v4 } from "uuid";
import type { Category } from "../Entities/Category";
import type { Entry } from "../Entities/Entry";
import { CategoryRepository } from "./CategoryRepository";
import { database } from "./database";

export type JoinedEntry = Entry & {
  category?: Category;
};

const getAll = async (): Promise<JoinedEntry[]> => {
  const entries = (
    await database.entries.orderBy("createdAtTimestampMiliseconds").toArray()
  ).reverse() as JoinedEntry[];
  await Promise.all(
    entries.map(async (entry) => {
      entry.category = entry.categoryID
        ? await CategoryRepository.get(entry.categoryID)
        : undefined;
    }),
  );
  return entries;
};

const get = async (id: string): Promise<JoinedEntry | undefined> => {
  const entry: JoinedEntry | undefined = await database.entries.get(id);
  if (entry && entry.categoryID) {
    entry.category = await database.categories.get(entry.categoryID);
  }
  return entry;
};

const insert = async (
  props: Omit<Entry, "id" | "createdAtTimestampMiliseconds">,
) => {
  const { moneyExpent, description, categoryID } = props;
  const entry: Entry = {
    id: v4(),
    createdAtTimestampMiliseconds: new Date().valueOf(),
    moneyExpent,
    description,
    categoryID,
  };

  await database.entries.add(entry);
  return entry;
};
export const EntryRepository = { getAll, get, insert };
