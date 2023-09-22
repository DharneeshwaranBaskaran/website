import React, { useState,useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
function Payment({full}) {

let Username=localStorage.getItem('username');
const [Balance,setBalance]=useState(0);
const { enqueueSnackbar } = useSnackbar();
const handlebacktohomefrompay=()=>{
  enqueueSnackbar("Redirecting to homepage",{variant:"default"});
  full();
}

useEffect(() => {
axios.get(`http://localhost:8080/api/balance/${Username}`)
      .then((response) => {
        const data = response.data;
        setBalance(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [Username]);
let balance=localStorage.getItem('Balance');
return(
  <div style={{ 
    backgroundColor: "lightgrey", minHeight: "100vh"
    }}>
  <div className="logout-button">
          <button onClick={handlebacktohomefrompay} style={{ 
                    backgroundColor: "darkgrey", }}>Back To Home</button>
  </div>
  <div >
  <div >
      <h2 className='balance-header'>Thank you for shopping with us</h2>
      <h2 className='balance-header'>Your Balance:</h2>
      <p className="balance-amount">${Balance}</p>
    </div>  
    </div>
  </div>
)
}
export default Payment;
