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
const getByCategory = async (categoryID: string) => {
  const entries = await database.entries
    .where("categoryID")
    .equals(categoryID)
    .toArray();
  return entries;
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
const update = async (entry: Entry) => {
  const { id, moneyExpent, description, categoryID, note } = entry;
  const oldEntry = await database.entries.get(id);
  if (!oldEntry) throw new Error("Tried to update entry that doesn't exist");
  const newEntry: Entry = {
    ...oldEntry,
    moneyExpent,
    description,
    categoryID,
    note,
    updatedAtTimestampMiliseconds: new Date().valueOf(),
  };
  await database.entries.put(newEntry);
};
const remove = async (id: string) => {
  await database.entries.delete(id);
};
const removeCategoryFromAll = async (categoryID: string) => {
  await Promise.all(
    (
      await database.entries.where("categoryID").equals(categoryID).toArray()
    ).map(async (entry) => {
      await database.entries.put({
        ...entry,
        categoryID: undefined,
        updatedAtTimestampMiliseconds: new Date().valueOf(),
      });
    }),
  );
};
export const EntryRepository = {
  getAll,
  get,
  getByCategory,
  insert,
  update,
  remove,
  removeCategoryFromAll,
};
