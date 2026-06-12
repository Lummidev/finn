import type { Entry } from "../Entities/Entry";
import { parseMessageComponents } from "./Parser/parser";
import { EntryRepository } from "../Database/EntryRepository";
import {
  MessageRepository,
  type JoinedMessage,
} from "../Database/MessageRepository";
import { AppError } from "../util";

export const handleMessage = async (text: string): Promise<JoinedMessage> => {
  try {
    const { moneySpent, description, category } =
      await parseMessageComponents(text);
    const savedEntry: Entry = await EntryRepository.insert({
      moneySpent,
      description,
      categoryID: category?.id,
    });
    const savedMessage = await MessageRepository.insert({
      messageType: "success",
      entryID: savedEntry.id,
      initialEntryInformation: {
        moneySpent,
        description,
        category: category && {
          name: category.name,
          iconName: category.iconName,
        },
      },
    });
    return {
      ...savedMessage,
      entry: {
        ...savedEntry,
        category,
      },
    };
  } catch (e) {
    let code: string;
    const unknownCode = "unknown";
    if (e instanceof AppError) {
      code = e.code;
    } else {
      code = unknownCode;
    }
    return await MessageRepository.insert({
      messageType: "error",
      errorCode: code,
      errorDetails:
        code === unknownCode ? JSON.stringify(e, null, " ") : undefined,
    });
  }
};
