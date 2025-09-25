import type { ParserErrorKind } from "./ParserErrorKind";

export class ParserError extends Error {
  errorKind: ParserErrorKind;
  constructor(message: string, kind: ParserErrorKind) {
    super(message);
    this.name = "ParserError";
    this.errorKind = kind;
    Object.setPrototypeOf(this, ParserError.prototype);
  }
}
