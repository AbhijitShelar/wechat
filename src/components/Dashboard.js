// Dashboard.js

import React, { useEffect, useState ,useCallback} from "react";
import { useMyContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import { Button } from "react-bootstrap";
import io from "socket.io-client";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated ,currentChatHeader,setCurrentChatHeader} = useMyContext();
  const [chatText, setChatText] = useState("");
  const nameHeader = sessionStorage.getItem("name");
  const socket = io("http://localhost:3000");
  const [userList, setUserList] = useState([]);
  useEffect(() => {
    // Set up the 'recieve' event listener only once
    const handleReceive = (data) => {
      console.log("Received message:", data);
      append(`${data.message.name}: ${data.message.message}`, "left");
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

  useEffect(() => {
    const fetchUsersList = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/userslist");
        console.log(response.data);

        // Assuming response.data is an array of user objects
        const names = response.data.map((user) => user.firstName + ' ' + user.lastName);

        setUserList(names);
        console.log(userList);
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
    socket.emit("send", { message: chatText, name: nameHeader });
    append(`You: ${chatText}`, "right");
    setChatText("");
  };
  const handleUserClick = useCallback((name) => {
    setCurrentChatHeader(name);
  }, [setCurrentChatHeader]);


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
