import React, { useRef, useEffect, useState } from "react";
import axios from "axios";
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie"; 
import "./user.css"
const User = () => {
  const [user, setUser] = useState({});
  const { jwt, setjwt } = useLoginContext();
  const navigate = useNavigate();
  const handlehome = (key) => {
    navigate(`/${Cookies.get("type")}/${key}`);
  }
  
  useEffect(() => {
    const username = Cookies.get("username");
    axios.get(`http://localhost:8080/user/${username}`)
      .then(response => {
        setUser(response.data[0]);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  }, []);
  
  return (
    <div className="backgroundcol">
      {jwt ==Cookies.get('token')&& ( 
        <>
      <div className="logout-button"   >
        <button onClick={()=>handlehome("homepage")} style={{ backgroundColor: "#713ABE", color: "white" }}>Home </button>
      </div>
      <div className="app" >
        <div className="logins" >
          <p >User:{user.username}</p>
          <p > Email:{user.email}<button onClick={()=>handlehome("mail")} className="usebut">edit</button></p>
          <p >Address:{user.address}<button onClick={()=>handlehome("address")} className="usebut">edit</button></p>
          <p >Balance:${user.balance}<button onClick={()=>handlehome("add")} className="usebut">edit</button></p>
        </div></div>
        </>)}
    </div>
  );
}


export default withLogoutHandler(User);