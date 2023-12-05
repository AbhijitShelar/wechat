// Dashboard.js

import React, { useEffect, useState } from "react";
import { useMyContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import { Button } from "react-bootstrap";
import io from "socket.io-client";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useMyContext();
  const [chatText, setChatText] = useState("");
  const nameHeader = sessionStorage.getItem("name");
  const socket = io("http://localhost:3000");

  useEffect(() => {
    // Set up the 'recieve' event listener only once
    const handleReceive = (data) => {
      console.log("Received message:", data);
      append(`${data.message.name}: ${data.message.message}`, 'left');
    };

    socket.on("recieve", handleReceive);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("recieve", handleReceive);
    };
  }, [socket]); // Depend on the socket to prevent multiple listeners

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setChatText(e.target.value);
  };

  const append = (message, position) => {
    const chatContainer = document.querySelector(".chat-area");
    const messageElement = document.createElement("div");
    messageElement.textContent = message; // Use textContent to set the text
    messageElement.classList.add("message");
    messageElement.classList.add(position);
    chatContainer.append(messageElement);
  };
  

  const handleClick = () => {
    socket.emit("send", { message: chatText, name: nameHeader });
    append(`You: ${chatText}`, "right");
    setChatText("");
  };

  return (
    <div className="container">
      <div className="users-list"></div>
      <div className="chat-dashboard">
        <div className="user-name-header">{nameHeader}</div>
        <div className="chat-area">
          {/* Messages will be displayed here */}
        </div>
        <textarea className="chat-send-box" value={chatText} onChange={handleChange}></textarea>
        <Button className="send-btn" onClick={handleClick} />
      </div>
    </div>
  );
};

export default Dashboard;
