import { AppError } from "../../util";

const ParserErrorKind = {
  noMoney: "noMoney",
  invalidMoney: "invalidMoney",
} as const;

type ParserErrorKind = (typeof ParserErrorKind)[keyof typeof ParserErrorKind];

export { ParserErrorKind };
export class ParserError extends AppError {
  constructor(kind: ParserErrorKind, details?: string) {
    super(`parserError.${kind}`, details);
    this.name = "parserError";
    Object.setPrototypeOf(this, ParserError.prototype);
  }
}
