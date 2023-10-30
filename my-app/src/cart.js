import React, { useState,useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
function Cart() {
const { enqueueSnackbar } = useSnackbar();
 
const [Balance,setBalance]=useState(0); 
const [person,setperson]=useState([]);
let Username=localStorage.getItem('username');
const [Items, setItems] = useState([]); 
const [Data,setData]=useState([]);
const [searchQuery, setSearchQuery] = useState('');
const navigate = useNavigate(); 
const type=localStorage.getItem("type")
const handlebacktohome=()=>{ 
  navigate(`/${type}/homepage`);
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
  if(total>100){
    total=total*9/10;
  }
  if(Items.length === 0)
  enqueueSnackbar("Your cart is empty",{ variant:"info" });
  else if(Balance>total){ 
    const newBalance = Balance - (total*9/10);
    
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

          
          navigate(`/${type}/payment`);
    enqueueSnackbar("Payment Sucessful",{variant:"success"}); 
    enqueueSnackbar(( total*1/10)+" Is the Loyalty points Added to balance");
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
  if(total>100){
    total=total*9/10;
  }
  if(Items.length === 0)
  enqueueSnackbar("Your cart is empty",{ variant:"info" });
  else if(Balance>total){
    const newBalance = Balance - (total*9/10);
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

          navigate(`/${type}/payment`); 
    enqueueSnackbar("Payment Successful",{ variant:"success" });
    enqueueSnackbar(( total*1/10)+" Is the Loyalty points Added to balance");
  } 
  else{
    enqueueSnackbar("Insuficient Balance",{ variant:"warning"});
  } 
}  
const handlePayment1=()=>{
  let total = 0;
  for (const item of Items) {
    total += item.cost * item.count;
  }
  if(total>100){
    total=total*9/10;
  }
  if(Items.length === 0)
  enqueueSnackbar("Your cart is empty",{ variant:"info" });
  else if(Balance>total){
    const newBalance = Balance - (total*9/10)-10;
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

          navigate(`/${type}/payment`);
    enqueueSnackbar("Payment Successful",{ variant:"success" });
    enqueueSnackbar(( total*1/10)+" Is the Loyalty points Added to balance");
  } 
  else{
    enqueueSnackbar("Insuficient Balance",{ variant:"warning"});
  } 
}  
const handlePayment2=()=>{
  let total = 0;
  for (const item of Items) {
    total += item.cost * item.count;
  }
  if(total>100){
    total=total*9/10;
  }
  if(Items.length === 0 )
  enqueueSnackbar("Your cart is empty",{ variant:"info" });
  else if(total<50){
    // const newBalance = Balance - (total*9/10)-10;
      axios.post(`http://localhost:8080/api/transferToHistorypaylater/${Username}`)
          .then((response) => {
              console.log(response.data);
          })
          .catch((error) => {
              console.error('Error transferring data:', error);
          });
          
          navigate(`/${type}/payment`);
    enqueueSnackbar("Purchase Successful",{ variant:"success" });
    
  } 
  else{
    enqueueSnackbar("The total should be less than $50 for payment later",{ variant:"warning"});
  } 
}  
const handlehistory=()=>{
  navigate(`/${type}/history`); 
  enqueueSnackbar("Redirecting to History page",{variant:"default"});
}

const updateBalance = () => {
  navigate(`/${type}/add`);
}

const calculateTotal = (cartItems) => {
  let total = 0;
  for (const item of cartItems) {
    total += item.cost * item.count;
  }
  return total;
};
const calculateTotaldis = (cartItems) => {
  let total = 0;
  for (const item of cartItems) {
    total += item.cost * item.count;
  }
  if(total>100){
    total=total*9/10;
  }
  return total;
};

const removeItemFromCart = (topic) => {
    console.log(topic);
    axios
      .put(`http://localhost:8080/api/update/${topic}/${Username}`)
      .then((response) => {
        const updatedCartItems = Items.map((item) => {
          if (item.topic === topic) {
            return { ...item, state: true }; // Update the state of the item
          }
          return item;
        });
  
        setItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      })
      .catch((error) => {
        console.log(error);
      }); 
      navigate(`/${type}/homepage`); 
      enqueueSnackbar(topic+"removed from cart");
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
    <button onClick={handlehistory} >Purchase History</button>
   );
}
useEffect(() => {
  axios.get(`http://localhost:8080/api/cart/sellerview/${Username}`)
    .then((response) => {
      setData(response.data);
    })
    .catch((error) => {
      console.error('Error fetching cart items:', error);
    });
}, [Username]);
const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
};

// Filter items based on the search query
const filteredItems = Items.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));

return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
    <div className="logout-button">
    <button onClick={handlebacktohome} >Back To Home</button>  
     {backButton}
    </div>
    
    {localStorage.getItem('type') === 'buyer' && (
        <>
      <h1 className="cart-header">Cart for {Username}</h1>
      <input
                type="text"
                placeholder="Search Items"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
                style={{marginLeft:"10px"}}
            />
      <div>
      <table className="purchase-history-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Count</th>
            <th>Cost</th>
            <th>Total Cost</th>
            <th> Remove</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={index}>
              <td>{item.topic}</td>
              <td>{item.count}</td>
              <td>${item.cost}</td>
              <td>${item.cost * item.count}</td>
              <td><button className="cart-button"
            onClick={() => removeItemFromCart(item.topic)}>
                  Remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>      
      <div className="cart-total">Total: $ {calculateTotal(Items)}</div>
      <div className="cart-total">After Discount: $ {calculateTotaldis(Items)}</div>
      <div className="cart-item-count">Available Balance:${Balance}</div>
      <div className="cart-buttons">
      <button className="cart-button" onClick={handlePayment2}>Buy Now pay Later</button>
        <button className="cart-button" onClick={handlePayment1}>Express Delivery</button>
        <button className="cart-button" onClick={handlePaymentandretain}>Pay And Retain</button> 
        <button className="cart-button" onClick={handlePayment}>Pay</button>  
        <button onClick={updateBalance} className="cart-button">Add Balance</button>
      </div>
    </div>
    </>
    )}
    {localStorage.getItem('type') !== 'buyer' && (
      <>
    <table className="purchase-history-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Count</th>
            <th>Cost</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {Data.map((item, index) => (
            <tr key={index}>
              <td>{item.topic}</td>
              <td>{item.count}</td>
              <td>${item.cost}</td>
              <td>${item.cost * item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>  
        </>)}
        
    <p style={{marginLeft:20}}>*$10 Extra for Express Delivery</p>
    <p style={{marginLeft:20}}>*Products will be delivered within 24 hours in Express Delivery</p>   
    <p style={{marginLeft:20}}>*The total should be less than $50 for payment later</p> 
    </div>
  )
}

export default Cart;