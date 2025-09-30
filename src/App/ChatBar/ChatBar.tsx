import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import "./ChatBar.css";
export interface ChatBarProps {
  onSubmit: (text: string) => unknown;
  onFocus: () => unknown;
}

export const ChatBar = (props: ChatBarProps) => {
  const [text, setText] = useState("");
  return (
    <form
      className="chat-bar"
      onSubmit={(e) => {
        props.onSubmit(text);
        setText("");
        e.preventDefault();
      }}
    >
      <input
        className="chat-bar__input"
        type="text"
        value={text}
        onFocus={props.onFocus}
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <div className="chat-bar__button-area">
        <button className="chat-bar__button" type="submit">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </form>
  );
};
