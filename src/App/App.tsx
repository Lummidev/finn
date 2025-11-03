import { useEffect, useMemo, useState } from "react";
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
import { useLiveQuery } from "dexie-react-hooks";
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [settings, setSettings] = useState({
    theme: "dark",
    alwaysShowChatBar: false,
  });
  const messages = useLiveQuery<JoinedMessage[], JoinedMessage[]>(
    () => MessageRepository.getAll(),
    [],
    [],
  );

  const handleUserMessage = async (text: string) => {
    const trimmedText = text.trim();
    if (trimmedText.length === 0) return;
    await MessageRepository.insert({
      messageType: "user",
      content: trimmedText,
    });
  };

  useEffect(() => {
    const { theme, alwaysShowChatBar } = Settings.load();
    setSettings({ theme, alwaysShowChatBar });
  }, []);
  useEffect(() => {
    const lastMessage = [...messages].shift();
    if (messages.length !== 0 && lastMessage) {
      const { messageType, content } = lastMessage;
      if (messageType === "user" && content) {
        handleMessage(content).catch((e) => {
          console.error(e);
          throw e;
        });
      }
    }
  }, [messages]);
  const atChat = location.pathname === "/chat";
  const defaultPadding = !atChat ? "2rem" : undefined;
  const settingsContext = useMemo(() => {
    return { settings, setSettings };
  }, [settings, setSettings]);
  return (
    <MessageContext value={messages}>
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
