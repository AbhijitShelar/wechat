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
  const allMessages = [...messages, ...myMessages];
  allMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));



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
      messageSenderName: nameHeader,
      messageSenderId: sessionStorage.getItem("userId"),
      messageRecipientId: rec,
      messageRecipientName: currentChatHeader,
      attach:'left',
      timestamp: new Date().toISOString()
      
    });
    // appendMessage(`You : ${chatText}`, "right");
    setMyMessages((prevMessages) => [
      ...prevMessages,
      {
        messageSenderName: nameHeader,
        message: chatText,
        messageRecipientName: currentChatHeader,
        messageRecipientId: rec,
        messageSenderId: sessionStorage.getItem("userId"),
        attach:'right',
        timestamp: new Date().toISOString()

      },
    ]);
    setChatText("");
  };

  return (
    <div className="chat-dashboard">
      <div className="user-name-header">{currentChatHeader}</div>
      <div className="chat-area">
      {allMessages
        .filter((message) => {
          return (
            (message.messageSenderName === currentChatHeader && message.attach === 'left') ||
            (message.messageRecipientName === currentChatHeader && message.attach === 'right')
          );
        })
        .map((filteredMessage, index) => (
          <div className={`message ${filteredMessage.attach}`} key={index}>
            {`${filteredMessage.messageSenderName === nameHeader ? 'You' : filteredMessage.messageSenderName} : ${filteredMessage.message}`}
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
