import { v4 as uuidv4 } from "uuid";

export class Entry {
  id: string;
  moneyExpent: number;
  description: string;
  constructor(moneyExpent: number, description: string) {
    this.id = uuidv4();
    this.description = description;
    this.moneyExpent = moneyExpent;
  }
}
