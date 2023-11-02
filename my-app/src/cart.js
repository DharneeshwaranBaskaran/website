import React, { useState,useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
function Cart() {
const { enqueueSnackbar } = useSnackbar();
const [It, setIt] = useState([]);
const [Balance,setBalance]=useState(0); 
const [Address,setAddress]=useState('');
const [address,setaddress]=useState('');
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
  useEffect(() => {
    axios.get(`http://localhost:8080/api/address/${Username}`)
      .then((response) => {
        const data = response.data;
        setAddress(data); // Update the Address state here
        console.log(data); // Log the updated data
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [Username]);
  useEffect(() => {
    axios.get(`http://localhost:8080/api/historyhome/${Username}`)
        .then((response) => {
            setIt(response.data);
        })
        .catch((error) => {
            console.error('Error fetching history items:', error);
        });
  }, [Username]);
const handlePaymentandretain=()=>{ 
  if(Address==undefined|| Address==" " ||Address==""){
    enqueueSnackbar("Enter your Address for Delivery");
  }
  else{
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
}
const handlePayment=()=>{
  if(Address==undefined|| Address==" " ||Address==""){
    enqueueSnackbar("Enter your Address for Delivery");
  }
  else{
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
  } }
}  
const handleChange4 = (e) => {
  const value = e.target.value;
  setaddress(value);
   
 }; 
const handlePayment1=()=>{
  if(Address==undefined|| Address==" " ||Address==""){
    enqueueSnackbar("Enter your Address for Delivery");
  }
  else{
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
    let newBalance=0;
    if(It.length<10){
    newBalance = Balance - (total*9/10)-10; 
    }
    else{
      newBalance = Balance - (total*9/10);
    } 
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
  } }
}  
const handlePayment2=()=>{
  if(Address==undefined|| Address==" " ||Address==""){
    enqueueSnackbar("Enter your Address for Delivery");
  }
  else{
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
  } }
}  
const handlehistory=()=>{
  navigate(`/${type}/history`); 
  enqueueSnackbar("Redirecting to History page",{variant:"default"});
}

const updateBalance = () => {
  navigate(`/${type}/add`);
  console.log(filteredItems);
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
    <button  style={{backgroundColor:"#713ABE"}} onClick={handlehistory}>Purchase History</button>
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


const handleaddress = async () => {
  try {
    const response = await axios.post(`http://localhost:8080/api/updateAddress/${Username}`, address, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      console.log(response.data);
    } else {
      console.log('Error updating user address');
    }
  } catch (error) {
    console.log('Error updating user address catch');
  }
  window.location.reload();
};

// Filter items based on the search query
const filteredItems = Items.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));

return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "150vh" }}>
    <div className="logout-button">
    <button onClick={handlebacktohome} style={{ backgroundColor: "#5B0888" }}>Back To Home</button>  
     {backButton}
    </div>
    
    {localStorage.getItem('type') === 'buyer' && (
        <> 
      {It.length>10 &&( 
        <>
        <h2>You Are A Premium User</h2> 
       
        </>
      )}
      <div>
      <h1 className="cart-header">Cart for {Username}</h1> 
      {(Address==undefined|| Address==" " ||Address=="") &&(
        <div style={{ display: 'flex', alignItems: 'center' }}>
        <p style={{marginLeft:"10px"}}>Enter Your Address Before placing order:</p>
        
        <input
        style={{width:"200px",marginLeft:"20px"}}
        type="text"
        placeholder="Personal Address"
        value={address}
        onChange={handleChange4}              
        /><button style={{marginLeft:"20px"}} className="lob" onClick={handleaddress}>Confirm</button>
        </div>
        
      )}
      </div>
      <p>Delivery Address:{Address}</p>
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
      <button className="cart-button"  style={{backgroundColor:"#5B0888"}} onClick={handlePayment2}>Buy Now pay Later</button>
        <button className="cart-button" style={{backgroundColor:"#713ABE"}} onClick={handlePayment1}>Express Delivery</button>
        <button className="cart-button" style={{backgroundColor:"#793FDF"}} onClick={handlePaymentandretain}>Pay And Retain</button> 
        <button className="cart-button" style={{backgroundColor:"#7752FE"}}  onClick={handlePayment}>Pay</button>  
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
        
    <p style={{marginLeft:20}}>*$10 Extra for Non Premium Users in Express Delivery</p>
    <p style={{marginLeft:20}}>*Products will be delivered within 24 hours in Express Delivery</p>   
    <p style={{marginLeft:20}}>*The total should be less than $50 for payment later</p> 
    </div>
  )
}

export default Cart;