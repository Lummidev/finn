import { Message } from "./Message";

export class UserMessage extends Message {
  constructor(content: string) {
    super(content);
  }
}
