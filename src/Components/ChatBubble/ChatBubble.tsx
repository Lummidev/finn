import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./ChatBubble.css";
import {
  faCheck,
  faMoneyBill,
  faList,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import type { JoinedMessage } from "../../Database/MessageRepository";
interface ChatBubbleProps {
  message: JoinedMessage;
}

export const ChatBubble = (props: ChatBubbleProps) => {
  const error = props.message.messageType === "error";

  const messageDisplay = (message: JoinedMessage) => {
    if (!(message.messageType === "success" && message.entry)) {
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
            "{message.entry.description}"
          </div>
          <div className="chat-bubble__display-row">
            <FontAwesomeIcon icon={faMoneyBill} />

            {"R$" +
              message.entry.moneyExpent.toLocaleString(undefined, {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2,
              })}
          </div>
          <div className="chat-bubble__display-row">
            <FontAwesomeIcon icon={faList} />
            {message.entry.category ? message.entry.category.name : "Outros"}
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
    <div
      className={`chat-bubble
        chat-bubble--${props.message.messageType}
        ${error ? "chat-bubble--error" : ""}`}
    >
      <div>{messageDisplay(props.message)}</div>
      <div
        className={`chat-bubble__date  ${error ? "chat-bubble__date--error" : ""}`}
      >
        {dayjs(props.message.createdAtTimestampMiliseconds).format("HH:mm")}
      </div>
    </div>
  );
};
