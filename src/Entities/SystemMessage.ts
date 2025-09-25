import { Message } from "./Message";
import { MessageKind } from "./MessageKind";

export class SystemMessage extends Message {
  messageKind: MessageKind;

  constructor(content: string, messageKind: MessageKind = MessageKind.Normal) {
    super(content);
    this.messageKind = messageKind;
  }
}
