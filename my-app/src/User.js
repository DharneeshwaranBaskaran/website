import React, {useRef,useEffect, useState } from "react";
import CustomCard from "./customcard";
import axios from "axios";

import { useNavigate } from 'react-router-dom';
const User = () => {  
  const jwtToken = sessionStorage.getItem('token');

  // Check if the JWT token is present
  useEffect(() => {
    if (!jwtToken) {
      // Redirect to the login page or show an error message 
      console.log(jwtToken);
      navigate("YOU CAN'T ACCESS THIS PAGE"); // Use the appropriate route for your login page
    }
  }, [jwtToken]);
    const [user, setUser] = useState({});
    const username=localStorage.getItem("username")
    const navigate = useNavigate();
    const handlehome=()=>{
        navigate(`/${localStorage.getItem("type")}/homepage`);
    }
    const add=()=>{
        navigate(`/${localStorage.getItem("type")}/add`);
    }
    const addr=()=>{
        navigate(`/${localStorage.getItem("type")}/address`);
    }
    const handemail=()=>{
        navigate(`/${localStorage.getItem("type")}/mail`);
    }
    useEffect(() => {
        const username = localStorage.getItem("username");
        
    
        axios.get(`http://localhost:8080/api/user/${username}`)
          .then(response => {
            setUser(response.data[0]);  
            console.log(user);
          })
          .catch(error => {
            console.error("Error fetching user data:", error);
          });
      }, []); 
  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
    <div className="logout-button"   >  
    <button onClick={handlehome} style={{backgroundColor: "#713ABE", color: "white"}}>Home</button>
    </div>
    <div className="app" >
                <div className="logins" >
    
      <p style={{color: "#451952"}}>User:{user.username}</p>
      <p style={{color: "#451952"}}> Email:{user.email}<button onClick={handemail}style={{backgroundColor: "#713ABE", color: "white",borderRadius:"5px",marginLeft:"20px"}}>edit</button></p> 
      <p style={{color: "#451952"}}>Address:{user.address}<button onClick={addr} style={{backgroundColor: "#713ABE", color: "white",borderRadius:"5px",marginLeft:"20px"}}>edit</button></p>
      <p style={{color: "#451952"}}>Balance:${user.balance}<button onClick={add} style={{backgroundColor: "#713ABE", color: "white",borderRadius:"5px",marginLeft:"20px"}}>edit</button></p>
      </div></div>
      </div>
  );
}


export default User;