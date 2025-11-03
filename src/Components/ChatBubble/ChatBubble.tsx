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
interface ChatBubbleProps {
  message: JoinedMessage;
}

export const ChatBubble = (props: ChatBubbleProps) => {
  const error = props.message.messageType === "error";
  const deleted = !!props.message.entryID && !props.message.entry;
  const showIcon = (iconName?: string): IconDefinition => {
    if (!iconName) return faTag;
    const icon = categoryIcons[iconName]?.icon;
    return icon ? icon : faQuestion;
  };
  const messageDisplay = (message: JoinedMessage) => {
    if (
      !(message.messageType === "success" && message.initialEntryInformation)
    ) {
      return (
        <>
          {error ? <FontAwesomeIcon icon={faXmark} /> : <></>}
          {message.content}
        </>
      );
    } else {
      return (
        <div className="chat-bubble__display">
          <div className="chat-bubble__display-row">
            <FontAwesomeIcon icon={faCheck} />
            Gasto Registrado!
          </div>
          <div className="chat-bubble__display-row">
            "{message.initialEntryInformation.description}"
          </div>
          <div className="chat-bubble__display-row">
            <FontAwesomeIcon icon={faMoneyBill} />
            {new Intl.NumberFormat(undefined, {
              style: "currency",
              currency: "BRL",
            }).format(message.initialEntryInformation.moneyExpent)}
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
                Sem Categoria
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
  return (
    <div className={`chat-bubble chat-bubble--${props.message.messageType}`}>
      <div
        className={`chat-bubble__body
        chat-bubble__body--${props.message.messageType}
        ${error ? "chat-bubble__body--error" : ""}`}
      >
        <div
          className={`chat-bubble__content ${deleted ? "chat-bubble__content--deleted" : ""}`}
        >
          <div>{messageDisplay(props.message)}</div>
          <div
            className={`chat-bubble__date  ${error ? "chat-bubble__date--error" : ""}`}
          >
            {dayjs(props.message.createdAtTimestampMiliseconds).format("HH:mm")}
          </div>
        </div>
        {deleted && (
          <span className="chat-bubble__deleted-notice">
            Esse gasto foi excluído
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
