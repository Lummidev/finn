import { use } from "react";
import { ChatBubble } from "../../Components/ChatBubble/ChatBubble";
import "./Chat.css";
import { MessageContext } from "../../Context/MessageContext";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { MessageRepository } from "../../Database/MessageRepository";

export const Chat = () => {
  const messageHistory = use(MessageContext);
  return (
    <div className={`chat`}>
      <PageHeader
        className="chat__title"
        title="Chat"
        subMenu={[
          {
            name: "Limpar chat",
            destructive: true,
            icon: faTrash,
            onAction: () => {
              MessageRepository.deleteAll().catch((e) => {
                throw e;
              });
            },
          },
        ]}
      />
      <div className="chat__box">
        {messageHistory.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
};
