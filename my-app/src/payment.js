import React, { useState,useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
function Payment({full}) {

let Username=localStorage.getItem('username');
const [Balance,setBalance]=useState(0);
const { enqueueSnackbar } = useSnackbar();
const [cost,setcost]=useState();
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
        // console.error('Error fetching data:', error);
      });
  }, [Username]);
  const drafttodatabase = async () => {
    const response = await fetch('http://localhost:8080/api/editdata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id:localStorage.getItem('edit'),cost}),
        credentials: 'include',
      }); 
      
      if (response.ok ) {
        enqueueSnackbar("Data Updated Sucessfully",{ variant:"success" });  
        full();
        
          }
      else if (response.status === 409) {
            const errorData = await response.json();
            enqueueSnackbar(errorData.error,{variant:"error"});
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
      <h2 className='balance-header'>Thank you for shopping with us</h2>
      <h2 className='balance-header'>Your Balance:</h2>
      <p className="balance-amount">${Balance}</p> 
    </div> 
  )}
  {localStorage.getItem('type') === 'seller' && ( 
    <div className="app">
    <div className="login-page" style={{backgroundColor:"white"}}> 
    <h2>Edit Product</h2> 
    <div className="con">
    <input
        type="Long"
        placeholder="cost"
        value={cost}
        onChange={(e) => setcost(e.target.value)}
       
    />
    
    </div>
   <button className="lob" onClick={drafttodatabase}>
    Launch</button> 
    </div>
    </div>
  )}
  </div>
)
}
export default Payment;
