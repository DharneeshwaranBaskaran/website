import React, { useState,useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
function Payment({full}) {

let Username=localStorage.getItem('username');
const [Balance,setBalance]=useState(0);
const { enqueueSnackbar } = useSnackbar();
const [id,setid]=useState();
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
    axios.post(`http://localhost:8080/api/transferdata/${id}`)
          .then((response) => {
              console.log(response.data);
              console.log(response.status);
              enqueueSnackbar(response.data);
              full(); 
              
          })
          .catch((error) => {
            if (error.response){ 
              enqueueSnackbar(error.response.data.error); 
            }
           else 
              enqueueSnackbar(error.message); // Display the error message
          });
                        
  }
  

return(
  <div style={{ 
    backgroundColor: "lightgrey", minHeight: "100vh"
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
    {/* <div className="login-page" style={{backgroundColor:"white"}}> 
    <h2>Launch Product</h2> 
    <div className="con">
    <input
        type="Long"
        placeholder="refnum"
        value={id}
        onChange={(e) => setid(e.target.value)}
       
    />
    
    </div>
   <button className="lob" onClick={drafttodatabase}>
    Launch</button> 
    </div> */}
    </div>
  )}
  </div>
)
}
export default Payment;
