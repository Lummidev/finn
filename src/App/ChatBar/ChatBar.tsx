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
  const disabled = text.trim().length === 0;
  return (
    <form
      className="chat-bar"
      onSubmit={(e) => {
        e.preventDefault();
        if (disabled) return;
        props.onSubmit(text.trim());
        setText("");
      }}
    >
      <input
        className="chat-bar__input"
        type="text"
        value={text}
        onFocus={props.onFocus}
        placeholder="Digite seu gasto aqui"
        onChange={(e) => {
          setText(e.target.value);
        }}
      />
      <div className="chat-bar__button-area">
        <button className="chat-bar__button" disabled={disabled} type="submit">
          <FontAwesomeIcon icon={faPaperPlane} />
        </button>
      </div>
    </form>
  );
};
