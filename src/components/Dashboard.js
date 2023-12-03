import { useEffect, useState } from "react";

import React from "react";
import { useMyContext } from "../context/ChatContext";
import { useNavigate } from "react-router-dom";
import "./styles/Dashboard.css";
import { Button } from "react-bootstrap";
const Dashboard = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useMyContext();
  const[chatText,setChatText]=useState();
  const nameHeader=sessionStorage.getItem('name');
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleChange=(e)=>{
    setChatText(e.target.value);
  }
  const chatContainer=document.querySelector('.chat-area')
  const handleClick=()=>{
    const messageElement=document.createElement('div');
    messageElement.innerHTML=chatText;
    messageElement.classList.add('message');
    messageElement.classList.add('right');
    chatContainer.append(messageElement);
    setChatText('');

  }

  return (
    <div className="container">
      <div className="users-list"></div>
      <div className="chat-dashboard">
        <div className="user-name-header">{nameHeader}</div>
        <div className="chat-area">
           <div className="message left">Abhi:How are you</div>
           <div className="message right">Sakshi:I am fine </div>
        </div>
        <textarea className="chat-send-box" value={chatText} onChange={handleChange}></textarea>
        <Button className="send-btn" onClick={handleClick} />
         
        
      </div>
    </div>
  );
};

export default Dashboard;
