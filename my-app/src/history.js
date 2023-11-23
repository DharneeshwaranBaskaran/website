import React, { useState, useEffect } from "react";
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
import './App.css';
import { useNavigate } from 'react-router-dom';

const fetchData = (url, setDataFunction, errorMessage) => {
  axios.get(url)
    .then((response) => {
      setDataFunction(response.data);
    })
    .catch((error) => {
      console.error(`Error fetching items from ${url}:`, error);
      errorMessage && console.error(errorMessage);
    });
};
function History() {
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const [Items, setItems] = useState([]);
  const [Draft, setDraft] = useState([]);
  let Username = localStorage.getItem('username');
  let type = localStorage.getItem('type');
  const [searchQuery, setSearchQuery] = useState('');
  const [Balance, setBalance] = useState(0);

  useEffect(() => {
    const logoutChannel = new BroadcastChannel('logoutChannel');
    logoutChannel.onmessage = () => {
      navigate("/start");
      localStorage.clear();
      window.location.reload();
      enqueueSnackbar("Logout Successful");
    };
  }, []);

  const handlerepeat = (id, cost, count) => {
    console.log(id, cost, count);
    let total = 0;
    total += (cost * count) * 9 / 10;
    let newBalance = Balance - total;
    if (total > Balance) {
      enqueueSnackbar("Insuficient Balance", { variant: "warning" });
    }
    else {
      axios.post(`http://localhost:8080/api/repeatHistory/${id}`)
        .then((response) => {
          console.log(response.data);
          enqueueSnackbar(response.data)
          navigate(`/${type}/payment`);
        })
        .catch((error) => {
          console.error('Error transferring data:', error);
          enqueueSnackbar('Error transferring data:', error);
        });
      axios.post(`http://localhost:8080/api/updateUserBalance/${Username}`, newBalance, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }
  }

  const handlebacktohomefromhis = () => {
    navigate(`/${type}/homepage`);
    enqueueSnackbar('Redirecting To Home Page', { variant: "default" })
  }

  const handleHistoryClear = () => {
    if (Items.length === 0) {
      enqueueSnackbar("Your History Page Is Empty", { variant: "info" });
    }
    else {
      axios.post(`http://localhost:8080/api/HistoryClear/${Username}`)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Error transferring data:', error);
        });
      navigate(`/${type}/cart`);
      enqueueSnackbar("History Has Been Cleared", { variant: "success" });
      enqueueSnackbar("Redirecting to Cart", { variant: "default" });
    }
  }

  let backButton = null;
  if (type == "buyer") {
    backButton = (<div className="logout-button">
      <button onClick={handleHistoryClear}>Clear History</button>
    </div>
    );
  } 
useEffect(() => {
    fetchData(`http://localhost:8080/api/history/${Username}`, setItems, 'Error fetching history items:');
    fetchData(`http://localhost:8080/api/history/view/${Username}`, setData, 'Error fetching cart items:');
    fetchData(`http://localhost:8080/api/history/viewdraft/${Username}`, setDraft, 'Error fetching draft items:');
    fetchData(`http://localhost:8080/api/balance/${Username}`,setBalance,'error fetching balance')
  }, [Username]);
  
  const removeItemFromCart = (topic) => {
    axios
      .delete(`http://localhost:8080/api/deletecombo/${topic}/${Username}`)
      .then((response) => {
        fetchData(`http://localhost:8080/api/history/view/${Username}`,setData,'Error fetching cart items:')
        fetchData(`http://localhost:8080/api/history/viewdraft/${Username}`,setDraft,'Error fetching draft items:')
      })
      .catch((error) => {
      });
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlecancel = (id, cost, count) => {
    let newBalance = Balance + (cost * count * 9 / 10) - 5;
    fetch(`http://localhost:8080/api/cancel/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Failed to cancel order');
        }
      })
      .then((data) => {
        enqueueSnackbar(`Order Cancelled: $5 Charge`, { variant: 'info' });
        console.log(id, cost, count);
      })
      .catch((error) => {
        console.error('Error cancelling order:', error);
        enqueueSnackbar('Failed to cancel order', { variant: 'error' });
      });
    axios.post(`http://localhost:8080/api/updateUserBalance/${Username}`, newBalance, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    console.log(id, cost, count);
    navigate(`/${type}/homepage`);
  }

  const handleEdit = (id) => {
    localStorage.setItem('edit', id)
    navigate(`/${type}/edit`);
  }
  const filteredItems = Items.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const drafttodatabase = async (id) => {
    axios.post(`http://localhost:8080/api/transferdata/${id}`)
      .then((response) => {
        console.log(response.data);
        console.log(response.status);
        enqueueSnackbar(response.data);
        navigate(`/${type}/homepage`);
      })
      .catch((error) => {
        if (error.response) {
          enqueueSnackbar(error.response.data.error);
        }else
          enqueueSnackbar(error.message);
      });
  }

  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
      <div className="logout-button">
        <button onClick={handlebacktohomefromhis} >Back To Home 🏠</button>
      </div>
      {localStorage.getItem('type') == "buyer" && (
        <input
          type="text"
          placeholder="Search Items"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar"
          style={{ marginLeft: "10px" }}
        />
      )}
      <table className="purchase-history-table">
        {localStorage.getItem('type') == "buyer" && (
          <thead>
            <tr>
              <th>Topic</th>
              <th>Count</th>
              <th>Cost</th>
              <th>Total Cost</th>
              <th>Repeat Order</th>
              <th>Cancel Order</th>
            </tr>
          </thead>
        )}
        <tbody>
          {filteredItems.map((item, index) => (
            <tr key={index}>
              <td>{item.topic}</td>
              <td>{item.count}</td>
              <td>${item.cost}</td>
              <td>${item.cost * item.count}</td>
              <td><button className="cart-button" onClick={() => handlerepeat(item.id, item.cost, item.count)}>Repeat Order</button></td>
              <td><button className="cart-button" onClick={() => handlecancel(item.id, item.cost, item.count)}>Cancel</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {backButton}
      {(localStorage.getItem('type') === 'seller' || localStorage.getItem('type') === 'company') && (<>
          <h2>PRODUCTS:</h2>
          <table className="purchase-history-table">
            <thead>
              <tr>
                <th>Referance Number</th>
                <th>Topic</th>
                <th>Cost</th>
                <th>Remove</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {Data.map((item, index) => (
                <tr key={index}>
                  <td>{item.id}</td>
                  <td>{item.topic}</td>
                  <td>${item.cost}</td>
                  <td><button className="cart-button" onClick={() => removeItemFromCart(item.topic)}>
                    Remove</button></td>
                  <td><button className="cart-button" onClick={() => handleEdit(item.id)} >Edit</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {Draft.length > 0 && (<>
              <h2>DRAFT:</h2>
              <table className="purchase-history-table">
                <thead>
                  <tr>
                    <th>Referance Number</th>
                    <th>Topic</th>
                    <th>Cost</th>
                    <th>Remove</th>
                    <th>Launch</th>
                  </tr>
                </thead>
                <tbody>
                  {Draft.map((item, index) => (
                    <tr key={index}>
                      <td>{item.id}</td>
                      <td>{item.topic}</td>
                      <td>${item.cost}</td>
                      <td><button className="cart-button" onClick={() => removeItemFromCart(item.topic)}>
                        Remove</button></td>
                      <td><button className="cart-button" onClick={() => drafttodatabase(item.id)}>
                        Launch</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>)}
        </>)}
    </div>
  );
}

export default History;