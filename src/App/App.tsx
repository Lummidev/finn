import { useEffect, useState } from "react";
import { Message } from "../Entities/Message";
import "./App.css";
import { ChatBar } from "./ChatBar/ChatBar";
import { handleMessage } from "../ChatBot/ChatBot";
import { UserMessage } from "../Entities/UserMessage";
import { MessageRepository } from "../Database/MessageRepository";
import { Outlet } from "react-router";
import { Navigation } from "./Navigation/Navigation";
import { MessageContext } from "../Context/MessageContext";
import { useNavigate } from "react-router";
function App() {
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const navigate = useNavigate();
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
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      document.querySelector("body")?.setAttribute("data-theme", savedTheme);
    } else {
      document.querySelector("body")?.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
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
    <MessageContext value={messageHistory}>
      <div className="app">
        <div className="app__content">
          <Outlet />
        </div>
        <ChatBar
          onSubmit={handleUserMessage}
          onFocus={() => {
            navigate("/chat");
          }}
        />
        <Navigation />
      </div>
    </MessageContext>
  );
}

export default App;
