import React, { useEffect, useState, useCallback } from "react";
import { useMyContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import io from "socket.io-client";
import { fetchUsersList } from "./api";
// import { appendMessage } from "./utils";

import Chatboard from "./Chatboard";
import { Button } from "react-bootstrap";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    currentChatHeader,
    setCurrentChatHeader,
    setIsAuthenticated,
  } = useMyContext();
  const [chatText, setChatText] = useState("");
  const nameHeader = sessionStorage.getItem("name");
  const [socket, setSocket] = useState(null);
  const [userList, setUserList] = useState([]);
  const [rec, setRec] = useState(null);
  const [click, setClick] = useState(null);
  const [messages, setMessages] = useState([]);

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
      console.log("messageRecipientId:", data.messageRecipientId);
      console.log("Message Recipient name",data.messageRecipientName)
      console.log("Sender Id:", data.messageSenderId);
      console.log("Sender name:", data.messageSenderName);
      console.log("Current user name:", nameHeader);

  
      if (
        data.messageRecipientId === sessionStorage.getItem("userId") &&
        data.messageSenderName !== nameHeader
      ) {
        // appendMessage(`${data.name}: ${data.message}`, "left");

        setMessages((prevMessages) => {
          const newMessage = {
            message: data.message,
            messageSenderName: data.messageSenderName,
            messageSenderId: data.messageSenderId,
            messageRecipientId: data.messageRecipientId,
            messageRecipientName: data.messageRecipientName,
            attach: data.attach,
            timestamp:data.timestamp,
          };
        
          const newMessages = [...prevMessages, newMessage];
        
          return newMessages;
        });
        
      }
    };

    socket.on("receive", handleReceive);

    return () => {
      socket.off("receive", handleReceive);
    };
  }, [socket, rec, nameHeader]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
      alert("Please Login First");
    }
  }, [isAuthenticated, navigate]);

  // useEffect(() => {

  //   fetchUsersList().then((usersList) => setUserList(usersList));
  // }, []);

  useEffect(() => {
    if (socket) {
      socket.on("updateList", () => {
        fetchUsersList().then((usersList) => setUserList(usersList));
      });
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off("updateList");
      }
    };
  }, [socket]);

  const handleUserClick = useCallback(
    (name, recieverId) => {
      setCurrentChatHeader(name);
      setRec(recieverId);
      setClick(true);
    },
    [setCurrentChatHeader]
  );

  const [isAccountTabOpen, setIsAccountTabOpen] = useState(false);

  const toggleAccountTab = () => {
    setIsAccountTabOpen((prev) => !prev);
  };
  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.clear();
  };

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
            <div className="account-tab-button" onClick={toggleAccountTab}>
              My Account
            </div>

            {isAccountTabOpen && (
              <div className="account-tab">
                <span className="close-button" onClick={toggleAccountTab}>
                  &times;
                </span>
                <p className="tab">Account Details</p>
                <p className="tab">Name: {nameHeader}</p>
                <Button className="logout-btn" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
            )}
          </div>

          {click ? (
            <Chatboard
              chatText={chatText}
              setChatText={setChatText}
              nameHeader={nameHeader}
              rec={rec}
              socket={socket}
              currentChatHeader={currentChatHeader}
              messages={messages}
            
            />
          ) : (
            <section className="no-active-users">
              <p className="welcome-tab">{nameHeader}!! Welcome To WeChat</p>
            </section>
          )}
        </>
      ) : (
        <h1>Please log in to view the dashboard.</h1>
      )}
    </div>
  );
};

export default Dashboard;
