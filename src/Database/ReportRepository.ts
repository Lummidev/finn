import type { ManipulateType } from "dayjs";
import type { Category } from "../Entities/Category";
import { EntryRepository } from "./EntryRepository";
import dayjs from "dayjs";
import type { Entry } from "../Entities/Entry";

export const getMoneyExpentByCategoryToday = async () => {
  const now = dayjs();
  const entries = (await EntryRepository.getAll()).filter((entry) => {
    return dayjs(entry.createdAtTimestampMiliseconds).isSameOrAfter(now, "day");
  });
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
    {
      id?: string;
      iconName?: string;
      moneyExpentPerDay: Record<number, number>;
    }
  > = {};
  entriesInMonth.forEach((entry) => {
    const day = dayjs(entry.createdAtTimestampMiliseconds).date();
    let id: string | undefined;
    let iconName: string | undefined;
    let categoryName = "Sem Categoria";
    const category = entry.category;
    if (category) {
      id = category.id;
      iconName = category.iconName;
      categoryName = category.name;
    }
    const moneyExpent = entry.moneyExpent;
    if (moneyExpentByCategoryAndMonthDay[categoryName]) {
      if (
        moneyExpentByCategoryAndMonthDay[categoryName].moneyExpentPerDay[day]
      ) {
        moneyExpentByCategoryAndMonthDay[categoryName].moneyExpentPerDay[day] +=
          moneyExpent;
      } else {
        moneyExpentByCategoryAndMonthDay[categoryName].moneyExpentPerDay[day] =
          moneyExpent;
      }
    } else {
      moneyExpentByCategoryAndMonthDay[categoryName] = {
        id,
        iconName,
        moneyExpentPerDay: {},
      };
      moneyExpentByCategoryAndMonthDay[categoryName].moneyExpentPerDay[day] =
        moneyExpent;
    }
  });
  return moneyExpentByCategoryAndMonthDay;
};
export const getMoneyExpentByPeriod = async () => {
  const periodFilter = (period: ManipulateType) => {
    return (entry: Entry) =>
      dayjs(entry.createdAtTimestampMiliseconds).isSameOrAfter(dayjs(), period);
  };
  const reducer = (sum: number, current: Entry) => sum + current.moneyExpent;
  const entries = await EntryRepository.getAll();
  const day = entries.filter(periodFilter("day")).reduce(reducer, 0);
  const week = entries.filter(periodFilter("week")).reduce(reducer, 0);
  const month = entries.filter(periodFilter("month")).reduce(reducer, 0);
  return { day, week, month };
};
