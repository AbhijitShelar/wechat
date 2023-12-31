import React, { useEffect, useState, useCallback } from "react";
import { useMyContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import io from "socket.io-client";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchUsersList } from "./api";
import BASE_URL from "./config";

import Chatboard from "./Chatboard";
import AccountDetails from "./AccountDetails";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    isAuthenticated,
    currentChatHeader,
    setCurrentChatHeader,
   
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

    const newSocket = io(`${BASE_URL}`);

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
      console.log("Message Recipient name", data.messageRecipientName);
      console.log("Sender Id:", data.messageSenderId);
      console.log("Sender name:", data.messageSenderName);
      console.log("Current user name:", nameHeader);

      if (
        data.messageRecipientId === sessionStorage.getItem("userId") &&
        data.messageSenderName !== nameHeader
      ) {

        setMessages((prevMessages) => {
          const newMessage = {
            message: data.message,
            messageSenderName: data.messageSenderName,
            messageSenderId: data.messageSenderId,
            messageRecipientId: data.messageRecipientId,
            messageRecipientName: data.messageRecipientName,
            attach: data.attach,
            timestamp: data.timestamp,
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
      navigate("/login");
       
      if(!isAuthenticated && sessionStorage.getItem("token") ){
      toast.error("Please Login First", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1000, // milliseconds until the toast closes automatically
      });    }
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (socket) {
      socket.on("updateList", () => {
        fetchUsersList().then((usersList) => setUserList(usersList));
        if (userList.length === 0) {
          setClick(false);
        }
      });
    }

    // Cleanup
    return () => {
      if (socket) {
        socket.off("updateList");
      }
    };
  }, [socket, userList]);

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
                  <img
                    src="https://imgs.search.brave.com/ja0XPP13-o-_cdTosLWtv__wH3lpZHjzZCL2922yGIU/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9tYXN0/aW1vcm5pbmcuY29t/L3dwLWNvbnRlbnQv/dXBsb2Fkcy8yMDIz/LzA5L2RwLWltYWdl/LmpwZw"
                    alt="Person"
                    width="96"
                    height="96"
                  ></img>
                  {user.name}

                </div>
              ))
            ) : (
              <h1>No active users available</h1>
            )}
            <AccountDetails nameHeader={nameHeader}/>
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
