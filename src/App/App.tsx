import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import { handleMessage } from "../ChatBot/ChatBot";
import {
  MessageRepository,
  type JoinedMessage,
} from "../Database/MessageRepository";
import { Outlet, useLocation } from "react-router";
import { Navigation } from "./Navigation/Navigation";
import { MessageContext } from "../Context/MessageContext";
import { SettingsContext } from "../Context/SettingsContext";
import { Settings } from "../settings";
import { useLiveQuery } from "dexie-react-hooks";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { useWindowSize } from "../Hooks/useWindowSize";

function App() {
  const {
    i18n: { language },
  } = useTranslation();
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null);
  const windowSize = useWindowSize();
  const [settings, setSettings] = useState({
    theme: "dark",
    alwaysShowChatBar: false,
    navigationTabsStyle: "floating",
  });
  const messages = useLiveQuery<JoinedMessage[], JoinedMessage[]>(
    async () =>
      (await MessageRepository.getAll()).sort(
        (a, b) =>
          b.createdAtTimestampMilliseconds - a.createdAtTimestampMilliseconds,
      ),
    [],
    [],
  );

  useEffect(() => {
    dayjs.locale(language);
  }, [language]);
  useEffect(() => {
    const { theme, alwaysShowChatBar, navigationTabsStyle } = Settings.load();
    setSettings({ theme, alwaysShowChatBar, navigationTabsStyle });
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
  const settingsContext = useMemo(() => {
    return { settings, setSettings };
  }, [settings, setSettings]);
  useEffect(() => {
    const navHeight = document
      .querySelector(".navigation")
      ?.getBoundingClientRect().height;
    if (!contentRef?.current || !navHeight) {
      return;
    }
    contentRef.current.style.paddingBottom = `${navHeight}px`;
    /* Reacting to the window size is necessary for this operation since the
    navigation tabs will change size on certain screen sizes because of their
    font */
  }, [settings, windowSize]);
  const showingChatBar = atChat || settings.alwaysShowChatBar;
  return (
    <MessageContext value={messages}>
      <SettingsContext value={settingsContext}>
        <div className="app">
          <div
            className={`app__content ${showingChatBar ? "app__content--chat-bar" : ""}  ${atChat ? "app__content--chat" : ""} `}
            ref={contentRef}
          >
            <Outlet />
          </div>

          <Navigation />
        </div>
      </SettingsContext>
    </MessageContext>
  );
}

export default App;
