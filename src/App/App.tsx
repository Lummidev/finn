import { useEffect, useState } from "react";
import { Message } from "../Entities/Message";
import "./App.css";
import { Chat } from "../Pages/Chat/Chat";
import { ChatBar } from "../Components/ChatBar/ChatBar";
import { handleMessage } from "../ChatBot/ChatBot";
import { UserMessage } from "../Entities/UserMessage";
function App() {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  const handleUserMessage = (text: string) => {
    const trimmedText = text.trim();
    setMessageHistory([new UserMessage(trimmedText), ...messageHistory]);
  };
  const handleCurrentMessage = (currentMessage: Message) => {
    const botResponse = handleMessage(currentMessage.content);
    setMessageHistory([botResponse, ...messageHistory]);
  };
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
