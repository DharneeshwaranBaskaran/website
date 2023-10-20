import React, {  useState } from "react";
import backpic from "./images/backpic.jpg";
import { useSnackbar } from "notistack";
function LoginPage({ onLogin,backRegister }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [username1, setUsername1] = useState('');
    const [email,setEmail]=useState('');
    const [error, setError] = useState('');
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');
    const { enqueueSnackbar } = useSnackbar();
    let link="";
    const user = localStorage.getItem('type'); 
    
      const [showModal, setShowModal] = useState(false);
      // const [formData, setFormData] = useState({
      //   name: '',
      //   email: '',
      // });
      const toggleModal = () => {
        setShowModal(!showModal);
      };
      
    const handlemail= async (event) =>{
      if(username1=="" || email==""){
        enqueueSnackbar("Enter the Required data");
      }
      const selectedValue = localStorage.getItem('type');
        try {
          const response = await fetch(`http://localhost:8080/api/pass/${selectedValue}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username:username1, email }),
            credentials: 'include',
          });

          if (response.ok) {
            setShowModal(!showModal);
            enqueueSnackbar("Username and password sent to email",{ variant: "success" });
          }
          else{
            console.log(response); 
            
            enqueueSnackbar("Invalid Credentials");
          }
          
          } catch (error) {
            enqueueSnackbar("An error occurred",{ variant:"error" });
          }
      
    }
    const handleLogin = async (event) => { 
       if(password==""){
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
            // const jwtToken = await response.text(); // Get the JWT token from the response
            // localStorage.setItem('jwtToken', jwtToken);
            // console.log(jwtToken);
            localStorage.setItem('username', username);             
            console.log(username);
            onLogin();
            enqueueSnackbar("Login successfully",{ variant: "success" });
          }
          else{
            console.log(response); 
            console.log(); 
            enqueueSnackbar("Invalid Credentials");
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
      const handleChangepass = (event) => {
        const { name, value } = event.target;
        if (name === "username1") {
          setUsername1(value);
        } else if (name === "email") {
          setEmail(value);
        }
      };
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
              <input
                type="text"
                placeholder="Username"
                name="username1"
                value={username1}
                onChange={handleChangepass}
              />
              <input
                type="text"
                placeholder="Email"
                name="email"
                value={email}
                onChange={handleChangepass}
              />
              <button type="submit" className="lob" onClick={handlemail}>Submit</button>
            
          </div>
         </div>
      )}
    </div>
        <div style={errorStyle}>{error2}</div>
        {(localStorage.getItem('type') !== 'access'&& localStorage.getItem('type') !== 'companyaccess') && (
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