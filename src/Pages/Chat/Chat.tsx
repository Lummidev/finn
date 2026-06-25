import { Fragment, use, useContext, useEffect, useMemo, useRef } from "react";
import { ChatBubble } from "../../Components/ChatBubble/ChatBubble";
import "./Chat.css";
import { MessageContext } from "../../Context/MessageContext";
import { PageHeader } from "../../Components/PageHeader/PageHeader";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { MessageRepository } from "../../Database/MessageRepository";
import type { Message } from "../../Entities/Message";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { formatRelativeDate } from "../../util";
import { SettingsContext } from "../../Context/SettingsContext";

export const Chat = () => {
  const { t } = useTranslation("chat");
  const { settings } = useContext(SettingsContext);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const messageHistory = use(MessageContext);
  const dateMessageGroups = useMemo(() => {
    const messagesGroupedByDate: Record<string, Message[]> = {};
    messageHistory.forEach((message) => {
      const date = dayjs(message.createdAtTimestampMilliseconds).startOf("day");
      const formattedDate = formatRelativeDate(date.toISOString());
      if (!messagesGroupedByDate[formattedDate]) {
        messagesGroupedByDate[formattedDate] = [message];
      } else {
        messagesGroupedByDate[formattedDate] = [
          ...messagesGroupedByDate[formattedDate],
          message,
        ];
      }
    });
    return messagesGroupedByDate;
  }, [messageHistory]);
  useEffect(() => {
    const navHeight = document
      .querySelector(".navigation")
      ?.getBoundingClientRect().height;
    if (!chatBoxRef?.current || !navHeight) {
      return;
    }
    chatBoxRef.current.style.maxHeight = `calc(100dvh - var(--header-height) - ${navHeight}px)`;
  }, [settings]);
  return (
    <div className={`chat`}>
      <PageHeader
        className="chat__title"
        title={t("pageNames.chat", { ns: "common" })}
        subMenu={[
          {
            name: t("clearChat"),
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
      <div className="chat__box" ref={chatBoxRef}>
        {Object.keys(dateMessageGroups).map((date) => {
          const messages = dateMessageGroups[date];
          return (
            <Fragment key={date}>
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}
              <div className="chat__date-separator">{date}</div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};
