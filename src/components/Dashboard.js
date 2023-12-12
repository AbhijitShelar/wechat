// Dashboard.js

import React, { useEffect, useState, useCallback } from "react";
import { useMyContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import { Button } from "react-bootstrap";
import io from "socket.io-client";
import { appendMessage } from "./utils";
import { fetchUsersList } from "./api";
// Dashboard.js

// ... (existing imports)

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentChatHeader, setCurrentChatHeader } = useMyContext();
  const [chatText, setChatText] = useState("");
  const nameHeader = sessionStorage.getItem("name");
  const [socket, setSocket] = useState(null);
  const [userList, setUserList] = useState([]);
  const [rec, setRec] = useState(null);
 
  useEffect(() => {
    console.log("Dashboard component mounted");

    const newSocket = io("http://localhost:3000");

    newSocket.on("connect", () => {
      console.log("Connected to server");

      const userData = {
        userId: sessionStorage.getItem("userId"),
        name: sessionStorage.getItem("name"),
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
      appendMessage(`${data.name}: ${data.message}`, "left");
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
    fetchUsersList().then((usersList) => setUserList(usersList));
  }, []);

  
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
    appendMessage(`You: ${chatText}`, "right");
    setChatText("");
  };

  const handleUserClick = useCallback(
    (name, recieverId) => {
      setCurrentChatHeader(name);
      setRec(recieverId);
      console.log("users list", userList);
    },
    [setCurrentChatHeader, userList]
  );

  return (
    <div className="container">
      {isAuthenticated ? (
        <>
          <div className="users-list">
            <div className="active-users"> Active Users</div>
            {userList.map((user) => (
              <div
                key={user.recieverId}
                className="user-header"
                onClick={() => handleUserClick(user.name, user.recieverId)}
              >
                {user.name}
              </div>
            ))}
          </div>

          <div className="chat-dashboard">
            <div className="user-name-header">{currentChatHeader}</div>
            <div className="chat-area">
              {/* Messages will be displayed here */}
            </div>
            <textarea
              className="chat-send-box"
              value={chatText}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            ></textarea>
            <Button className="send-btn" onClick={handleClick} />
          </div>
        </>
      ) : (
        <p>Please log in to view the dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
