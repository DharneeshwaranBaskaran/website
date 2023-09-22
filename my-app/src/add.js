import React, { useState,useEffect } from "react";
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
function Add({backpay,backcart}) {  
    const [inputValue, setInputValue] = useState("");
    const [Balance,setBalance]=useState(0);
    let Username=localStorage.getItem('username');
    const backtohomebal=()=>{
        backpay();
        enqueueSnackbar("Back to Home",{variant:"default"});
    }
    const backtocart=()=>{
      backcart(); 
      enqueueSnackbar("Back to Cart",{variant:"default"});
    }
    
    
        const addBalance=()=>{ 
          const amountToAdd = parseFloat(inputValue);

          if (isNaN(amountToAdd) || amountToAdd <= 0|| amountToAdd.length<1) {
            enqueueSnackbar("Please enter a valid positive number", { variant: "error" });
          }
          else {
          const newBalance = Balance + amountToAdd;
          axios.post(`http://localhost:8080/api/updateUserBalance/${Username}`, newBalance, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
        backcart();  
        enqueueSnackbar(`Balance Updated to ${newBalance}`,{variant:"success"});
        enqueueSnackbar("Back to Cart",{variant:"default"});
        }
      }
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
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
  return (
    <div>
    <div  className="logout-button">
        <button onClick={backtocart} style={{ backgroundColor: "darkgrey" }}>
          Cart
        </button>
      <button onClick={backtohomebal} style={{ backgroundColor: "darkgrey" }}>
          Back To Home
        </button>
    </div>
    <div className="app">
                <div className="login-page">
      <h1>Balance: ${Balance}</h1>
      <form >
        <label>
          Enter Number to Add:
          <input
            type="number"
            step="100"
            value={inputValue}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={addBalance} style={{ backgroundColor: "darkgrey" }}>Add to Balance</button>
      </form>
    </div>
    </div>
    </div>
  );
}


export default Add;
