import { useState } from "react";
import "./App.css";
import { Message } from "../Entities/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { faRobot } from "@fortawesome/free-solid-svg-icons/faRobot";
function App() {
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const insertSystemMessage = () => {
    setMessageHistory([Message.system(message), ...messageHistory]);
  };
  const insertUserMessage = () => {
    setMessageHistory([Message.user(message), ...messageHistory]);
  };
  return (
    <div className="app">
      <div className="app__chat-area">
        {messageHistory.map((msg) => (
          <p
            key={msg.id}
            className={`app__chat-bubble app__chat-bubble--${msg.fromUser ? "user" : "system"}`}
          >
            {msg.content}
          </p>
        ))}
      </div>
      <form
        className="app__chat-bar"
        onSubmit={(e) => {
          insertUserMessage();
          e.preventDefault();
        }}
      >
        <input
          className="app__chat-input"
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
          }}
        />
        <div className="app__chat-button-area">
          <button
            type="button"
            onClick={() => {
              insertSystemMessage();
            }}
            className="app__chat-button"
          >
            <FontAwesomeIcon icon={faRobot} />
          </button>
          <button className="app__chat-button" type="submit">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
