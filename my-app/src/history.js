import React, { useState,useEffect } from "react";
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
function History({ his,histocart }) {
  const [Items, setItems] = useState([]);
  let Username=localStorage.getItem('username');
  const handlebacktohomefromhis = () => {
    his(); 
    enqueueSnackbar('Redirecting To Home Page',{variant:"default"})
  }
  const handleHistoryClear = () => {  
    if(Items.length === 0){
  enqueueSnackbar("Your History Page Is Empty",{variant:"info"});
}
else{
    axios.post(`http://localhost:8080/api/HistoryClear/${Username}`)
          .then((response) => {
              console.log(response.data);
          })
          .catch((error) => {
              console.error('Error transferring data:', error);
          }); 
          histocart();  
          enqueueSnackbar("History Has Been Cleared",{variant:"success"});
          enqueueSnackbar("Redirecting to Cart",{variant:"default"});
  }
}
 
  useEffect(() => {
    axios.get(`http://localhost:8080/api/history/${Username}`)
        .then((response) => {
            setItems(response.data);
        })
        .catch((error) => {
            console.error('Error fetching history items:', error);
        });
}, [Username]);
  return (
    <div>
      <div className="logout-button">
        <button onClick={handlebacktohomefromhis} style={{ backgroundColor: "darkgrey" }}>
          Back To Home
        </button>
      </div>
      <ul>
        {Items.map((item, index) => (
          <li className="cart-item" key={index}>
            <div className="cart-item-name">{item.name}</div>
            <div className="cart-item-count">{item.count}</div> 
            <div className="cart-item-cost">{item.cost}</div>
            <div className="cart-item-cost">${item.cost * item.count}</div>
            
          </li>
        ))}
      </ul> 
      <div className="logout-button">
      <button style={{ backgroundColor: "darkgrey" }} onClick={handleHistoryClear}>Clear History</button>
      </div>
      
    </div>
  );
}


export default History;
