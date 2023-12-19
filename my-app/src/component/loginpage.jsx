import backpic from "./images/backpic.jpg";
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from "react";
import './App.css';
function LoginPage() {
  const errorStyle = {
    color: 'red',
    fontSize: '10px',
  };

  const renderInput = (type, placeholder, value, onChange, error, name) => (
    <> <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
    />
      <div style={errorStyle}>{error}</div>
    </>
  );
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [username1, setUsername1] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const type = localStorage.getItem('type');
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handlemail = async (event) => {
    if (username1 == "" || email == "") {
      enqueueSnackbar("Enter the Required data");
    }
    const selectedValue = localStorage.getItem('type');
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

  const handleLogin = async (event) => {
    if (password == "") {
      setError1("*Enter Password");
      setError2('');
    }
    const selectedValue = localStorage.getItem('type');
    try {
      const response = await fetch(`http://localhost:8080/api/${selectedValue}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
        credentials: 'include',
      });

      if (response.ok) {
        const token = await response.text();
        localStorage.setItem('token', token);
        console.log(token);
        localStorage.setItem('username', username);
        console.log(username);
        navigate(`/${type}/homepage`);
        enqueueSnackbar("Login successfully", { variant: "success" });
      }
      else {
        console.log(response);
        enqueueSnackbar("Invalid Credentials");
      }
    } catch (error) {
      console.log(error.message)
      enqueueSnackbar("An error occurred: " + error.message, { variant: "error" });
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setError('');
    setError2('');
    setUsername(value);
  };
  const handleChange1 = (e) => {
    const value = e.target.value;
    if (username.length <6) {
      setError("*Enter Username");
    } else {
      setError('')
    }
    setError1('');
    setError2('');
    setPassword(value);
  }
  const handleChangepass = (event) => {
    const { name, value } = event.target;
    if (name === "username1") {
      setUsername1(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  const handlebackRegister = () => {
    navigate(`/${type}/register`);
  }

  return (
    <div style={{ backgroundImage: `url(${backpic})` }}>
      <div className="app">
        <div className="login-page">
          <h2 data-testid="Title">Login</h2>
          <div className="con">
            {renderInput("text", "Username", username, handleChange, error, "username")}
           
            {renderInput("password", "Password", password, handleChange1, error1, "password")}
            <div style={errorStyle}>{error1}</div>
          </div>
          <div className="log">
            <button onClick={handleLogin} className="lob" >Login</button>
          </div>
          <div>
            <p>forgot password:</p>
            <button onClick={toggleModal} className="lob">Reset</button>
            {showModal && (
              <div>
                <h2>Enter Username and Email:</h2>
                <div className="con">
                  {renderInput("text", "Username", username1, handleChangepass, "", "username1")}
                  {renderInput("text", "Email", email, handleChangepass, "", "email")}
                  <button type="submit" className="lob" onClick={handlemail}>Submit</button>
                </div>
              </div>
            )}
          </div>
          <div style={errorStyle}>{error2}</div>
          {(localStorage.getItem('type') !== 'access' && localStorage.getItem('type') !== 'companyaccess') && (
            <div className="log">
              <p>Don't have a account:</p><button onClick={handlebackRegister} className="lob">Register</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export default LoginPage;