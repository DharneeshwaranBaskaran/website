import React, {  useState } from "react";
import backpic from "./images/backpic.jpg";
import { useSnackbar } from "notistack";
function LoginPage({ onLogin,backRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    let link="";
    const user = localStorage.getItem('type'); 
    if(user==="buyer"){
      link="http://localhost:8080/api/login";
    }
    else{
      link="http://localhost:8080/api/seller";
    }
    const handleLogin = async () => { 
       if(password==""){
        setError1("*Enter Password");
        setError2('');
       }
        try {
          const response = await fetch(link, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
            credentials: 'include',
          });

          if (response.ok) {
            localStorage.setItem('username', username);
            console.log(username);
            onLogin();
            enqueueSnackbar("Login successfully",{ variant: "success" });
          }
          else{
            console.log(response); 
            console.log(link);
          }
          
          } catch (error) {
            enqueueSnackbar("An error occurred",{ variant:"error" });
          }
      };
      const handleChange = (e) => {
        const value = e.target.value;
         setError('');
         setError2('');
        setUsername(value);
      };
      const handleChange1=(e)=>{
        const value = e.target.value;
        if (username.length==0) {
            setError("*Enter Username");
        } else {
         setError('')
        }
        setError1('');
        setError2('');
        setPassword(value);
      }       
    const handlebackRegister=()=>{
        backRegister();
      }
      const errorStyle = {
        color: 'red',
        fontSize: '10px',
      };
      const name = localStorage.getItem('username');
      
  return ( 
    <div style={{ 
      backgroundImage: `url(${backpic})` 
    }}>
      <div className="app">
        <div className="login-page">
          <h2>Login</h2> 
          <div className="con"> 
          {user}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={handleChange}
          />
          <div style={errorStyle}>{error}</div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handleChange1}
          />
          <div style={errorStyle}>{error1}</div>
          </div> 
        <div className="log">
            <button onClick={handleLogin} className="lob" >Login</button> 
        </div>
        <div style={errorStyle}>{error2}</div>
        <div className="log"> 
            <p>Don't have a account:</p><button onClick={handlebackRegister} className="lob">Register</button>
        </div>
        </div>
      </div>
    </div>
  );
}
export default LoginPage;