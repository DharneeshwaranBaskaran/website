import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import './App.css';
import { useNavigate } from 'react-router-dom';
import withLogoutHandler from "./withLogouthandler";
import { useLoginContext } from "../contexts/LoginContext";
import Cookies from "js-cookie";

const useDataFetching = (url, setter, dependencies = []) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setter(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, dependencies);
};
function Cart() {
  const { enqueueSnackbar } = useSnackbar();
  const [It, setIt] = useState([]);
  const {Balance, setBalance} = useLoginContext();
  const [Address, setAddress] = useState('');
  const [address, setaddress] = useState('');
  let Username = Cookies.get('username');
  const [Items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const type = Cookies.get("type")
  const { jwt, setjwt } = useLoginContext();
  const handlebacktohome = () => {
    navigate(`/${type}/homepage`);
    enqueueSnackbar("Redirecting to homepage", { variant: "default" });
  } 

  const parseJwt = (token) => {
    if (typeof token !== 'string') { 
      console.error('Invalid token format:', token);
      return null;
    }
  
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }; 

  useEffect(() => {
    parseJwt(jwt);
  } );

  useDataFetching(`http://localhost:8080/api/cart/getItems/${Username}`, setItems);
  useDataFetching(`http://localhost:8080/api/balance/${Username}`, setBalance);
  useDataFetching(`http://localhost:8080/api/address/${Username}`, setAddress);
  useDataFetching(`http://localhost:8080/api/historyhome/${Username}`, setIt);
  const handlePayment = (val) => {
    if (Address == undefined || Address == " " || Address == "") {
      enqueueSnackbar("Enter your Address for Delivery");
    }
    else {
      let total = 0;
      for (const item of Items) {
        total += item.cost * item.count;
      }
      if (total > 100) {
        total = total * 9 / 10;
      }
      if (Items.length === 0)
        enqueueSnackbar("Your cart is empty", { variant: "info" });
      else if (Balance > total) {
        const newBalance = Balance - (total * 9 / 10); 
        setBalance(newBalance);
        if (val === "retain") {
          fetch(`http://localhost:8080/api/HistoryRetainCart/${Username}`, {
            method: 'POST',
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          }).then((data) => {
            console.log(data);
          }).catch((error) => {
            console.error('Error transferring data:', error);
          });
          fetch(`http://localhost:8080/api/updateUserBalance/${Username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBalance),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          }).catch((error) => {
            console.error('Error updating user balance:', error);
          });
        }
        else if (val === "express" || val === "pay") {
          if (It.length < 10 && (val === "express")) {
            newBalance = newBalance - 10; 
            setBalance(newBalance);
          }
          fetch(`http://localhost:8080/api/transferToHistory/${Username}`, {
            method: 'POST',
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          }).then((data) => {
            console.log(data);
          }).catch((error) => {
            console.error('Error transferring data:', error);
          });
          fetch(`http://localhost:8080/api/updateUserBalance/${Username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newBalance),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          }).then((data) => {
            console.log(data);
          }).catch((error) => {
            console.error('Error updating user balance:', error);
          });
        }
        else {
          if (total < 50) {
            fetch(`http://localhost:8080/api/transferToHistorypaylater/${Username}`, {
              method: 'POST'
            })
              .then((response) => {
                if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
              }).then((data) => {
                console.log(data);
              }).catch((error) => {
                console.error('Error transferring data:', error);
              });
            navigate(`/${type}/payment`);
            enqueueSnackbar("Purchase Successful", { variant: "success" });
          }
          else {
            enqueueSnackbar("The total should be less than $50 for payment later", { variant: "warning" });
          }
        }
        navigate(`/${type}/payment`);
        enqueueSnackbar("Payment Sucessful", { variant: "success" });
        enqueueSnackbar((total * 1 / 10) + " Is the Loyalty points Added to balance");
      }
      else {
        enqueueSnackbar("Insuficient Balance", { variant: "warning" });
      }
    }
  }
  const handleChange4 = (e) => {
    setaddress(e.target.value);
  };
  const handlehistory = (key) => {
    navigate(`/${type}/${key}`);
    enqueueSnackbar(`Redirecting to ${key} page`, { variant: "default" });
  }
  const calculateTotal = (cartItems) => {
    let total = 0;
    for (const item of cartItems) {
      total += item.cost * item.count;
    }
    return total;
  };
  const removeItemFromCart = (id) => {
    fetch(`http://localhost:8080/api/update/${id}/${Username}`, {
      method: 'PUT'
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }).then(() => {
        const updatedCartItems = Items.map((item) => {
          if (item.id === id) {
            return { ...item, state: true };
          }
          return item;
        });
        setItems(updatedCartItems);
        Cookies.set('cartItems', JSON.stringify(updatedCartItems));
      }).catch((error) => {
        console.error('Error updating item:', error);
      });
    window.location.reload();
    enqueueSnackbar(id + " removed from cart");
  };
  let backButton = null;
  if (Cookies.get('type') == 'buyer') {
    backButton = (<button style={{ backgroundColor: "#713ABE" }} onClick={() => handlehistory("history")}>Purchase History📜</button>
    );
  }
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleaddress = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/updateAddress/${Username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(address),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.log('Error updating user address');
      }
    } catch (error) {
      console.log('Error updating user address catch');
    }
    window.location.reload();
  };
  const filteredItems = Items.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "150vh" }}>
       {(jwt ==Cookies.get('token')&& Cookies.get('type')==parseJwt(jwt).type && parseJwt(jwt).id==Cookies.get("dataid") ) ?( 
      <>
      <div className="logout-button">
        <button onClick={handlebacktohome} style={{ backgroundColor: "#5B0888" }}>Back To Home 🏠</button>
        {backButton}
      </div>
      {Cookies.get('type') === 'buyer' && (<>
        {It.length > 10 && (
          <h2 style={{ marginLeft: "10px" }}>You Are A Premium User</h2>
        )}
        <div>
          <h1 className="cart-header" style={{ marginLeft: "15px" }} data-testid="PRODUCTS">Cart for {Username}</h1>
          {(Address == undefined || Address == " " || Address == "") && (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <p style={{ marginLeft: "15px" }}>Enter Your Address Before placing order:</p>
              <input
                style={{ width: "200px", marginLeft: "20px" }}
                type="text"
                placeholder="Personal Address"
                value={address}
                onChange={handleChange4}
              /><button style={{ marginLeft: "20px" }} className="lob" onClick={handleaddress}>Confirm</button>
            </div>
          )}
        </div>
        <p style={{ marginLeft: "20px" }}>Delivery Address:{Address}</p>
        <div data-testid="search-container">
          <input
            type="text"
            placeholder="Search Items"
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-bar"
            style={{ marginLeft: "15px" }}
          />
        </div>
        <div>
          <table className="purchase-history-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Count</th>
                <th>Cost</th>
                <th>Total Cost</th>
                <th>Remove</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <tr key={index}>
                    <td>{item.topic}</td>
                    <td>{item.count}</td>
                    <td>${item.cost}</td>
                    <td>${item.cost * item.count}</td>
                    <td>
                      <button className="cart-button" onClick={() => removeItemFromCart(item.id)}>Remove🗑️</button>
                    </td>
                  </tr>
                ))
              ) : (<tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  <h1>Cart is empty🛒</h1>
                </td>
              </tr>
              )}
            </tbody>
          </table>
          <div className="cart-total" style={{ marginRight: "87px" }}>Total: $ {calculateTotal(Items)}</div>
          <div className="cart-item-count" style={{ marginLeft: "10px" }}>Available Balance:${Balance}</div>
          <div className="cart-buttons">
            <button className="cart-button" style={{ backgroundColor: "#5B0888" }} onClick={() => handlePayment("later")}>Buy Now pay Later💳</button>
            <button className="cart-button" style={{ backgroundColor: "#713ABE" }} onClick={() => handlePayment("express")}>Express Delivery🚚</button>
            <button className="cart-button" style={{ backgroundColor: "#793FDF" }} onClick={() => handlePayment("retain")}>Pay And Retain🛍️</button>
            <button className="cart-button" style={{ backgroundColor: "#7752FE" }} onClick={() => handlePayment("pay")}>Pay💸</button>
            <button onClick={() => handlehistory("add")} className="cart-button">Add Balance💰</button>
            <button onClick={() => handlehistory("address")} className="lob" style={{ marginLeft: "10px", marginRight: "10px" }}>Alter Address📍</button>
          </div>
        </div>
      </>)}
      <p style={{ marginLeft: 20 }}>*$10 Extra for Non Premium Users in Express Delivery</p>
      <p style={{ marginLeft: 20 }}>*Products will be delivered within 24 hours in Express Delivery</p>
      <p style={{ marginLeft: 20 }}>*The total should be less than $50 for payment later</p>
      </>
      ):(<><h1>YOU DO NOT HAVE ACCESS TO THIS PAGE</h1></>)}
    </div>
  )
}
export default withLogoutHandler(Cart);