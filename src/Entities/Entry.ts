import { v4 as uuidv4 } from "uuid";
import type { Category } from "./Category";

export class Entry {
  id: string;
  moneyExpent: number;
  description: string;
  createdAtTimestampMiliseconds: number;
  category?: Category;
  constructor(moneyExpent: number, description: string, category?: Category) {
    this.id = uuidv4();
    this.createdAtTimestampMiliseconds = new Date().valueOf();
    this.description = description;
    this.moneyExpent = moneyExpent;
    this.category = category;
  }
}
