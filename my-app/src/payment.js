import React, { useState,useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
function Payment() {
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
  const jwtToken = sessionStorage.getItem('token');

  // Check if the JWT token is present
  useEffect(() => {
    if (!jwtToken) {
      // Redirect to the login page or show an error message 
      console.log(jwtToken);
      navigate("YOU CAN'T ACCESS THIS PAGE"); // Use the appropriate route for your login page
    }
  }, [jwtToken]);
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
    {localStorage.getItem('type') === 'company' && ( 
                    <>
                    <div  >
                 <input type="file" accept=".csv" onChange={handleFileUpload}  style={{ color: '#6499E9' }}/>
                 <br/>
                 <br/>
                 </div>
                 </>
                )}
    </div> 
    
    </div>
  )}
  </div>
)
}
export default Payment;
