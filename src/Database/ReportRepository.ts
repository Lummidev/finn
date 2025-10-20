import type { ManipulateType } from "dayjs";
import type { Category } from "../Entities/Category";
import { EntryRepository } from "./EntryRepository";
import dayjs from "dayjs";

export const getMoneyExpentByCategory = async () => {
  const entries = await EntryRepository.getAll();
  const moneyExpentByCategory: Record<
    string,
    { category: Category; money: number }
  > = {};
  let moneyWithNoCategory = 0;
  for (const entry of entries) {
    if (!entry.category) {
      moneyWithNoCategory += entry.moneyExpent;
    } else {
      const targetCategory = entry.category.name;
      if (moneyExpentByCategory[targetCategory]) {
        moneyExpentByCategory[targetCategory].money += entry.moneyExpent;
      } else {
        moneyExpentByCategory[targetCategory] = {
          money: entry.moneyExpent,
          category: entry.category,
        };
      }
    }
  }
  return { moneyExpentByCategory, moneyWithNoCategory };
};

export const getTotalExpensesOfCategory = async (
  categoryID: string,
  period?: { count: number; type: ManipulateType },
): Promise<number> => {
  let entries = await EntryRepository.getByCategory(categoryID);
  if (period) {
    const targetDate = dayjs().subtract(period.count, period.type);
    entries = entries.filter((entry) =>
      dayjs(entry.createdAtTimestampMiliseconds).isSameOrAfter(
        targetDate,
        period.type,
      ),
    );
  }
  return entries.reduce(
    (accumulator, currentEntry) => accumulator + currentEntry.moneyExpent,
    0,
  );
};
