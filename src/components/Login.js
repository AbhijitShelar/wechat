import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import axios from "axios";

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  

  const [showPopup, setShowPopup] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setShowPopup(true);
  }, []);
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    onClose();
  };

  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(
        "http://localhost:3000/api/login",
        formData
      );

      const status = response.data.status;
      console.log(status);
      if (status) {
        localStorage.setItem("token", response.data.token);
       
        navigate("/dashboard");
      }
      setShowPopup(false);
    } catch (error) {
      console.log(error);
      console.log("here is error");
    }
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
                <input
                  type="text"
                  name="email"
                  className="login-input"
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  className="login-input"
                  onChange={handleChange}
                />
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
