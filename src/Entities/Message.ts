import { v4 as uuidv4 } from "uuid";

export abstract class Message {
  id: string;
  content: string;
  createdAtTimestampMiliseconds: number;
  constructor(content: string) {
    this.createdAtTimestampMiliseconds = Date.now().valueOf();
    this.id = uuidv4();
    this.content = content;
  }
}
