import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ErrorMessage } from "../../Entities/ErrorMessage";
import type { Message } from "../../Entities/Message";
import { SuccessMessage } from "../../Entities/SuccessMessage";
import { UserMessage } from "../../Entities/UserMessage";
import "./ChatBubble.css";
import {
  faCheck,
  faMoneyBill,
  faList,
  faCalendar,
} from "@fortawesome/free-solid-svg-icons";
import dayjs from "dayjs";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble = (props: ChatBubbleProps) => {
  const messageSender =
    props.message instanceof UserMessage ? "user" : "system";
  const error = props.message instanceof ErrorMessage;
  const messageDisplay = (message: Message) => {
    if (message instanceof SuccessMessage) {
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
            {dayjs(message.createdAtTimestampMiliseconds).format("L HH:mm")}
          </div>
        </div>
      );
    } else if (message instanceof ErrorMessage) {
      return (
        <>
          <FontAwesomeIcon icon={faXmark} /> {message.toText()}
        </>
      );
    } else {
      return <>{message.toText()}</>;
    }
  };
  return (
    <p
      className={`chat-bubble
        chat-bubble--${messageSender}
        ${error ? "chat-bubble--error" : ""}`}
    >
      {messageDisplay(props.message)}
    </p>
  );
};
