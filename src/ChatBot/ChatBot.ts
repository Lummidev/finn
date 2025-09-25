import dayjs from "dayjs";
import { Entry } from "../Entities/Entry";
import { parseMessageComponents } from "./Parser/parser";
import { ParserError } from "./Parser/ParserError";
import type { Message } from "../Entities/Message";
import { SystemMessage } from "../Entities/SystemMessage";
import { MessageKind } from "../Entities/MessageKind";

export const handleMessage = (text: string): Message => {
  let components;
  try {
    components = parseMessageComponents(text);
  } catch (e) {
    if (e instanceof ParserError) {
      return new SystemMessage(e.message, MessageKind.Error);
    } else {
      return new SystemMessage(JSON.stringify(e, null, " "), MessageKind.Error);
    }
  }
  const entry = new Entry(components.moneyExpent, components.description);
  // TODO: Save entry here
  const content =
    `Gasto Registrado!\n` +
    `${entry.description}\n` +
    `R$${entry.moneyExpent.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 })}\n` +
    `Data: ${dayjs(entry.createdAtTimestampMiliseconds).format("L HH:mm")}`;
  return new SystemMessage(content);
};
