import { v4 as uuidv4 } from "uuid";

export abstract class Message {
  id: string;
  createdAtTimestampMiliseconds: number;
  messageType: string;
  constructor() {
    this.createdAtTimestampMiliseconds = Date.now().valueOf();
    this.id = uuidv4();
    this.messageType = this.constructor.name;
  }
  toText(): string {
    return JSON.stringify(this, null, " ");
  }
}
