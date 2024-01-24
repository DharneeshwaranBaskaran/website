import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import '../App.css';
import { useNavigate } from 'react-router-dom';
import withLogoutHandler from "../hoc/withLogouthandler";
import { useLoginContext } from "../../contexts/LoginContext";
import Cookies from "js-cookie";
import PaymentButton from "./payment";
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
    fetchData(
      [`http://localhost:8080/api/cart/getItems/${Username}`,`http://localhost:8080/api/balance/${Username}`,
      `http://localhost:8080/api/address/${Username}`,`http://localhost:8080/api/historyhome/${Username}`],
      [setItems, setBalance,setAddress,setIt]
    );
    parseJwt(jwt);
  }, []);

  const fetchData = async (urls, setDataCallbacks) => {
    try {
      const responses = await Promise.all(
        urls.map(url => fetch(url).then(response => response.json()))
      );
      responses.forEach((data, index) => {
        setDataCallbacks[index](data);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
                  <h1>Cart is empty</h1>
                </td>
              </tr>
              )}
            </tbody>
          </table>
          <div className="cart-total" style={{ marginRight: "87px" }}>Total: $ {calculateTotal(Items)}</div>
          <div className="cart-item-count" style={{ marginLeft: "10px" }}>Available Balance:${Balance}</div>
          <PaymentButton/>
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