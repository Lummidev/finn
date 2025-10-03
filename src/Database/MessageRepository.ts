import { v4 } from "uuid";
import type { Message } from "../Entities/Message";
import { database } from "./database";
import { EntryRepository, type JoinedEntry } from "./EntryRepository";

export interface JoinedMessage extends Message {
  entry?: JoinedEntry;
}

const insert = async (
  props: Omit<Message, "id" | "createdAtTimestampMiliseconds">,
) => {
  const message: Message = {
    ...props,
    id: v4(),
    createdAtTimestampMiliseconds: new Date().valueOf(),
  };

  await database.messages.add(message);
  return message;
};
const getAll = async (): Promise<JoinedMessage[]> => {
  const messages = (
    (await database.messages
      .orderBy("createdAtTimestampMiliseconds")
      .toArray()) as JoinedMessage[]
  ).reverse();
  return await Promise.all(
    messages.map(async (message) => {
      if (message.messageType === "success" && message.entryID) {
        message.entry = await EntryRepository.get(message.entryID);
      }
      return message;
    }),
  );
};

export const MessageRepository = { insert, getAll };
