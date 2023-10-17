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
    // const handleActionChange = async (event) => {
    //   // setSelectedAction(event.target.value);
      
    //     let weekend=event.target.value;
    //     const response = await fetch('http://localhost:8080/api/updateweekend', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ weekend,username:Username}),
    //     credentials: 'include',
    //   }); 
      
    //   if (response.ok ) {
    //     enqueueSnackbar("Data Updated Sucessfully",{ variant:"success" });  
    //     full();
        
    //       }
    //   else if (response.status === 409) {
    //         const errorData = await response.json();
    //         enqueueSnackbar(errorData.error,{variant:"error"});
    //       }    
    //     enqueueSnackbar(weekend);
     
    // };
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
    {/* <div >
      <h2 className='balance-header'>Can We deliver on Weekends</h2>
    <select 
            // value={selectedAction}
            onChange={handleActionChange}
            style={{ backgroundColor: "#6666ff", color: "white", border: "none",
             padding: "5px",borderRadius:"5px",marginLeft:"600px"}}
          >
            <option>Weekend</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            </select>
    </div> */}
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
