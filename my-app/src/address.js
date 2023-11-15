import React, {useRef,useEffect, useState } from "react";
import axios from "axios";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import './App.css';  

 const Address = () => { 
    const Username=localStorage.getItem("username");
    const navigate = useNavigate();  
    const [address,setaddress]=useState('');
    const handleChange4 = (e) => {
        const value = e.target.value;
        setaddress(value);
       }; 
    
      const updateaddress = async () => { 
        if(address==""){
            enqueueSnackbar("enter address");
        }
        else{
        try {
          const response = await axios.post(
            `http://localhost:8080/api/updateAddress/${Username}`,  // Keep this part as is
            address,
            {
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          if (response.status === 200) {
            console.log(response.data); 
            enqueueSnackbar("Updated Successfully");
          } else {
            console.log('Error updating user address');
          }
        } catch (error) {
          console.log('Error updating user address catch');
        } 
        navigate(`/${localStorage.getItem("type")}/homepage`); 
      }
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
      const handlehome=()=>{
        navigate(`/${localStorage.getItem("type")}/homepage`); 
      }
    return ( 
        <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
        <div className="logout-button"   >  
        <button onClick={handlehome} style={{backgroundColor: "#713ABE", color: "white"}}>Home</button>
        </div>
        <div className="app"  > 

        <div className="logins" >
        <h3 style={{textAlign:"center"}}>Alter Delivery Address</h3>
        <input
        style={{width:"200px",marginLeft:"45px"}}
        type="text"
        placeholder="Personal Address"
        value={address}
        onChange={handleChange4}              
        /><button style={{marginLeft:"110px"}} className="lob" onClick={updateaddress}>Confirm</button>
        </div>
      </div>
      </div>
        );
    }
export default Address;