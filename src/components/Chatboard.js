// Chatboard.js

import React, { useState } from "react";
import { Button } from "react-bootstrap";
// import { appendMessage } from "./utils";

const Chatboard = ({
  chatText,
  setChatText,
  nameHeader,
  rec,
  socket,
  currentChatHeader,
  messages,
}) => {
  const [myMessages, setMyMessages] = useState([]);
  const handleChange = (e) => {
    setChatText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleClick();
    }
  };

  const handleClick = () => {
    console.log("sending message");
    socket.emit("send", {
      message: chatText,
      name: nameHeader,
      to: rec,
    });
    // appendMessage(`You : ${chatText}`, "right");
    setMyMessages((prevMessages) => [
      ...prevMessages,
      {
        sender: "You",
        message: chatText,
        receiver: currentChatHeader,
      },
    ]);
    setChatText("");
  };

  return (
    <div className="chat-dashboard">
      <div className="user-name-header">{currentChatHeader}</div>
      <div className="chat-area">
        {messages
          .filter((message) => {
            // Filter messages based on the currentChatHeader
            const messageSender = message.split(":")[0].trim();
            return messageSender === currentChatHeader;
          })
          .map((message, index) => (
            <div className="message left" key={index}>
              {message}
            </div>
          ))}
          {myMessages
          .filter((myMessage) => myMessage.receiver === currentChatHeader)
          .map((filteredMessage, index) => (
            <div className="message right" key={index}>
             {`${filteredMessage.sender} : ${filteredMessage.message}`}
            </div>
          ))}
     
      </div>
      <textarea
        className="chat-send-box"
        value={chatText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      ></textarea>
      <Button className="send-btn" onClick={handleClick} />
    </div>
  );
};

export default Chatboard;
