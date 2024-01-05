import React, { useRef, useEffect, useState } from "react";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import './App.css';
import withLogoutHandler from "./withLogouthandler";
import { useLoginContext } from "../contexts/LoginContext";
const Email = () => {
  const Username = localStorage.getItem("username");
  const navigate = useNavigate();
  const { jwt, setjwt } = useLoginContext();
  const [email, setemail] = useState('');
  const handleChange4 = (e) => {
    const value = e.target.value;
    setemail(value);
  };

  const updateemail = async () => {
    if (email == "" || !(email.includes("@"))) {
      enqueueSnackbar("enter a valid email");
    }
    else {
      try {
        const response = await fetch(`http://localhost:8080/api/updateEmail/${Username}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(email),
        });
      
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          enqueueSnackbar("Updated Successfully");
        } else {
          console.log('Error updating user email');
        }
      } catch (error) {
        console.log('Error updating user email catch');
      }
      
      navigate(`/${localStorage.getItem("type")}/homepage`);
    }
  }
  const handlehome = () => {
    navigate(`/${localStorage.getItem("type")}/homepage`);
  }

  return (
    
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
      {jwt && ( 
      <>
      <div className="logout-button"   >
        <button onClick={handlehome} style={{ backgroundColor: "#713ABE", color: "white" }}>Home 🏠</button>
      </div>
      <div className="app"  >
        <div className="logins" >
          <h3 style={{ textAlign: "center" }}data-testid="PRODUCTS:">Alter Delivery Email</h3>
          <input
            style={{ width: "200px", marginLeft: "45px" }}
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={handleChange4}
          /><button style={{ marginLeft: "110px" }} className="lob" onClick={updateemail}>Confirm</button>
        </div>
      </div> 
      </> 
    )}
    </div>
  );
}
export default withLogoutHandler(Email);