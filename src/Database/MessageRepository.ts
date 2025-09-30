import { ErrorMessage } from "../Entities/ErrorMessage";
import { Message } from "../Entities/Message";
import { SuccessMessage } from "../Entities/SuccessMessage";
import { UserMessage } from "../Entities/UserMessage";
import { getDatabase } from "./database";

const insert = async (message: Message) => {
  const db = await getDatabase();
  await db.add("messages", message);
};
const getAll = async (): Promise<Message[]> => {
  const db = await getDatabase();
  const messages = (await db.getAllFromIndex("messages", "by-creation"))
    .reverse()
    .map((message) => {
      let prototype: Message;
      switch (message.messageType) {
        case "UserMessage":
          prototype = UserMessage.prototype;
          break;
        case "SuccessMessage":
          prototype = SuccessMessage.prototype;
          break;
        case "ErrorMessage":
          prototype = ErrorMessage.prototype;
          break;
        default:
          throw new Error(
            `Message with invalid prototype saved in database: ${JSON.stringify(message, null, " ")}`,
          );
      }
      return Object.setPrototypeOf(message, prototype) as Message;
    });
  return messages;
};

export const MessageRepository = { insert, getAll };
