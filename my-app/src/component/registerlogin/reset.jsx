import backpic from "../images/backpic.jpg";
import { useSnackbar } from "notistack";
import React, { useState, useEffect } from "react";
import '../App.css';
import { useLoginContext} from "../../contexts/LoginContext";
import Cookies from "js-cookie";
function Reset() {
const renderInput = (type, placeholder, value, onChange, error, name) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
    />
  );
  const [username1, setUsername1] = useState('');
  const [email, setEmail] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const { showModal, setShowModal } = useLoginContext();
  const handlemail = async (event) => {
    if (username1 == "" || email == "") {
      enqueueSnackbar("Enter the Required data");
    }
    const selectedValue = Cookies.get('type');
    try {
      const response = await fetch(`http://localhost:8080/api/pass/${selectedValue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username1, email }),
        credentials: 'include',
      });
      if (response.ok) {
        setShowModal(!showModal);
        enqueueSnackbar("Username and password sent to email", { variant: "success" });
      }
      else {
        console.log(response);
        enqueueSnackbar("Invalid Credentials");
      }
    } catch (error) {
      enqueueSnackbar("An error occurred", { variant: "error" });
    }
  }
  
  const handleChangepass = (event) => {
    const { name, value } = event.target;
    if (name === "username1") {
      setUsername1(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };
  return (
    <div style={{ backgroundImage: `url(${backpic})` }}>
    <div className="app">
      <div className="login-page">
      {showModal && (
          <>
        <h2>Enter Username and Email:</h2>
        <div className="con">
          {renderInput("text", "Username", username1, handleChangepass, "", "username1")}
          {renderInput("text", "Email", email, handleChangepass, "", "email")}
          <button type="submit" className="lob" onClick={handlemail}>Submit</button>
        </div>
        </>
        )}
      </div>
      </div>
      </div>
   );
} 
export default Reset;
