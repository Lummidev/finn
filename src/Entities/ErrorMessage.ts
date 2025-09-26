import { SystemMessage } from "./SystemMessage";

export class ErrorMessage extends SystemMessage {
  content: string;
  constructor(content: string) {
    super();
    this.content = content;
  }
  toText(): string {
    return this.content;
  }
}
