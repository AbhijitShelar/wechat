import React, { useState, useEffect } from "react";
import "./styles/Login.css";

const Login = ({ onClose }) => {
  const [showPopup, setShowPopup] = useState(true);

  // Set showPopup to true when the component mounts
  useEffect(() => {
    setShowPopup(true);
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
    onClose(); // Close the login form in the parent component
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setShowPopup(false);
  };

  return (
    <div>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <span className="close" onClick={handleClosePopup}>
              &times;
            </span>
            <h2>Login </h2>
            <form onSubmit={handleLogin} className="login-form">
              <label>
                Username:
                <input type="text" name="username" className="login-input" />
              </label>
              <br />
              <label>
                Password:
                <input type="password" name="password" className="login-input" />
              </label>
              <br />
              <button type="submit" className="login-button">
                Login
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
