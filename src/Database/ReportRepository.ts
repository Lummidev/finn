import type { Category } from "../Entities/Category";
import { EntryRepository } from "./EntryRepository";

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
