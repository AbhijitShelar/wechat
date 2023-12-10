// Dashboard.js

import React, { useEffect, useState, useCallback } from "react";
import { useMyContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import { Button } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentChatHeader, setCurrentChatHeader } =
    useMyContext();
  const [chatText, setChatText] = useState("");
  const nameHeader = sessionStorage.getItem("name");
  const [socket, setSocket] = useState(null);
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    console.log("Dashboard component mounted");

    const newSocket = io("http://localhost:3000");

    newSocket.on("connect", () => {
      console.log("Connected to server");

      const userData = {
        userId: sessionStorage.getItem("userId"),
      };

      console.log("Emitting 'user-joined' event with data:", userData);
      newSocket.emit("user-joined", userData);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    setSocket(newSocket);

    return () => {
      console.log("Cleaning up Dashboard component");
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Make sure socket is available before using it
    if (!socket) {
      return;
    }

    const handleReceive = (data) => {
      console.log("Received message:", data);
      append(`${data.name}: ${data.message}`, "left");
    };

    // Set up the 'receive' event listener
    socket.on("receive", handleReceive);

    // Clean up the event listener when the component unmounts
    return () => {
      socket.off("receive", handleReceive);
    };
  }, [socket]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/userslist");
        console.log(response.data);

        // Assuming response.data is an array of user object
        const names = response.data.map(
          (user) => user.firstName + " " + user.lastName
        );

        setUserList(names);
      } catch (error) {
        console.error("Error fetching users list:", error);
      }
    };

    fetchUsersList();
  }, []);

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
      to: sessionStorage.getItem("userId"),
    });
    append(`You: ${chatText}`, "right");
    setChatText("");
  };
  const handleUserClick = useCallback(
    (name) => {
      setCurrentChatHeader(name);
    },
    [setCurrentChatHeader]
  );

  return (
    <div className="container">
      <div className="users-list">
        {userList.map((name, index) => (
          <div
            key={index}
            className="user-header"
            onClick={() => handleUserClick(name)}
          >
            {name}
          </div>
        ))}
      </div>

      <div className="chat-dashboard">
        <div className="user-name-header">{currentChatHeader}</div>
        <div className="chat-area">{/* Messages will be displayed here */}</div>
        <textarea
          className="chat-send-box"
          value={chatText}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        ></textarea>
        <Button className="send-btn" onClick={handleClick} />
      </div>
    </div>
  );
};

export default Dashboard;
