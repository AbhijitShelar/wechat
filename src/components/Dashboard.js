// Dashboard.js

import React, { useEffect, useState, useCallback } from "react";
import { useMyContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import io from "socket.io-client";
import { appendMessage } from "./utils";
import { fetchUsersList } from "./api";
import Chatboard from "./Chatboard";

const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated, currentChatHeader, setCurrentChatHeader } =
    useMyContext();
  const [chatText, setChatText] = useState("");
  const nameHeader = sessionStorage.getItem("name");
  const [socket, setSocket] = useState(null);
  const [userList, setUserList] = useState([]);
  const [rec, setRec] = useState(null);
  const [click,setClick]=useState(null);

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
    if (!socket) {
      return;
    }

    const handleReceive = (data) => {
      console.log("Received message:", data);
      appendMessage(`${data.name}: ${data.message}`, "left");
    };

    socket.on("receive", handleReceive);

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

  const handleUserClick = useCallback(
    (name, recieverId) => {
      setCurrentChatHeader(name);
      setRec(recieverId);
      setClick(true);
    },
    [setCurrentChatHeader]
  );

  return (
    <div className="dashboard-container">
      {isAuthenticated ? (
        <>
          <div className="users-list">
            <div className="active-users"> Active Users</div>
            {userList.length > 0 ? (
            userList.map((user) => (
              <div
                key={user.recieverId}
                className="user-header"
                onClick={() => handleUserClick(user.name, user.recieverId)}
              >
                {user.name}
              </div>
            ))
          ) : (
            <h1>No active users available</h1>
          )}


          </div>
         {click ?(
            <Chatboard
              chatText={chatText}
              setChatText={setChatText}
              nameHeader={nameHeader}
              rec={rec}
              socket={socket}
              currentChatHeader={currentChatHeader}
            />
            ):(<h1 className="no-active-users">Welcome To WeChat!!</h1>)}
        </>
      ) : (
        <p>Please log in to view the dashboard.</p>
      )}
    </div>
  );
};

export default Dashboard;
