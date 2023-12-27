import React, { useEffect } from "react";
import { useState } from "react";
import { Button } from "react-bootstrap";
import { useMyContext } from "../context/ChatContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles/AccountDetails.css";
import { fetchAccountDetails } from "./api";
const AccountDetails = ({ nameHeader }) => {
  const { setIsAuthenticated } = useMyContext();
  const [isAccountTabOpen, setIsAccountTabOpen] = useState(false);
  const [accountDetails,setAccountDetails]=useState();

  const toggleAccountTab = () => {
    setIsAccountTabOpen((prev) => !prev);
  };
  const handleLogout = () => {
    toast.warning("Logged Out", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 2000,
    });
    setIsAuthenticated(false);
    sessionStorage.clear();
  };
  useEffect(()=>{
    fetchAccountDetails().then((accountdetails) => setAccountDetails(accountdetails));
  },[accountDetails]);

  return (
    <>
      <div className="account-tab-button" onClick={toggleAccountTab}>
        My Account
      </div>

      {isAccountTabOpen && (
        <div className="account-tab">
          <span className="close-button" onClick={toggleAccountTab}>
            &times;
          </span>
          <p className="header-tab">Account Details</p>
          <p className="tab">Name: {`${accountDetails.firstName } ${accountDetails.lastName}` }</p>
          <p className="tab">Mobile: {`${accountDetails.mobile } ` }</p>
          <p className="tab">Email: {`${accountDetails.email } ` }</p>


          <Button className="logout-btn" onClick={handleLogout}>
            Log Out
          </Button>
        </div>
      )}
    </>
  );
};

export default AccountDetails;
