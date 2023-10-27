import React, { useState,useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
function Payment({full}) {
  const navigate = useNavigate();
let Username=localStorage.getItem('username');
const [Balance,setBalance]=useState(0);
const { enqueueSnackbar } = useSnackbar();
const [cost,setcost]=useState();
const [email,setEmail]=useState('');
const [username, setUsername] = useState('');
const [type,setType]=useState('');
const typeo=localStorage.getItem('type');
const handlebacktohomefrompay=()=>{
  enqueueSnackbar("Redirecting to homepage",{variant:"default"});
  navigate(`/${typeo}/homepage`);
}

useEffect(() => {
axios.get(`http://localhost:8080/api/balance/${Username}`)
      .then((response) => {
        const data = response.data;
        setBalance(data);
      })
      .catch((error) => {
        // console.error('Error fetching data:', error);
      });
  }, [Username]);
  
    const selectedValue=localStorage.getItem("type");
 
  const handleRegister = async (event) => { 
        if(selectedValue=="seller"){
        const response = await fetch(`http://localhost:8080/api/register/access`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username,email,type,provider:Username}),
          credentials: 'include',
        });
        if (response.ok) {
            enqueueSnackbar("Access Given Successfully", { variant: "success" });
            navigate(`/${typeo}/homepage`);
            console.log(response); 
            
            
        } else if (response.status === 409) {
            const errorData = await response.json();
            enqueueSnackbar(errorData.error, { variant: "error" });
        } else {
            enqueueSnackbar("Registration Failed", { variant: "error" });
        }        
      }
      else{
        const response = await fetch(`http://localhost:8080/api/register/companyaccess`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username,email,type,provider:Username}),
          credentials: 'include',
        });
        if (response.ok) {
            enqueueSnackbar("Access Given Successfully", { variant: "success" });
            navigate(`/${typeo}/homepage`);
            console.log(response); 
            
            
        } else if (response.status === 409) {
            const errorData = await response.json();
            enqueueSnackbar(errorData.error, { variant: "error" });
        } else {
            enqueueSnackbar("Registration Failed", { variant: "error" });
        }        
      }
  }
  const handleChange3 = (e) => {
    const value = e.target.value;
    setEmail(value); 
  } 
  const handleChange=(e)=>{
    const value = e.target.value;
    setUsername(value);
  }
  const handleChange2 = (e) => {
    const value = e.target.value;
    setType(value); 
  } 
    
return(
  <div style={{ 
    backgroundColor: "#e5e5ff", minHeight: "100vh"
    }}>
  <div className="logout-button">
          <button onClick={handlebacktohomefrompay} >Back To Home</button>
  </div>
  {localStorage.getItem('type') === 'buyer' && (
  <div >
    <div>
      <h2 className='balance-header'>Thank you for shopping with us</h2>
      <h2 className='balance-header'>Your Balance:</h2>
      <p className="balance-amount">${Balance}</p> 
    </div>  
   
      </div>
  )}
  {(localStorage.getItem('type') === 'seller'||localStorage.getItem('type') === 'company') && ( 
    <div className="app">
    <div className="login-page" style={{backgroundColor:"white"}}> 
    <h2>Give Access</h2> {Username}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleChange}
                
                />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleChange3}
                /> 
                <input
                type="text"
                placeholder="Type"
                value={type}
                onChange={handleChange2}
                />
    
   
   <button className="lob" onClick={handleRegister}>
    Give Access</button> 
    </div>
    </div>
  )}
  </div>
)
}
export default Payment;
