import { v4 as uuidv4 } from "uuid";

export abstract class Message {
  id: string;
  createdAtTimestampMiliseconds: number;
  constructor() {
    this.createdAtTimestampMiliseconds = Date.now().valueOf();
    this.id = uuidv4();
  }
  toText(): string {
    return JSON.stringify(this, null, " ");
  }
}
