import { v4 as uuidv4 } from "uuid";
export class Message {
  id: string;
  content: string;
  createdAtTimestamp: number;
  fromUser: boolean;
  constructor(content: string, fromUser: boolean) {
    this.createdAtTimestamp = Date.now().valueOf();
    this.id = uuidv4();
    this.content = content;
    this.fromUser = fromUser;
  }
  static system(content: string) {
    return new this(content, false);
  }
  static user(content: string) {
    return new this(content, true);
  }
}
