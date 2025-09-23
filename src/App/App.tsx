import { useEffect, useState } from "react";
import { Message } from "../Entities/Message";
import { parseEntry } from "../Parser/parser";
import { ParserError } from "../Parser/ParserError";
import "./App.css";
import { Chat } from "../Pages/Chat/Chat";
import { ChatBar } from "../Components/ChatBar/ChatBar";
function App() {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);

  const handleUserMessage = (text: string) => {
    const trimmedText = text.trim();
    setMessageHistory([Message.user(trimmedText), ...messageHistory]);
  };
  const handleCurrentMessage = (currentMessage: Message) => {
    try {
      const entry = parseEntry(currentMessage.content);
      setMessageHistory([
        Message.system(JSON.stringify(entry, null, " ")),
        ...messageHistory,
      ]);
    } catch (e) {
      if (e instanceof ParserError) {
        setMessageHistory([Message.system(e.message), ...messageHistory]);
      } else {
        setMessageHistory([
          Message.system(`Ocorreu um erro : ${JSON.stringify(e)}`),
          ...messageHistory,
        ]);
      }
    }
  };
  useEffect(() => {
    if (messageHistory.length !== 0 && messageHistory[0]?.fromUser) {
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
