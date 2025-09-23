import type { Message } from "../../Entities/Message";
import "./ChatBubble.css";
interface ChatBubbleProps {
  message: Message;
}
export const ChatBubble = (props: ChatBubbleProps) => {
  return (
    <p
      className={`chat-bubble chat-bubble--${props.message.fromUser ? "user" : "system"}`}
    >
      {props.message.content}
    </p>
  );
};
