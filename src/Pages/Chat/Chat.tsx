import { ChatBubble } from "../../Components/ChatBubble/ChatBubble";
import type { Message } from "../../Entities/Message";
import "./Chat.css";
interface ChatProps {
  messageHistory: Message[];
}
export const Chat = (props: ChatProps) => {
  return (
    <div className="chat">
      {props.messageHistory.map((message) => (
        <ChatBubble key={message.id} message={message} />
      ))}
    </div>
  );
};
