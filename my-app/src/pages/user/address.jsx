import React, {useState } from "react";
import { enqueueSnackbar, useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie"; 
import "./user.css"
const Address = () => {
  const Username = Cookies.get("username");
  const navigate = useNavigate();
  const [address, setaddress] = useState('');
  const { jwt, setjwt } = useLoginContext();
  const handleChange4 = (e) => {
    const value = e.target.value;
    setaddress(value);
  };

  const updateaddress = async () => {
    if (address == "") {
      enqueueSnackbar("enter address");
    }
    else {
      try {
        const url = `http://localhost:8080/updateAddress/${Username}`;
        const options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(address),
        };
        const response = await fetch(url, options);
        if (response.ok) {
          const data = await response.json();
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
      {jwt ==Cookies.get('token') && ( 
      <>
      <div className="logout-button"   >
        <button onClick={handlehome} className='purple'>Home</button>
      </div>
      <div className="app"  >
        <div className="logins" >
          <h3 className="cont" data-testid="PRODUCTS:">Alter Delivery Address</h3>
          <input
            className="ins"
            type="text"
            placeholder="Personal Address"
            value={address}
            onChange={handleChange4}
          /><button  className="lob buttonad" onClick={updateaddress}>Confirm</button>
        </div>
      </div> 
      </>
    )}
    </div>
  );
}
export default withLogoutHandler(Address);