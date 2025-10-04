import { useEffect, useState } from "react";
import type { Message } from "../Entities/Message";
import "./App.css";
import { ChatBar } from "./ChatBar/ChatBar";
import { handleMessage } from "../ChatBot/ChatBot";
import {
  MessageRepository,
  type JoinedMessage,
} from "../Database/MessageRepository";
import { Outlet, useLocation } from "react-router";
import { Navigation } from "./Navigation/Navigation";
import { MessageContext } from "../Context/MessageContext";
import { useNavigate } from "react-router";
function App() {
  const [messageHistory, setMessageHistory] = useState<JoinedMessage[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const handleUserMessage = async (text: string) => {
    const trimmedText = text.trim();
    const userMessage = await MessageRepository.insert({
      messageType: "user",
      content: trimmedText,
    });
    setMessageHistory([userMessage, ...messageHistory]);
  };
  const handleCurrentMessage = (currentMessage: Message) => {
    if (currentMessage.messageType === "user" && currentMessage.content) {
      handleMessage(currentMessage.content)
        .then((response) => {
          console.log(response);
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
    const savedAccentColor = localStorage.getItem("accentColor");
    if (savedTheme) {
      document.querySelector("body")?.setAttribute("data-theme", savedTheme);
    } else {
      document.querySelector("body")?.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    if (savedAccentColor) {
      document
        .querySelector("body")
        ?.setAttribute("data-accentcolor", savedAccentColor);
    } else {
      document.querySelector("body")?.setAttribute("data-accentcolor", "blue");
      localStorage.setItem("accentColor", "blue");
    }
  }, []);
  useEffect(() => {
    if (
      messageHistory.length !== 0 &&
      messageHistory[0].messageType === "user"
    ) {
      handleCurrentMessage(messageHistory[0]);
    }
  }, [messageHistory]);
  const defaultPadding = location.pathname !== "/chat" ? "2rem" : undefined;
  return (
    <MessageContext value={messageHistory}>
      <div className="app">
        <div
          style={{ paddingLeft: defaultPadding, paddingRight: defaultPadding }}
          className="app__content"
        >
          <Outlet />
        </div>
        <div className="app__chat-bar">
          <ChatBar
            onSubmit={handleUserMessage}
            onFocus={() => {
              navigate("/chat");
            }}
          />
        </div>
        <Navigation />
      </div>
    </MessageContext>
  );
}

export default App;
