import { use } from "react";
import { ChatBubble } from "../../Components/ChatBubble/ChatBubble";
import "./Chat.css";
import { MessageContext } from "../../Context/MessageContext";

export const Chat = () => {
  const messageHistory = use(MessageContext);
  return (
    <div className={`chat`}>
      <h1 className="chat__title">Chat</h1>
      <div className="chat__box">
        {messageHistory.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
