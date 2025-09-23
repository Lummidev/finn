import { useEffect, useState } from "react";
import { Message } from "../Entities/Message";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { parseEntry } from "../Parser/parser";
import { ParserError } from "../Parser/ParserError";
import "./App.css";
function App() {
  const [message, setMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<Message[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);

  const sendUserMessage = () => {
    setMessageHistory([Message.user(message.trim()), ...messageHistory]);
    setCurrentMessage(message.trim());
  };
  const handleCurrentMessage = () => {
    if (!currentMessage) return;
    try {
      const entry = parseEntry(currentMessage);
      setMessageHistory([
        Message.system(JSON.stringify(entry, null, " ")),
        ...messageHistory,
      ]);
    } catch (e) {
      if (e instanceof ParserError) {
        setMessageHistory([Message.system(e.message), ...messageHistory]);
      } else {
        setMessageHistory([
          Message.system(`Ocorreu um erro : ${JSON.stringify(e)}`),
          ...messageHistory,
        ]);
      }
    }
  };
  useEffect(() => {
    if (!currentMessage) return;
    if (messageHistory.length === 0 || !messageHistory[0]?.fromUser) {
      setCurrentMessage(null);
      return;
    }
    handleCurrentMessage();
    setCurrentMessage(null);
  }, [currentMessage, messageHistory]);
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
          sendUserMessage();
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
          <button className="app__chat-button" type="submit">
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;
