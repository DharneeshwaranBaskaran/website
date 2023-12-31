import React, {useState } from "react";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import './App.css';
import withLogoutHandler from "./withLogouthandler";
import { useLoginContext } from "../contexts/LoginContext";
import Cookies from "js-cookie";
const Address = () => {
  const Username = Cookies.get("username");
  const navigate = useNavigate();
  const [address, setaddress] = useState('');
  const { jwt, setjwt } = useLoginContext();
  const handleChange4 = (e) => {
    const value = e.target.value;
    setaddress(value);
  };

  const updateaddress = async () => {
    if (address == "") {
      enqueueSnackbar("enter address");
    }
    else {
      try {
        const url = `http://localhost:8080/api/updateAddress/${Username}`;
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(address),
        };
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          enqueueSnackbar("Updated Successfully");
        } else {
          console.log('Error updating user address');
        }
      } catch (error) {
        console.log('Error updating user address catch');
      }
      navigate(`/${Cookies.get("type")}/homepage`);
    }
  }
  
  const handlehome = () => {
    navigate(`/${Cookies.get("type")}/homepage`);
  }
  return (
    
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
      {jwt ==Cookies.get('token') && ( 
      <>
      <div className="logout-button"   >
        <button onClick={handlehome} style={{ backgroundColor: "#713ABE", color: "white" }}>Home</button>
      </div>
      <div className="app"  >
        <div className="logins" >
          <h3 style={{ textAlign: "center" }} data-testid="PRODUCTS:">Alter Delivery Address</h3>
          <input
            style={{ width: "200px", marginLeft: "45px" }}
            type="text"
            placeholder="Personal Address"
            value={address}
            onChange={handleChange4}
          /><button style={{ marginLeft: "110px" }} className="lob" onClick={updateaddress}>Confirm</button>
        </div>
      </div> 
      </>
    )}
    </div>
  );
}
export default withLogoutHandler(Address);