import React, { useState } from "react";
import { enqueueSnackbar} from "notistack";
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie";
const Email = () => {
  const Username = Cookies.get("username");
  const navigate = useNavigate();
  const { jwt, setjwt } = useLoginContext();
  const [email, setemail] = useState('');
  const handleChange4 = (e) => {
    const value = e.target.value;
    setemail(value);
  };

  const updateemail = async () => {
    if (email == "" || !(email.includes("@"))) {
      enqueueSnackbar("enter a valid email");
    }
    else {
      try {
        const response = await fetch(`http://localhost:8080/updateEmail/${Username}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(email),
        });
      
        if (response.ok) {
          enqueueSnackbar("Updated Successfully");
        } 
      } catch (error) {
        
      }
      
      navigate(`/${Cookies.get("type")}/homepage`);
    }
  }
  const handlehome = () => {
    navigate(`/${Cookies.get("type")}/homepage`);
  }

  return (
    
    <div className="backgroundcol">
      {jwt ==Cookies.get('token')&& ( 
      <>
      <div className="logout-button"   >
        <button onClick={handlehome} >Home </button>
      </div>
      <div className="app"  >
        <div className="logins" >
          <h3 className="cont"data-testid="PRODUCTS:">Alter Delivery Email</h3>
          <input
            className="ins"
            type="text"
            placeholder="Enter Email"
            value={email}
            onChange={handleChange4}
          /><button className="lob buttonad" onClick={updateemail}>Confirm</button>
        </div>
      </div> 
      </> 
    )}
    </div>
  );
}
export default withLogoutHandler(Email);