import type { Entry } from "../Entities/Entry";
import { parseMessageComponents } from "./Parser/parser";
import { ParserError } from "./Parser/ParserError";
import { EntryRepository } from "../Database/EntryRepository";
import {
  MessageRepository,
  type JoinedMessage,
} from "../Database/MessageRepository";

export const handleMessage = async (text: string): Promise<JoinedMessage> => {
  try {
    const { moneyExpent, description, category } =
      await parseMessageComponents(text);
    const entry: Entry = await EntryRepository.insert({
      moneyExpent,
      description,
      categoryID: category?.id,
    });
    return {
      ...(await MessageRepository.insert({
        messageType: "success",
        entryID: entry.id,
      })),
      entry: {
        ...entry,
        category,
      },
    };
  } catch (e) {
    let content: string;
    if (e instanceof ParserError) {
      content = e.message;
    } else {
      content = JSON.stringify(e, null, " ");
    }

    return await MessageRepository.insert({ messageType: "error", content });
  }
};
