import { use } from "react";
import { ChatBubble } from "../../Components/ChatBubble/ChatBubble";
import "./Chat.css";
import { MessageContext } from "../../Context/MessageContext";
import { PageHeader } from "../../Components/PageHeader/PageHeader";

export const Chat = () => {
  const messageHistory = use(MessageContext);
  return (
    <div className={`chat`}>
      <PageHeader className="chat__title" title="Chat" />
      <div className="chat__box">
        {messageHistory.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
