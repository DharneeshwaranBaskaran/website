import React, { useRef, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import './App.css';
import { useNavigate } from 'react-router-dom'; 
import withLogoutHandler from "./withLogouthandler";
import { useLoginContext } from "../contexts/LoginContext";
import Cookies from "js-cookie";
function Edit() {
  const [cost, setcost] = useState('');
  const id = Cookies.get('edit');
  const type = Cookies.get('type');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { jwt, setjwt } = useLoginContext();
  const handleChange5 = (e) => {
    const value = e.target.value;
    setcost(value);
  };

  const handleedit = async (event) => {
    const response = await fetch("http://localhost:8080/api/editdata", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id, cost }),
      credentials: 'include',
    });
    if (response.ok) {
      enqueueSnackbar("Registration Successful", { variant: "success" });
      console.log(response);
      navigate(`/${type}/homepage`);

    } else if (response.status === 409) {
      const errorData = await response.json();
      enqueueSnackbar(errorData.error, { variant: "error" });
    } else {
      enqueueSnackbar("Registration Failed", { variant: "error" });
    }
  }

  const back = () => {
    navigate(`/${type}/homepage`);
  }

  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
      {jwt ==Cookies.get('token')&& ( 
        <>
      <div className="logout-button">
        <button onClick={back} >Back To Home 🏠</button>
      </div>
      <div className="app">
        <div className="login-page">
          <h2 data-testid="PRODUCTS:">Edit</h2>
          <input
            type="text"
            placeholder="cost"
            value={cost}
            onChange={handleChange5}
          />
          <button onClick={handleedit} className="lob">Edit</button>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
export default withLogoutHandler(Edit);