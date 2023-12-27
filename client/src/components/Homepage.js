import React, {  useState } from 'react';
// import axios from 'axios';
import { Button } from 'react-bootstrap';
import "./styles/Homepage.css";
import Login from './Login';
import Signup from './Signup';
import { useMyContext } from '../context/ChatContext';



const Homepage = () => {
 
  const {showLogin, setShowLogin} = useMyContext();
  const [showSignup,setShowSignup]=useState(false);

  
  const handleLoginClick = () => {
    setShowLogin(true);
  };

  const handleCloseLogin = () => {
    setShowLogin(false);
  };
  const handleSignupclick=()=>{
    setShowSignup(true);
  }
  const handleCloseSignup=()=>{
    setShowSignup(false);
  }

  return (
    <>
    <div className='container'>
      <h1>Welcome to WeChat</h1>
      <div className="buttons">
        <Button className='login-btn' variant="primary" size="lg" onClick={handleLoginClick}>
          Login
        </Button>
        <Button className='signup-btn' variant="primary" size="lg" onClick={handleSignupclick}>
          Sign Up
        </Button>
      </div>
      

      {showLogin && <Login onClose={handleCloseLogin} />}
      {showSignup && <Signup onClose={handleCloseSignup}/>}
    </div>
    </>
  );
};

export default Homepage;
