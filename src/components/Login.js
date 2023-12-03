import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyContext } from "../context/ChatContext";
import "./styles/Login.css";
import axios from "axios";

// ... (other imports)

const Login = ({ onClose }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useMyContext();

  const [showPopup, setShowPopup] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    setShowPopup(true);
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Use sessionStorage
    if (token) {
      setIsAuthenticated(true);
      navigate("/dashboard");
    }
  }, [setIsAuthenticated, navigate]);

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

      const { status, token,name } = response.data;

      if (status) {
        setIsAuthenticated(true);
        sessionStorage.setItem("token", token); // Use sessionStorage
        sessionStorage.setItem("name",name);
        navigate("/dashboard");
      } else {
        setIsAuthenticated(false);
      }
      setShowPopup(false);
    } catch (error) {
      console.log(error);
      console.log("Here is an error");
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
