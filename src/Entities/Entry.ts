import { v4 as uuidv4 } from "uuid";

export class Entry {
  id: string;
  moneyExpent: number;
  description: string;
  createdAtTimestampMiliseconds: number;
  constructor(moneyExpent: number, description: string) {
    this.id = uuidv4();
    this.createdAtTimestampMiliseconds = new Date().valueOf();
    this.description = description;
    this.moneyExpent = moneyExpent;
  }
}
