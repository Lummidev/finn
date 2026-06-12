import type { ManipulateType } from "dayjs";
import type { Category } from "../Entities/Category";
import { EntryRepository } from "./EntryRepository";
import dayjs from "dayjs";
import type { Entry } from "../Entities/Entry";
import i18n from "i18next";
export const getMoneySpentByCategoryToday = async () => {
  const now = dayjs();
  const entries = (await EntryRepository.getAll()).filter((entry) => {
    return dayjs(entry.createdAtTimestampMilliseconds).isSameOrAfter(
      now,
      "day",
    );
  });
  const moneySpentByCategory: Record<
    string,
    { category: Category; money: number }
  > = {};
  let moneyWithNoCategory = 0;
  for (const entry of entries) {
    if (!entry.category) {
      moneyWithNoCategory += entry.moneySpent;
    } else {
      const targetCategory = entry.category.name;
      if (moneySpentByCategory[targetCategory]) {
        moneySpentByCategory[targetCategory].money += entry.moneySpent;
      } else {
        moneySpentByCategory[targetCategory] = {
          money: entry.moneySpent,
          category: entry.category,
        };
      }
    }
  }
  return { moneySpentByCategory, moneyWithNoCategory };
};

export const getTotalExpensesOfCategory = async (
  categoryID: string,
  period?: { count: number; type: ManipulateType },
): Promise<number> => {
  let entries = await EntryRepository.getByCategory(categoryID);
  if (period) {
    const targetDate = dayjs().subtract(period.count, period.type);
    entries = entries.filter((entry) =>
      dayjs(entry.createdAtTimestampMilliseconds).isSameOrAfter(
        targetDate,
        period.type,
      ),
    );
  }
  return entries.reduce(
    (accumulator, currentEntry) => accumulator + currentEntry.moneySpent,
    0,
  );
};
export const getMoneSpentByCategoryAndMonthDay = async (
  noCategoryString: string = i18n.t("noCategory", { ns: "common" }),
) => {
  const now = dayjs();

  const entries = await EntryRepository.getAll();
  const entriesInMonth = entries.filter((entry) =>
    dayjs(entry.createdAtTimestampMilliseconds).isSame(now, "month"),
  );
  const moneySpentByCategoryAndMonthDay: Record<
    string,
    {
      id?: string;
      iconName?: string;
      moneySpentPerDay: Record<number, number>;
    }
  > = {};
  entriesInMonth.forEach((entry) => {
    const day = dayjs(entry.createdAtTimestampMilliseconds).date();
    let id: string | undefined;
    let iconName: string | undefined;
    let categoryName = noCategoryString;
    const category = entry.category;
    if (category) {
      id = category.id;
      iconName = category.iconName;
      categoryName = category.name;
    }
    const moneySpent = entry.moneySpent;
    if (moneySpentByCategoryAndMonthDay[categoryName]) {
      if (moneySpentByCategoryAndMonthDay[categoryName].moneySpentPerDay[day]) {
        moneySpentByCategoryAndMonthDay[categoryName].moneySpentPerDay[day] +=
          moneySpent;
      } else {
        moneySpentByCategoryAndMonthDay[categoryName].moneySpentPerDay[day] =
          moneySpent;
      }
    } else {
      moneySpentByCategoryAndMonthDay[categoryName] = {
        id,
        iconName,
        moneySpentPerDay: {},
      };
      moneySpentByCategoryAndMonthDay[categoryName].moneySpentPerDay[day] =
        moneySpent;
    }
  });
  return moneySpentByCategoryAndMonthDay;
};
export const getMoneySpentByPeriod = async () => {
  const periodFilter = (period: ManipulateType) => {
    return (entry: Entry) =>
      dayjs(entry.createdAtTimestampMilliseconds).isSameOrAfter(
        dayjs(),
        period,
      );
  };
  const reducer = (sum: number, current: Entry) => sum + current.moneySpent;
  const entries = await EntryRepository.getAll();
  const day = entries.filter(periodFilter("day")).reduce(reducer, 0);
  const week = entries.filter(periodFilter("week")).reduce(reducer, 0);
  const month = entries.filter(periodFilter("month")).reduce(reducer, 0);
  return { day, week, month };
};
