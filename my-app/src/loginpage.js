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
    
    const handleLogin = async (event) => { 
       if(password==""){
        setError1("*Enter Password");
        setError2('');
       }
       const selectedValue = event.target.value;
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
            localStorage.setItem('username', username); 
            localStorage.setItem('type',selectedValue);
            console.log(username);
            onLogin();
            enqueueSnackbar("Login successfully",{ variant: "success" });
          }
          else{
            console.log(response); 
            console.log(link); 
            enqueueSnackbar(response);
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
        {/* <div className="log">
            <button onClick={handleLogin} className="lob" >Login</button> 
        </div> */}
        <select
                onChange={handleLogin}
                className="custom-select lob"
                >
                <option>Login</option>
                <option value="buyer">As Buyer</option>
                <option value="seller">As Seller</option>
                </select>
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