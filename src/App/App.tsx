import { useEffect, useMemo, useState } from "react";
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
import { SettingsContext } from "../Context/SettingsContext";
import { Settings } from "../settings";
function App() {
  const [messageHistory, setMessageHistory] = useState<JoinedMessage[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const [settings, setSettings] = useState({
    theme: "dark",
    alwaysShowChatBar: false,
  });
  const handleUserMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return;
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
    const { theme, alwaysShowChatBar } = Settings.load();
    setSettings({ theme, alwaysShowChatBar });
  }, []);
  useEffect(() => {
    if (
      messageHistory.length !== 0 &&
      messageHistory[0].messageType === "user"
    ) {
      handleCurrentMessage(messageHistory[0]);
    }
  }, [messageHistory]);
  const atChat = location.pathname === "/chat";
  const defaultPadding = !atChat ? "2rem" : undefined;
  const settingsContext = useMemo(() => {
    return { settings, setSettings };
  }, [settings, setSettings]);
  return (
    <MessageContext value={messageHistory}>
      <SettingsContext value={settingsContext}>
        <div className="app">
          <div
            style={{
              paddingLeft: defaultPadding,
              paddingRight: defaultPadding,
            }}
            className="app__content"
          >
            <Outlet />
          </div>
          {(settings.alwaysShowChatBar || atChat) && (
            <div className="app__chat-bar">
              <ChatBar
                onSubmit={handleUserMessage}
                onFocus={() => {
                  navigate("/chat");
                }}
              />
            </div>
          )}

          <Navigation />
        </div>
      </SettingsContext>
    </MessageContext>
  );
}

export default App;
