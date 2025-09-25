import type { Message } from "../../Entities/Message";
import { MessageKind } from "../../Entities/MessageKind";
import { SystemMessage } from "../../Entities/SystemMessage";
import { UserMessage } from "../../Entities/UserMessage";
import "./ChatBubble.css";
interface ChatBubbleProps {
  message: Message;
}
export const ChatBubble = (props: ChatBubbleProps) => {
  const messageSender =
    props.message instanceof UserMessage ? "user" : "system";
  const error =
    props.message instanceof SystemMessage &&
    props.message.messageKind === MessageKind.Error;
  return (
    <p
      className={`chat-bubble
        chat-bubble--${messageSender}
        ${error ? "chat-bubble--error" : ""}`}
    >
      {props.message.content}
    </p>
  );
};
