import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
import './App.css';
import { useNavigate } from 'react-router-dom';
const useDataFetching = (url, setter, dependencies = []) => {
  useEffect(() => {
    axios.get(url)
      .then((response) => {
        const data = response.data;
        setter(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, dependencies);
};
function Cart() {
  const { enqueueSnackbar } = useSnackbar();
  const [It, setIt] = useState([]);
  const [Balance, setBalance] = useState(0);
  const [Address, setAddress] = useState('');
  const [address, setaddress] = useState('');
  let Username = localStorage.getItem('username');
  const [Items, setItems] = useState([]);
  const [Data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const type = localStorage.getItem("type")
  const handlebacktohome = () => {
    navigate(`/${type}/homepage`);
    enqueueSnackbar("Redirecting to homepage", { variant: "default" });
  }

  useEffect(() => {
    const logoutChannel = new BroadcastChannel('logoutChannel');
    logoutChannel.onmessage = () => {
      navigate("/start");
      localStorage.clear();
      window.location.reload();
      enqueueSnackbar("Logout Successful");
    };
    axios.get(`http://localhost:8080/api/cart/getItems/${Username}`)
      .then((response) => {
        setItems(response.data);

      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });
  }, [Username]);
  useDataFetching(`http://localhost:8080/api/cart/getItems/${Username}`, setItems);
  useDataFetching(`http://localhost:8080/api/balance/${Username}`, setBalance);
  useDataFetching(`http://localhost:8080/api/address/${Username}`, setAddress);
  useDataFetching(`http://localhost:8080/api/historyhome/${Username}`, setIt);
  useDataFetching(`http://localhost:8080/api/cart/sellerview/${Username}`, setData);

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
        if (val === "retain") {
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
        }
        else if (val === "express") {
          if (It.length < 10) {
            newBalance = newBalance - 10;
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

        }
        else if (val === "pay") {
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
        }
        else {
          if (total < 50) {
            axios.post(`http://localhost:8080/api/transferToHistorypaylater/${Username}`)
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
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
    console.log(val);
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
    console.log(id);
    axios
      .put(`http://localhost:8080/api/update/${id}/${Username}`)
      .then((response) => {
        const updatedCartItems = Items.map((item) => {
          if (item.id === id) {
            return { ...item, state: true };
          }
          return item;
        });
        setItems(updatedCartItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      })
      .catch((error) => {
        console.log(error);
      });
    window.location.reload();
    enqueueSnackbar(id + " removed from cart");
  };

  let backButton = null;
  if (localStorage.getItem('type') == 'buyer') {
    backButton = (<button style={{ backgroundColor: "#713ABE" }} onClick={() => handlehistory("history")}>Purchase History📜</button>
    );
  }

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
  const filteredItems = Items.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "150vh" }}>
      <div className="logout-button">
        <button onClick={handlebacktohome} style={{ backgroundColor: "#5B0888" }}>Back To Home 🏠</button>
        {backButton}
      </div>
      {localStorage.getItem('type') === 'buyer' && (<>
        {It.length > 10 && (
          <h2 style={{ marginLeft: "10px" }}>You Are A Premium User</h2>
        )}
        <div>
          <h1 className="cart-header" style={{ marginLeft: "15px" }}>Cart for {Username}</h1>
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
        <input
          type="text"
          placeholder="Search Items"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
          style={{ marginLeft: "15px" }}
        />
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
      {localStorage.getItem('type') !== 'buyer' && (<>
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
      <p style={{ marginLeft: 20 }}>*$10 Extra for Non Premium Users in Express Delivery</p>
      <p style={{ marginLeft: 20 }}>*Products will be delivered within 24 hours in Express Delivery</p>
      <p style={{ marginLeft: 20 }}>*The total should be less than $50 for payment later</p>
    </div>
  )
}

export default Cart;