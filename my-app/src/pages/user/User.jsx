import React, {useEffect, useState } from "react";
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
  const emailWithoutQuotes = user.email ? user.email.replace(/^"(.*)"$/, '$1') : ''; 
  const addressWithoutQuotes = user.address ? user.address.replace(/^"(.*)"$/, '$1') : '';

  const handlehome = (key) => {
    navigate(`/${Cookies.get("type")}/${key}`);
  }
  
  return (
    <div className="backgroundcol">
      {jwt ==Cookies.get('token')&& ( 
        <>
      <div className="logout-button"   >
        <button onClick={()=>handlehome("homepage")} className='purple'>Home </button>
      </div>
      <div className="app" >
        <div className="logins" >
          <p >User:{user.username}</p>
          <p > Email:{emailWithoutQuotes}<button onClick={()=>handlehome("mail")} className="usebut">edit</button></p>
          <p >Address:{addressWithoutQuotes}<button onClick={()=>handlehome("address")} className="usebut">edit</button></p>
          <p >Balance:${user.balance}<button onClick={()=>handlehome("add")} className="usebut">edit</button></p>
        </div></div>
        </>)}
    </div>
  );
}


export default withLogoutHandler(User);