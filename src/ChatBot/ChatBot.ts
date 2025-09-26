import { Entry } from "../Entities/Entry";
import { parseMessageComponents } from "./Parser/parser";
import { ParserError } from "./Parser/ParserError";
import type { Message } from "../Entities/Message";
import { ErrorMessage } from "../Entities/ErrorMessage";
import { SuccessMessage } from "../Entities/SuccessMessage";

export const handleMessage = (text: string): Message => {
  let components;
  try {
    components = parseMessageComponents(text);
  } catch (e) {
    if (e instanceof ParserError) {
      return new ErrorMessage(e.message);
    } else {
      return new ErrorMessage(JSON.stringify(e, null, " "));
    }
  }
  const entry = new Entry(
    components.moneyExpent,
    components.description,
    components.category,
  );
  // TODO: Save entry here

  return new SuccessMessage(entry);
};
