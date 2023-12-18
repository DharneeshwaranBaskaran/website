import React, { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import './App.css';
import { useNavigate } from 'react-router-dom';
import withLogoutHandler from "./withLogouthandler";
const fetchData = (url, setDataFunction, errorMessage) => {
  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      setDataFunction(data);
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

  const handlerepeat = (id, cost, count) => {
    console.log(id, cost, count);
    let total = 0;
    total += (cost * count) * 9 / 10;
    let newBalance = Balance - total;
    if (total > Balance) {
      enqueueSnackbar("Insuficient Balance", { variant: "warning" });
    }
    else {
      fetch(`http://localhost:8080/api/repeatHistory/${id}`, {
        method: 'POST',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
          enqueueSnackbar(data);
          navigate(`/${type}/payment`);
        })
        .catch((error) => {
          console.error('Error transferring data:', error);
          enqueueSnackbar(`Error transferring data: ${error}`);
        });
      fetch(`http://localhost:8080/api/updateUserBalance/${Username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBalance),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
        })
        .catch((error) => {
          console.error('Error updating user balance:', error);
        });

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
      fetch(`http://localhost:8080/api/HistoryClear/${Username}`, {
        method: 'POST',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          console.log(data);
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
    fetchData(`http://localhost:8080/api/balance/${Username}`, setBalance, 'error fetching balance')
    console.log(Draft);
  },
    [Username]);

  const removeItemFromCart = (id) => {
    fetch(`http://localhost:8080/api/deletecombo/${id}/${Username}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        fetchData(`http://localhost:8080/api/history/view/${Username}`, setData, 'Error fetching cart items:');
        fetchData(`http://localhost:8080/api/history/viewdraft/${Username}`, setDraft, 'Error fetching draft items:');
      })
      .catch((error) => {
        console.error('Error deleting combo:', error);
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
    fetch(`http://localhost:8080/api/updateUserBalance/${Username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBalance),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error('Error updating user balance:', error);
      });

    console.log(id, cost, count);
    navigate(`/${type}/homepage`);
  }

  const handleEdit = (id) => {
    localStorage.setItem('edit', id)
    navigate(`/${type}/edit`);
  }
  const filteredItems = Items.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));

  const drafttodatabase = async (id) => {
    fetch(`http://localhost:8080/api/transferdata/${id}`, {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
        enqueueSnackbar(data);
        navigate(`/${type}/homepage`);
      })
      .catch((error) => {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          console.error('Network error:', error);
          enqueueSnackbar('Network error. Please check your internet connection.');
        } else {
          console.error('Error transferring data:', error);
          enqueueSnackbar(error.message || 'Error transferring data');
        }
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
          data-testid="search-container"
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
        <h2 data-testid="PRODUCTS">PRODUCTS:</h2>
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
                <td><button className="cart-button" onClick={() => removeItemFromCart(item.id)}>
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
                  <td><button className="cart-button" onClick={() => removeItemFromCart(item.id)}>
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

export default withLogoutHandler(History);