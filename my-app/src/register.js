import React, { useState } from "react";
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import backpic from "./images/backpic.jpg";
import { useSnackbar } from "notistack";
function RegisterPage({ onRegister ,redirectlogin,google}) {
    const [validUsername, setValidUsername] = useState(false);
    const [validPassword, setValidPassword] = useState(false);
    const [validConPassword, setValidConPassword] = useState(false);
    const [validEmail, setValidEmail] = useState(false);
    const [validAddress, setValidAddress] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [conpassword, setConPassword] = useState(''); 
    const [address,setAddress]=useState('');
    const [email,setEmail]=useState('');
    const [error, setError] = useState('');
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');
    const [showLoginOption, setShowLoginOption] = useState(true); 
     
        const handleRegister = async () => {
            if (!username || !password || !conpassword || !email || !address) {
                enqueueSnackbar("Please fill in all required fields", { variant: "error" });
                return;
            }
        
            if (password !== conpassword) {
                setError2('Passwords do not match');
                return;
            }
        
            
                const response = await fetch('http://localhost:8080/api/register', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, password,conpassword,email,address}),
                  credentials: 'include',
                });
                if (response.ok) {
                    enqueueSnackbar("Registration Successful", { variant: "success" });
                    localStorage.setItem('type', "buyer"); 
                    console.log(response); 
                    console.log(username,password);
                    onRegister();
                } else if (response.status === 409) {
                    const errorData = await response.json();
                    enqueueSnackbar(errorData.error, { variant: "error" });
                } else {
                    enqueueSnackbar("Registration Failed", { variant: "error" });
                }
                
              
        };
        
        const redirectinglogin =(num)=>{
            redirectlogin();
            if(num==1){
                localStorage.setItem('type',"buyer");
            }
            else{
                localStorage.setItem('type',"seller");
            }
        }
        const handlegoogle=()=>{
            enqueueSnackbar("Login successfully",{ variant: "success" });
        }
        const errorStyle = {
            color: 'red',
            fontSize: '10px',
          };
          const handleChange = (e) => {
            const value = e.target.value;
            setUsername(value);
            setValidUsername(value.length >= 6);
            if (value.length >=6) {
                     setError('')
                    }
          };
          
          const handleChange1 = (e) => {
            const value = e.target.value;
            setPassword(value);
            setValidPassword(value.length >= 6);
            if (username.length <6) {
                setError("*Username should contain a minimum of 6 characters");    
            }
            setError1('');
          };
          
          const handleChange2 = (e) => {
            const value = e.target.value;
            setConPassword(value);
            setValidConPassword(value === password);
            if (password.length<6) {
                setError1("*Passwords should contain a minimum of 6 characters");             
            } 
            setError2('');
          };
          
          const handleChange3 = (e) => {
            const value = e.target.value;
            setEmail(value);
            setValidEmail(value.length >= 6);
            if (conpassword!=password) {
                setError2('*Passwords do not match')
            } 
             setError3('')
          };
          
          const handleChange4 = (e) => {
            const value = e.target.value;
            setAddress(value);
            setValidAddress(value.length >= 6);
            if (email.length<6) {
                setError3('*Email should contain a minimum of 6 characters');
            } 
                setAddress(value);    
           };
           const handleBuyerSellerSelection = (event) => {
            const selectedValue = event.target.value;
            if (selectedValue === "buyer") {
              redirectinglogin(1);
            } else if (selectedValue === "seller") {
              redirectinglogin(2);
            }
            
          };
          
    return ( 
        <div style={{ 
          backgroundImage: `url(${backpic})` 
        }}>
            <div className="app">
                <div className="login-page">
                <h2>Register</h2> 
                <div className="con">
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleChange}
                className={validUsername ? "" : "error-input"}
                />
                <div style={errorStyle}>{error}</div>

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handleChange1}
                className={validPassword ? "" : "error-input"}
                />
                <div style={errorStyle}>{error1}</div>

                <input
                type="password"
                placeholder="Confirm Password"
                value={conpassword}
                onChange={handleChange2}
                className={validConPassword ? "" : "error-input"}
                />
                <div style={errorStyle}>{error2}</div>

                <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleChange3}
                className={validEmail ? "" : "error-input"}
                />
                <div style={errorStyle}>{error3}</div>

                <input
                type="text"
                placeholder="Address"
                value={address}
                onChange={handleChange4}
              
                />
            
                </div>
               <button onClick={handleRegister} className="lob">
                Register</button> 
                
                    <div className="log"> 
                    <p>already have a account:</p>
                    <select onChange={handleBuyerSellerSelection} className="custom-select lob">
                        <option>Login</option>
                        <option value="buyer">As Buyer</option>
                        <option value="seller">As Seller</option>
                    </select>
                    
                    <p>Sign Up with Google</p>
                    <LoginSocialGoogle
                        client_id={"812988011805-bjggbnbauqg4a4g7f9e8r2qd0rh290u6.apps.googleusercontent.com"}
                        scope="openid profile email"
                        discoveryDocs="claims_supported"
                        access_type="offline"
                        
                        onResolve={({ provider, data }) => {
                            console.log(provider,data);
                            localStorage.setItem('username',data.given_name);
                           
                            const firstName = data.given_name;
                            const userEmail = data.email; 
                         
                            const userData = {
                                username: firstName, 
                                email: userEmail,
                             
                            };
                            
                           
                            fetch('http://localhost:8080/api/register/google', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(userData),
                            })
                            .then(response => response.json())
                            .then(data => {
                                console.log(data.username); 
                              
                                localStorage.setItem('type',"buyer");
                                google(); 
                            })
                            .catch(error => {
                                console.error(error);
                            });
                        }}
                        onReject={(err) => {
                        console.log(err);
                        }}
                    >
                    <GoogleLoginButton onClick={handlegoogle}/>
                    </LoginSocialGoogle >
                    </div>
                </div>
                
            </div>
        </div>
  );
}
export default RegisterPage;