import { Entry } from "../Entities/Entry";
import { parseMessageComponents } from "./Parser/parser";
import { ParserError } from "./Parser/ParserError";
import type { Message } from "../Entities/Message";
import { ErrorMessage } from "../Entities/ErrorMessage";
import { SuccessMessage } from "../Entities/SuccessMessage";
import { EntryRepository } from "../Database/EntryRepository";
import { MessageRepository } from "../Database/MessageRepository";

export const handleMessage = async (text: string): Promise<Message> => {
  let components;
  try {
    components = await parseMessageComponents(text);
  } catch (e) {
    let errorMessage;
    if (e instanceof ParserError) {
      errorMessage = new ErrorMessage(e.message);
    } else {
      errorMessage = new ErrorMessage(JSON.stringify(e, null, " "));
    }
    await MessageRepository.insert(errorMessage);
    return errorMessage;
  }
  const entry = new Entry(
    components.moneyExpent,
    components.description,
    components.category,
  );
  await EntryRepository.insert(entry);
  const response = new SuccessMessage(entry);
  await MessageRepository.insert(response);
  return response;
};
