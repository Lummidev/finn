import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ChatBubble.css";
import {
  faCheck,
  faMoneyBill,
  faCalendar,
  faArrowUpRightFromSquare,
  type IconDefinition,
  faTag,
  faQuestion,
  faEllipsisH,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import type { JoinedMessage } from "../../Database/MessageRepository";
import { Link } from "react-router";
import { categoryIcons } from "../../categoryIcons";
import { useTranslation } from "react-i18next";
interface ChatBubbleProps {
  message: JoinedMessage;
}
const MessageDisplay = ({ message }: { message: JoinedMessage }) => {
  const { t } = useTranslation("chatBubble");
  const isErrorMessage = message.messageType === "error";
  const isUserMessage = message.messageType === "user";
  const showIcon = (iconName?: string): IconDefinition => {
    if (!iconName) return faTag;
    const icon = categoryIcons[iconName]?.icon;
    return icon ? icon : faQuestion;
  };
  if (!(message.messageType === "success" && message.initialEntryInformation)) {
    if (isErrorMessage && message.errorCode) {
      return (
        <>
          <FontAwesomeIcon icon={faXmark} />
          {t(message.errorCode, {
            ns: "messageErrors",
            defaultValue: t("unknown", { ns: "messageErrors" }),
          })}
          {message.errorDetails ? (
            <>
              {t("checkDetails", { ns: "messageErrors" })}
              <div className="chat-bubble__error-details">
                <code>{message.errorDetails}</code>
              </div>
            </>
          ) : (
            <></>
          )}
        </>
      );
    }
    if (isUserMessage) {
      return <>{message.content}</>;
    }
  } else {
    return (
      <div className="chat-bubble__display">
        <div className="chat-bubble__display-row">
          <FontAwesomeIcon icon={faCheck} />
          {t("confirmationMessage")}
        </div>
        <div className="chat-bubble__display-row">
          "{message.initialEntryInformation.description}"
        </div>
        <div className="chat-bubble__display-row">
          <FontAwesomeIcon icon={faMoneyBill} />
          {t("currency", {
            value: message.initialEntryInformation.moneyExpent,
            formatParams: {
              value: {
                currency: "BRL",
              },
            },
          })}
        </div>
        <div className="chat-bubble__display-row">
          {message.initialEntryInformation.category ? (
            <>
              <FontAwesomeIcon
                icon={showIcon(
                  message.initialEntryInformation.category?.iconName,
                )}
              />
              {message.initialEntryInformation.category.name}
            </>
          ) : (
            <>
              <FontAwesomeIcon icon={faEllipsisH} />
              {t("noCategory", { ns: "common" })}
            </>
          )}
        </div>
        <div className="chat-bubble__display-row">
          <FontAwesomeIcon icon={faCalendar} />
          {dayjs(message.createdAtTimestampMiliseconds).format("L")}
        </div>
      </div>
    );
  }
};
export const ChatBubble = (props: ChatBubbleProps) => {
  const isErrorMessage = props.message.messageType === "error";
  const entryDeleted = !!props.message.entryID && !props.message.entry;
  const { t } = useTranslation("chatBubble");

  return (
    <div className={`chat-bubble chat-bubble--${props.message.messageType}`}>
      <div
        className={`chat-bubble__body
        chat-bubble__body--${props.message.messageType}
        ${isErrorMessage ? "chat-bubble__body--error" : ""}`}
      >
        <div
          className={`chat-bubble__content ${entryDeleted ? "chat-bubble__content--deleted" : ""}`}
        >
          <div>
            <MessageDisplay message={props.message} />
          </div>
          <div
            className={`chat-bubble__date  ${isErrorMessage ? "chat-bubble__date--error" : ""}`}
          >
            {dayjs(props.message.createdAtTimestampMiliseconds).format("LT")}
          </div>
        </div>
        {entryDeleted && (
          <span className="chat-bubble__deleted-notice">
            {t("deletedExpense")}
          </span>
        )}
      </div>
      {!!props.message.entry && (
        <div className="chat-bubble__links">
          <Link
            className="chat-bubble__expense-link"
            to={`/expenses/${props.message.entry.id}`}
          >
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </Link>
        </div>
      )}
    </div>
  );
};
