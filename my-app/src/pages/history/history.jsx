import React, { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import '../../App.css';
import { useNavigate } from 'react-router-dom';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie";
import { Helper } from "../../components/helper/helpers"; 
import "./history.css";
function History() {
  const { jwt, setjwt } = useLoginContext();
  const navigate = useNavigate();
  const [Data, setData] = useState([]);
  const [Items, setItems] = useState([]);
  const [Draft, setDraft] = useState([]);
  let Username = Cookies.get('username');
  let type = Cookies.get('type');
  const [searchQuery, setSearchQuery] = useState('');
  const {Balance, setBalance} = useLoginContext();

 

  const handlebacktohomefromhis = () => {
    navigate(`/${type}/homepage`);
    enqueueSnackbar('Redirecting To Home Page', { variant: "default" })
  }

  const handleHistoryClear = () => {
    if (Items.length === 0) {
      enqueueSnackbar("Your History Page Is Empty", { variant: "info" });
    }
    else {
      fetch(`http://localhost:8080/HistoryClear/${Username}`, {
        method: 'POST',
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
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
      <button onClick={handleHistoryClear} className='purple'>Clear History</button>
    </div>
    );
  }
  
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

    
  
    useEffect(() => { 
      if(Cookies.get('type') == "buyer"){
      fetchData(
        [`http://localhost:8080/history/${Username}`, `http://localhost:8080/balance/${Username}`],
        [setItems, setBalance]
      )}
      else{
      fetchData(

      [`http://localhost:8080/history/viewdraft/${Username}`, `http://localhost:8080/history/view/${Username}`],
      [ setDraft,setData ]
      )
    }
    }, []);

  const removeItemFromCart = (id) => {
    fetch(`http://localhost:8080/deletecombo/${id}/${Username}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(() => {
        fetchData(
          [`http://localhost:8080/history/view/${Username}`,`http://localhost:8080/history/viewdraft/${Username}`],
          [ setData, setDraft]
        );
        })
      .catch((error) => {
        console.error('Error deleting combo:', error);
      });
      setTimeout(window.location.reload(), 1000);
      enqueueSnackbar("Product Removed Successfully");
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handlecancel = (id, cost, count) => {
    let newBalance = Balance + (cost * count * 9 / 10) - 5;
    fetch(`http://localhost:8080/cancel/${id}`, {
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
      })
      .catch((error) => {
        console.error('Error cancelling order:', error);
        enqueueSnackbar('Failed to cancel order', { variant: 'error' });
      });
    fetch(`http://localhost:8080/updateUserBalance/${Username}`, {
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
      })
      .catch((error) => {
        console.error('Error updating user balance:', error);
      });
    navigate(`/${type}/homepage`);
  }

  const handleEdit = (id) => {
    Cookies.set('edit', id)
    navigate(`/${type}/edit`);
  }
  const filteredItems = Items.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));

  const drafttodatabase = async (id) => {
    fetch(`http://localhost:8080/transferdata/${id}`, {
      method: 'POST',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return {};
      })
      .then((data) => {
        navigate(`/${type}/homepage`);
      })
      .catch((error) => {
        if (error instanceof TypeError && error.message === 'Failed to fetch') {
          console.error('Network error:', error);
        } else {
          console.error('Error transferring data:', error);
        }
      });
  }

  return (
    <div className="backgroundhis">
        {(jwt ==Cookies.get('token')&& Cookies.get('type')==Helper(jwt).type && Helper(jwt).id==Cookies.get("dataid") ) &&( 
      <>
      <div className="logout-button">
        <button onClick={handlebacktohomefromhis} className="purple">Back To Home </button>
      </div>
      {Cookies.get('type') == "buyer" && (
        <input
          type="text"
          data-testid="search-container"
          placeholder="Search Items"
          value={searchQuery}
          onChange={handleSearchChange}
          className="search-bar marleft"
        />
      )}
      <table className="purchase-history-table">
        {Cookies.get('type') == "buyer" && (
          <thead>
            <tr>
              <th>Topic</th>
              <th>Count</th>
              <th>Cost</th>
              <th>Total Cost</th>
              <th>Status</th>
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
              <td>{item.status}</td>
              <td><button className="cart-button" onClick={() => handlecancel(item.id, item.cost, item.count)}>Cancel</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {backButton}
      {(Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') && (<>
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
      </>
      )}
    </div>
  );
}

export default withLogoutHandler(History);