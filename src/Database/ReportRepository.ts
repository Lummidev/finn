import type { ManipulateType } from "dayjs";
import type { Category } from "../Entities/Category";
import { EntryRepository, type JoinedEntry } from "./EntryRepository";
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
export const getMoneyExpentByCategoryAndMonthDay = async () => {
  const now = dayjs();

  const entries = await EntryRepository.getAll();
  const entriesInMonth = entries.filter((entry) =>
    now.isSameOrAfter(dayjs(entry.createdAtTimestampMiliseconds, "month")),
  );
  const moneyExpentByCategoryAndMonthDay: Record<
    string,
    Record<number, number>
  > = {};
  entriesInMonth.forEach((entry) => {
    const day = dayjs(entry.createdAtTimestampMiliseconds).date();
    const categoryName = entry.category ? entry.category.name : "Sem Categoria";
    const moneyExpent = entry.moneyExpent;
    if (moneyExpentByCategoryAndMonthDay[categoryName]) {
      if (moneyExpentByCategoryAndMonthDay[categoryName][day]) {
        moneyExpentByCategoryAndMonthDay[categoryName][day] += moneyExpent;
      } else {
        moneyExpentByCategoryAndMonthDay[categoryName][day] = moneyExpent;
      }
    } else {
      moneyExpentByCategoryAndMonthDay[categoryName] = {};
      moneyExpentByCategoryAndMonthDay[categoryName][day] = moneyExpent;
    }
  });
  return moneyExpentByCategoryAndMonthDay;
};
