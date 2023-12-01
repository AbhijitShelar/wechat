import React, { useState } from "react";
import "./styles/Signup.css";
import axios from "axios";
const Signup = ({ onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    mobile: "",
    age: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/signup",
        formData
      );
       
      console.log(response.data.message);
    } catch (error) {
      console.error("Login error:", error.message);
    }

    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-content signup-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <h2>Signup Form</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <label>
            First Name:
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Last Name:
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Mobile No:
            <input
              type="tel"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
            />
          </label>
          <label>
            Age:
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </label>
          <button type="submit">Signup</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
