import React, { useState } from "react";
import { GoogleLoginButton } from "react-social-login-buttons";
import { LoginSocialGoogle } from "reactjs-social-login";
import backpic from "./images/backpic.jpg";
import './App.css'; 
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';

import Papa from 'papaparse';
function RegisterPage() { 
    const type=localStorage.getItem("type");
    const navigate = useNavigate();
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
    const [website,setWebsite]=useState('');
    const [comaddress,setcomAddress]=useState('');
    const [company,setCompany]=useState('');
    const [num,setnum]=useState(''); 
    const [name,setname]=useState('');
    const [email,setEmail]=useState('');
    const [mail,setmail]=useState('');
    const [error, setError] = useState('');
    const [error1, setError1] = useState('');
    const [error2, setError2] = useState('');
    const [error3, setError3] = useState('');
    const [error4, setError4] = useState('');
    const [error5, setError5] = useState('');
    const [error6, setError6] = useState('');
    const [error7, setError7] = useState('');
    const [isname,setIsname]=useState(false)
    const [isnum,setisnum]=useState(false);
    const [iscompany,setiscompany]=useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isPassword,setIspassword]=useState(false)
    const [isconPassword,setIsconpassword]=useState(false)
    const [isAddress,setIsAddress]=useState(false);
    const [csvData, setCsvData] = useState(null); // Store the CSV data
    const [phoneNumber, setPhoneNumber] = useState('');

    const handlePhoneNumberChange = (e) => {
      const inputPhoneNumber = e.target.value;
      // Use a regular expression to check if only numbers are entered
      const onlyNumbers = /^[0-9]*$/;

      if (onlyNumbers.test(inputPhoneNumber)) {
        setPhoneNumber(inputPhoneNumber);
      } 
    }; 
    const handlephone= async (event) =>{
      if(phoneNumber=="" || mail==""){
        enqueueSnackbar("Enter the Required data");
      }
      
        try {
          const response = await fetch("http://localhost:8080/api/phone", {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username:phoneNumber,email:mail}),
            credentials: 'include',
          });

          if (response.ok) {
            setShowModal(!showModal);
            navigate(`/${type}/login`);
            enqueueSnackbar("Username and password sent to mail",{ variant: "success" });
          }
          else{
            console.log(response); 
            const errorData = await response.json();
                    enqueueSnackbar(errorData.error, { variant: "error" });
          }
          
          } catch (error) {
            enqueueSnackbar("An error occurred",{ variant:"error" });
          }
      
    }
    const [showModal, setShowModal] = useState(false);
    
      const toggleModal = () => {
        setShowModal(!showModal);
      };
        const handleRegister = async (event) => {
            if (!username || !password || !conpassword || !email ) {
                enqueueSnackbar("Please fill in all required fields", { variant: "error" });
                return;
            }
        
            if (password !== conpassword) {
                setError2('Passwords do not match');
                return;
            }
            const selectedValue = localStorage.getItem("type");
            if(selectedValue=="buyer"){
                const response = await fetch(`http://localhost:8080/api/register/${selectedValue}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ username, password,conpassword,email,address}),
                  credentials: 'include',
                });
                if (response.ok) {
                    enqueueSnackbar("Registration Successful", { variant: "success" });
                    
                    console.log(response); 
                    console.log(username,password);
                    navigate(`/${type}/login`);
                } else if (response.status === 409) {
                    const errorData = await response.json();
                    enqueueSnackbar(errorData.error, { variant: "error" });
                } else {
                    enqueueSnackbar("Registration Failed", { variant: "error" });
                }        
                console.log(selectedValue)
            }
            else if(selectedValue=="seller"){ 
                if (!username || !password || !conpassword || !email || !name || !num || !comaddress || !company) {
                    enqueueSnackbar("Please fill in all required fields", { variant: "error" });
                    return;
                }
                const response = await fetch(`http://localhost:8080/api/register/${selectedValue}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({name,num,company,username, password,conpassword,email,address,comaddress}),
                credentials: 'include',
              });
              if (response.ok) {
                enqueueSnackbar("Registration Successful", { variant: "success" });
                
                console.log(response); 
                console.log(username,password);
                navigate(`/${type}/login`);
            } else if (response.status === 409) {
                const errorData = await response.json();
                enqueueSnackbar(errorData.error, { variant: "error" });
            } else {
                enqueueSnackbar("Registration Failed", { variant: "error" });
            }        
            console.log(selectedValue)
              }
            else{
                if (!username || !password || !conpassword || !email || !num || !comaddress || !company ||!website) {
                    enqueueSnackbar("Please fill in all required fields", { variant: "error" });
                    return;
                }
                const response = await fetch(`http://localhost:8080/api/register/${selectedValue}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({num,company,username, password,conpassword,email,comaddress,website}),
                credentials: 'include',
              });
              if (response.ok) {
                enqueueSnackbar("Registration Successful", { variant: "success" });
                
                console.log(response); 
                console.log(username,password);
                navigate(`/${type}/login`);
            } else if (response.status === 409) {
                const errorData = await response.json();
                enqueueSnackbar(errorData.error, { variant: "error" });
            } else {
                enqueueSnackbar("Registration Failed", { variant: "error" });
            }        
            console.log(selectedValue)
              }
              
              
        };
        
        // const handlegoogle=()=>{
        //     enqueueSnackbar("Login successfully",{ variant: "success" });
        // }
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
                     setIsClicked(false);
                }
                else{
                    setIsClicked(true);
                } 
                if(company.length<6){
                    setError6('*Company Name should contain 6 characters')
                }
          };
          
          const handleChange1 = (e) => {
            const value = e.target.value;
            setPassword(value);
            setValidPassword(value.length >= 6);
            if (username.length <6) {
                setError("*Username should contain a minimum of 6 characters");    
            }
            if(value.length>=6){
                setIspassword(false);
            }
            else{
                setIspassword(true);
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
            if(value===password){    
                setIsconpassword(false);
            }
            else{
                setIsconpassword(true);
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
            if(value.length>=6){    
                setIsAddress(false);
            }
            else{
                setIsAddress(true);
            }
             setError3('')
          }; 
          const handleChange0=(e)=>{
            const value = e.target.value;
            setmail(value);
          }
          
          const handleChange4 = (e) => {
            const value = e.target.value;
            setAddress(value);
            setValidAddress(value.length >= 6);
            if (email.length<6) {
                setError3('*Email should contain a minimum of 6 characters');
            } 
                setAddress(value);    
           }; 
           const handleChange5 = (e) => {
            const value = e.target.value;
            setname(value);
            if(value.length>=6){
                setIsname(false);  
            }
            else{
                setIsname(true);
            }
            setError4('');
           };
           const handleChange6 = (e) => {
            const value = e.target.value;
            setnum(value);
            if (name.length <6) {
                setError4("*Name should contain a minimum of 6 characters");    
            }
            else{
                setError4('');
            }
            if(value.length>=10){
                setisnum(false);  
            }
            else{
                setisnum(true);
            }
            setError5('');
           };
           const handleChange7 = (e) => {
            const value = e.target.value;
            setCompany(value); 
            if (num.length <10) {
                setError5("*Number should contain a minimum of 10 characters");    
            }
            else{
                setError5('');
            }
            if(value.length>=6){
                setiscompany(false);  
            }
            else{
                setiscompany(true);
            }
            setError6('');
           
           };
           const handleChange8 = (e) => {
            const value = e.target.value;
            setcomAddress(value);
           };
           const handleChange9 = (e) => {
            const value = e.target.value;
            setWebsite(value);
           };
           const redirectinglogin =()=>{
            navigate(`/${type}/login`);
        }
        
        const inputStyle = {
            outline:isClicked ? '1px solid red' : '1px solid black',
            
          };
          const inputStyle1={
            outline:isPassword? '1px solid red' : '1px solid black',
          }
          const inputStyle2 = {
            outline:isconPassword? '1px solid red' : '1px solid black',   
          };
          const inputStyle3 = {
            outline:isAddress? '1px solid red' : '1px solid black',    
          };
          const inputStyle4 = {
            outline:isname? '1px solid red' : '1px solid black',    
          };
          const inputStyle5 = {
            outline:isnum? '1px solid red' : '1px solid black',    
          };
          const inputStyle6 = {
            outline:iscompany? '1px solid red' : '1px solid black',    
          };
          
          const handleFileUpload = (e) => {
            const file = e.target.files[0];
          
            if (file) {
              const formData = new FormData();
              formData.append("file", file);
          
              // Send the formData as a multipart request
              fetch("http://localhost:8080/api/upload-csv/company", {
                method: 'POST',
                body: formData,
                credentials: 'include',
              })
              .then(async response => {
                if (response.ok) {
                  enqueueSnackbar("CSV data uploaded successfully", { variant: "success" });
                } else {
                  enqueueSnackbar("Failed to upload CSV data", { variant: "error" });
                  const errorData = await response.text();
                  enqueueSnackbar(errorData, { variant: "error" });
                  console.log(errorData, { variant: "error" });
                }
              })
              .catch(error => {
                console.error(error);
              });
            } else {
              enqueueSnackbar("Please select a CSV file first", { variant: "error" });
            }
          };
          
        // const handlephone =()=>{
        //   
        // } 
    return ( 
        <div style={{ 
          backgroundImage: `url(${backpic})` ,minHeight: "130vh"
        }}> 
        <div style={{padding:"35px"}}></div>
            <div className="app" >
                <div className="login-page" >
                <h2>Register</h2> 
                <div className="con">
                {localStorage.getItem('type') !== 'buyer' && (
                    <>
                    {localStorage.getItem('type') !== 'company' && ( 
                        <>
                <input
                type="text"
                placeholder="Name"
                value={name}  
                style={inputStyle4}
                onChange={handleChange5}               
                />
                <div style={errorStyle}>{error4}</div> 
                </>
                    )}
                <input
                type="text"
                placeholder="Contact Number"
                value={num}    
                style={inputStyle5}
                onChange={handleChange6}               
                />
                <div style={errorStyle}>{error5}</div>
                <input
                type="text"
                placeholder="Company"
                value={company}  
                style={inputStyle6}
                onChange={handleChange7}             
                />
                <div style={errorStyle}>{error6}</div>
                </>
                )}
                
                <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleChange}
                style={inputStyle}
                />
                <div style={errorStyle}>{error}</div>

                <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={handleChange1}
                style={inputStyle1}
                />
                <div style={errorStyle}>{error1}</div>

                <input
                type="password"
                placeholder="Confirm Password"
                value={conpassword}
                onChange={handleChange2}
                style={inputStyle2}
                />
                <div style={errorStyle}>{error2}</div>
                {localStorage.getItem('type') !== 'buyer' && (
                <input
                type="text"
                placeholder="Company Email"
                value={email}
                onChange={handleChange3}
                style={inputStyle3}
                />
                )}
                {localStorage.getItem('type') === 'buyer' && (
                <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleChange3}
                style={inputStyle3}
                />
                )}
                {localStorage.getItem('type') !== 'buyer' && (
                <input
                type="text"
                placeholder="Company Address"
                value={comaddress}    
                onChange={handleChange8}           
                />
                )}
                 {localStorage.getItem('type') !== 'company' && ( 
                    <>
                <div style={errorStyle}>{error3}</div>
                <input
                type="text"
                placeholder="Personal Address"
                value={address}
                onChange={handleChange4}              
                />
                </>
                 )} 
                 {localStorage.getItem('type') === 'company' && ( 
                    <>
               
                <input
                type="text"
                placeholder="Website"
                value={website}
                onChange={handleChange9}              
                />
                </>
                 )}
                </div>
                
                {localStorage.getItem('type') === 'company' && ( 
                    <>
                    <div  >
                 <input type="file" accept=".csv" onChange={handleFileUpload}  style={{ color: '#6499E9' }}/>
                 <br/>
                 <br/>
                 </div>
                 </>
                )}
                
               <button onClick={handleRegister} className="lob">
                Register</button> 
                
               
                    <div className="log"> 
                    <p>already have a account:</p>
                    <button onClick={redirectinglogin} className="lob"> Login </button>
                    {localStorage.getItem('type') === 'buyer' && (
                        <>
                        <div>
                    <p>Sign Up using Phone Number</p> 
                    <button onClick={toggleModal} className="lob">Register Phone Number</button> 
                    {showModal && (
        
                  <div>
                      <h2>Enter Moblile Number:</h2> 
                        <div className="con"> 
                        
                              <input
                                type="text"
                                
                                placeholder="Number"
                                value={phoneNumber}
                                onChange={handlePhoneNumberChange}
                              />
                              <input
                              type="text"
                              placeholder="Email"
                              value={mail}
                              onChange={handleChange0}
                              />
                        <button type="submit" className="lob" onClick={handlephone}>Submit</button>
                      
                    </div>
                  </div>
                 )}
                    
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
                                navigate(`/${type}/homepage`);
                                enqueueSnackbar("Login Successful",{ variant: "success" });
                            })
                            .catch(error => {
                                console.error(error);
                            });
                        }}
                        onReject={(err) => {
                        console.log(err);
                        }}
                    >
                    <GoogleLoginButton />
                    </LoginSocialGoogle >
                    </div>
                    </>
                    )}
                    </div>
                
                </div>
                
            </div>
        </div>
  );
}
export default RegisterPage;