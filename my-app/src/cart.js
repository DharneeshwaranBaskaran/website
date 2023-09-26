import React, { useState,useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
function Cart({backtohome,pay,history,balance}) {
const { enqueueSnackbar } = useSnackbar();
 
const [Balance,setBalance]=useState(0);
const [person,setperson]=useState([]);
let Username=localStorage.getItem('username');
const [Items, setItems] = useState([]); 
const [Data,setData]=useState([]);
const handlebacktohome=()=>{
  backtohome();
  enqueueSnackbar("Redirecting to homepage",{ variant:"default"});
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

const handlePaymentandretain=()=>{
  let total = 0;
  for (const item of Items) {
    total += item.cost * item.count;
  }
  if(Items.length === 0)
  enqueueSnackbar("Your cart is empty",{ variant:"info" });
  else if(Balance>total){ 
    const newBalance = Balance - total
    localStorage.setItem('Balance', Balance);
    axios.post(`http://localhost:8080/api/HistoryRetainCart/${Username}`)
          .then((response) => {
              console.log(response.data);
          })
          .catch((error) => {
              console.error('Error transferring data:', error);
          });
          axios.post(`http://localhost:8080/api/updateUserBalance/${Username}`, newBalance, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
    pay(); 
    enqueueSnackbar("Payment Sucessful",{variant:"success"});
  }
  else{
    enqueueSnackbar("Insuficient Balance",{variant:"warning"});
  }
}
const handlePayment=()=>{
  let total = 0;
  for (const item of Items) {
    total += item.cost * item.count;
  }
  if(Items.length === 0)
  enqueueSnackbar("Your cart is empty",{ variant:"info" });
  else if(Balance>total){
    const newBalance = Balance - total 
    
      axios.post(`http://localhost:8080/api/transferToHistory/${Username}`)
          .then((response) => {
              console.log(response.data);
          })
          .catch((error) => {
              console.error('Error transferring data:', error);
          });
          axios.post(`http://localhost:8080/api/updateUserBalance/${Username}`, newBalance, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
  
    pay(); 
    enqueueSnackbar("Payment Successful",{ variant:"success" });
  } 
  else{
    enqueueSnackbar("Insuficient Balance",{ variant:"warning"});
  } 
}  
const handlehistory=()=>{
  history(); 
  enqueueSnackbar("Redirecting to History page",{variant:"default"});
}

const updateBalance = () => {
  balance();
}

const calculateTotal = (cartItems) => {
  let total = 0;
  for (const item of cartItems) {
    total += item.cost * item.count;
  }
  return total;
};

const removeItemFromCart = (name) => {
  axios
      .delete(`http://localhost:8080/api/delete/${name}/${Username}`)
      .then((response) => {
        const updatedCartItems = Items.filter((item) => item.name !== name);
        setItems(updatedCartItems);

        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      })
      .catch((error) => {
      });
};
const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
useEffect(() => {
  axios.get(`http://localhost:8080/api/cart/getItems/${Username}`)
    .then((response) => {
      setItems(response.data);
    })
    .catch((error) => {
      console.error('Error fetching cart items:', error);
    });
}, [Username]);
let backButton=null;
if(localStorage.getItem('type')=='buyer'){
  backButton = (
    <button onClick={handlehistory} style={{ 
      backgroundColor: "darkgrey", 
      }}>Purchase History</button>
   );
}
useEffect(() => {
  axios.get(`http://localhost:8080/api/cart/sellerview/${person}`)
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      console.error('Error fetching cart items:', error);
    });
}, [person]);
useEffect(() => {
  axios.get(`http://localhost:8080/api/getperson/${Username}`)
    .then((response) => {
        setperson(response.data[0].person); // Extract and set the person value

    })
    .catch((error) => {
      console.error('Error fetching cart items:', error);
    });
}, [Username]);
return (
    <div style={{ backgroundColor: "lightgrey", minHeight: "100vh" }}>
    <div className="logout-button">
    <button onClick={handlebacktohome} style={{ 
                    backgroundColor: "darkgrey", 
                    }}>Back To Home</button>  
     {backButton}
    </div>
    
    {localStorage.getItem('type') === 'buyer' && (
        <>
      <h1 className="cart-header">Cart for {Username}</h1>
      <div>
  
      <ul>
        {Items.map((item, index) => (
          <li className="cart-item" key={index}>
            <div className="cart-item-name">{item.name}</div>
            <div className="cart-item-count">{item.count}</div> 
            <div className="cart-item-cost">{item.cost}</div>
            <div className="cart-item-cost">${item.cost * item.count}</div>
            <button className="cart-button"
            onClick={() => removeItemFromCart(item.name)}>
                  Cancel</button>
          </li>
        ))}
      </ul> 
      
      
      <div className="cart-total">Total: $ {calculateTotal(Items)}</div>
      <div className="cart-item-count">Available Balance:${Balance}</div>
      <div className="cart-buttons">
        <button className="cart-button" onClick={handlePaymentandretain}>Pay And Retain</button> 
        <button className="cart-button" onClick={handlePayment}>Pay</button>  
        <button onClick={updateBalance} className="cart-button">Add Balance</button>
      </div>
    </div>
    </>
    )}
    {localStorage.getItem('type') === 'seller' && (
      <>
    {Data.map((item, index) => (
          <li className="cart-item" key={index}>
            <div></div>
            <div className="cart-item-name">{item.name}</div>
            <div className="cart-item-count">{item.count}</div> 
            <div className="cart-item-cost">{item.cost}</div>
            <div className="cart-item-cost">${item.cost * item.count}</div>
            <div></div>
          </li>
        ))}
        </>)}
        {/* {person} */}
    </div>
  )
}

export default Cart;