import React, { useRef, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import './App.css';
import { useNavigate } from 'react-router-dom';
function Edit() {
  const [cost, setcost] = useState('');
  const id = localStorage.getItem('edit');
  const type = localStorage.getItem('type');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleChange5 = (e) => {
    const value = e.target.value;
    setcost(value);
  };

  useEffect(() => {
    const logoutChannel = new BroadcastChannel('logoutChannel');
    logoutChannel.onmessage = () => {

      navigate("/start");
      localStorage.clear();
      window.location.reload();
      enqueueSnackbar("Logout Successful");
    };
  }, []);

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
      <div className="logout-button">
        <button onClick={back}>Back To Home 🏠</button>
      </div>
      <div className="app">
        <div className="login-page">
          <h2>Edit</h2>
          <input
            type="text"
            placeholder="cost"
            value={cost}
            onChange={handleChange5}
          />
          <button onClick={handleedit} className="lob">Edit</button>
        </div>
      </div>
    </div>
  );
}
export default Edit;