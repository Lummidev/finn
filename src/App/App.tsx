import { useEffect, useState } from "react";
import { Message } from "../Entities/Message";
import "./App.css";
import { Chat } from "../Pages/Chat/Chat";
import { ChatBar } from "../Components/ChatBar/ChatBar";
import { handleMessage } from "../ChatBot/ChatBot";
import { UserMessage } from "../Entities/UserMessage";
import { MessageRepository } from "../Database/MessageRepository";
function App() {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  const handleUserMessage = async (text: string) => {
    const trimmedText = text.trim();
    const userMessage = new UserMessage(trimmedText);
    await MessageRepository.insert(userMessage);
    setMessageHistory([userMessage, ...messageHistory]);
  };
  const handleCurrentMessage = (currentMessage: Message) => {
    if (currentMessage instanceof UserMessage) {
      handleMessage(currentMessage.content)
        .then((response) => {
          setMessageHistory([response, ...messageHistory]);
        })
        .catch((e) => {
          console.error(e);
          throw e;
        });
    }
  };
  useEffect(() => {
    MessageRepository.getAll()
      .then((messages) => {
        setMessageHistory(messages);
      })
      .catch((e) => {
        throw e;
      });
  }, []);
  useEffect(() => {
    if (
      messageHistory.length !== 0 &&
      messageHistory[0] instanceof UserMessage
    ) {
      handleCurrentMessage(messageHistory[0]);
    }
  }, [messageHistory]);
  return (
    <div className="app">
      <Chat messageHistory={messageHistory} />
      <ChatBar onSubmit={handleUserMessage} />
    </div>
  );
}

export default App;
