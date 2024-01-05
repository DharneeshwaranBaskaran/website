import React, { useEffect, useState } from "react";
import CustomCard from "./customcard";
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import './App.css';
import BubbleGraph from "./BubbleGraph";
import BarGraph from "./Bargraph";
import LaterCard from "./Latercard";
import { Card } from "@mui/material";
import PieChart from "./piechart";
import withLogoutHandler from "./withLogouthandler"; 
import { BroadcastChannel } from "broadcast-channel";
import { useLoginContext } from "../contexts/LoginContext";
function HomePage() {
  const renderInputField = (type, placeholder, value, onChange, style, classs) => (
    <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={style} className={classs} 
    />);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [Items, setItems] = useState([]);
  const [reminder, setremider] = useState([]);
  const [Data, setData] = useState([]);
  const [pro, setpro] = useState([]);
  const [user, setuser] = useState([]);
  const [Balance, setBalance] = useState(0);
  const [cart, setcart] = useState([]);
  const { jwt, setjwt } = useLoginContext();
  const username = localStorage.getItem('username');
  let typeo = localStorage.getItem('type');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortingCriteria, setSortingCriteria] = useState("");
  const [accsortingCriteria, setAccSortingCriteria] = useState("");
  const [sortedData, setSortedData] = useState([]);
  const [sorted, setsorted] = useState([]);
  const [patch, setpatch] = useState([]);
  const [prov, setprov] = useState('');
  const [typ, settye] = useState('');
  const [later, setLater] = useState('');
  const [forpic, setforpic] = useState('');
  const sel = (typeo == "seller" ? "access" : "companyaccess");
  let count = 0;
  const fetchData = async (url, setDataCallback) => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
      } const data = await response.json();
      setDataCallback(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };
  useEffect(() => {
    fetchData(`http://localhost:8080/api/cart/getItems/${username}`, setcart);
    fetchData(`http://localhost:8080/api/${sel}/${username}`, setuser);
    fetchData(`http://localhost:8080/api/balance/${username}`, setBalance);
    fetchData(`http://localhost:8080/api/historyhome/${username}`, setItems);
    fetchData(`http://localhost:8080/api/history/view/${username}`, setData);
    if (prov) {fetchData(`http://localhost:8080/api/history/view/${prov}`, setpro);}
    fetchData(`http://localhost:8080/api/reminder/getItems/${username}`, setremider);
    fetchData(`http://localhost:8080/api/paylater/getpaylater/${username}`, setLater);
  }, []);
  useEffect(() => {
    fetch(`http://localhost:8080/api/user/${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.statusText}`);
        } return response.json();
      }).then((data) => {
        setforpic(data[0].profilepic);
      }).catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, []);
  const handleRecommendation = (id) => {
    localStorage.setItem('myID', id);
    localStorage.setItem('rec', "true");
    navigate(`/${typeo}/menext`);
  }
  useEffect(() => {
    fetch(`http://localhost:8080/api/ty/${typeo}/${username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching cart items: ${response.statusText}`);
        } return response.json();
      }).then((data) => {
        setprov(data[0]?.provider);
        settye(data[0]?.type);
      }).catch((error) => {
        console.error('Error fetching cart items:', error);
      });
  }, [username]);
  const uniqueItems = Items.filter((item, index, self) => index === self.findIndex((t) => t.topic === item.topic));
  const Uniquereminder = reminder.filter((item, index, self) => index === self.findIndex((t) => t.topic === item.topic));
  const handleCategoryChange = (event) => {
    const categoryMap = { Men: 1, Women: 2 };
    const myRef = categoryMap[event.target.value] || 3;
    localStorage.setItem("myRef", myRef);
    navigate(`/${typeo}/men`);
  };
  const handlePay = (id) => {
    enqueueSnackbar("id:" + id);
    fetch(`http://localhost:8080/api/paylater/getpaylat/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error fetching cart items: ${response.statusText}`);
        } return response.json();
      }).then((cur) => {
        let total = 0;
        if (cur.length > 0) {
          total = cur[0].cost * cur[0].count;
        } enqueueSnackbar("total:$" + total);
        if (Balance > total) {
          const newBalance = Balance - total;
          fetch(`http://localhost:8080/api/paidlater/${username}/${id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Error transferring data: ${response.statusText}`);
            } return response.json();
          }).then((data) => {
            console.log(data);
          }).catch((error) => {
            console.error('Error transferring data:', error);
          });
          fetch(`http://localhost:8080/api/updateUserBalance/${username}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify(newBalance),
          }).then((response) => {
            if (!response.ok) {
              throw new Error(`Error updating user balance: ${response.statusText}`);
            } return response.json();
          }).then(() => {
            console.log('User balance updated successfully');
          }).catch((error) => {
            console.error('Error updating user balance:', error);
          });
          navigate(`/${typeo}/payment`);
          enqueueSnackbar("Payment Successful", { variant: "success" });
        } else {
          enqueueSnackbar("Insufficient Balance" + Balance + "  " + total, { variant: "warning" });
        }
      }).catch((error) => {
        console.error('Error fetching cart items:', error);
        enqueueSnackbar('Error fetching cart items:', error);
      });
  }
  const handleChange = (event) => {
    localStorage.setItem("weekend", event.target.value === "No" ? "No" : "Yes");
  }
  const handleActionChange = (event) => {
    if (event.target.value == "Add")
      navigate(`/${typeo}/history`);
    else if (event.target.value == "Draft") {
      navigate(`/${typeo}/add`);
    } else if (event.target.value == "Access") {
      navigate(`/${typeo}/payment`); 
    }else if(event.target.value =="Back"){
      navigate(`/${typeo}/cart`); 
    } else {
      const broadcastChannel = new BroadcastChannel('logoutChannel');
      broadcastChannel.postMessage('logout');
      navigate("/start");
      localStorage.clear();
      window.location.reload();
      enqueueSnackbar("Logout Successful");
    }
  };
  const handlelogout = () => {
    navigate("/start");
    localStorage.clear();
    window.location.reload()
    enqueueSnackbar("Logout Successful");
  }
  const handleSortingChange = (event) => {
    setSortingCriteria(event.target.value);
    count = count + 1;
  };
  const handleSortingChange1 = (event) => {
    setAccSortingCriteria(event.target.value);
    count = count + 1;
  };
  const filterData = (data, query) => {
    return data.filter((item) => item.topic.toLowerCase().includes(query.toLowerCase()));
  };
  useEffect(() => { setpatch(filterData(Data, searchQuery)); }, [Data, searchQuery])
  useEffect(() => {
    const sorted = [...(patch)].sort((a, b) => {
      if (sortingCriteria === "cost") {
        return b.cost - a.cost;
      } else if (sortingCriteria === "count") {
        return b.count - a.count;
      }
      else if (sortingCriteria === "revenue") {
        return (b.cost) * (b.count) - ((a.cost) * (a.count));
      }
      else {
        return 0;
      }
    });
    setSortedData(sorted);
  }, [sortingCriteria, patch])
  const handleRemove = (id) => {
    fetch(`http://localhost:8080/api/delete${sel}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', },
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Error deleting data: ${response.statusText}`);
      } return response.json();
    }).then((data) => {
      window.location.reload();
      console.log(data);
    }).catch((error) => {
      console.error('Error deleting data:', error);
    });
    window.location.reload();
    enqueueSnackbar("Removed Successfully");
  }
  useEffect(() => {
    const sortByCriteria = (a, b) => {
      if (accsortingCriteria === "des") {
        return b - a;
      } else if (accsortingCriteria === "ass") {
        return a - b;
      } else {
        return 0;
      }
    };
    const sorted = [...pro].sort((a, b) => {
      if (typ === "cost") {
        return sortByCriteria(a.cost, b.cost);
      } else if (typ === "count") {
        return sortByCriteria(a.count, b.count);
      } else if (typ === "stockcount") {
        return sortByCriteria(a.stockcount, b.stockcount);
      } else {
        return sortByCriteria((a.cost) * (a.count), (b.cost) * (b.count));
      }
    });
    setsorted(sorted)
  }, [accsortingCriteria, pro])
  const handlehelp = (str) => {
    navigate(`/${typeo}/${str}`);
  }
  const handleEdit = async (id, index) => {
    const response = await fetch(`http://localhost:8080/api/edit/${typeo}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ id, type: selectValues[index] }),
      credentials: 'include',
    });
    if (response.ok) {
      enqueueSnackbar("Registration Successful", { variant: "success" });
      console.log(response);
      window.location.reload();
    } else if (response.status === 409) {
      const errorData = await response.json();
      enqueueSnackbar(errorData.error, { variant: "error" });
    } else {
      enqueueSnackbar("Registration Failed", { variant: "error" });
    }
  }
  const [inputValues, setInputValues] = useState(Array(sortedData.length).fill(''));
  const handleChangein = (index, e) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = e.target.value;
    setInputValues(newInputValues);
  };
  const handlestock = (id, topic, index) => {
    const inputValue = inputValues[index];
    if (inputValue <= 0) {
      enqueueSnackbar("Enter a Number greater than 0")
    }
    else {
      fetch(`http://localhost:8080/api/updatestock/${id}/${inputValue}/${topic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
      }).then((response) => {
        if (!response.ok) {
          throw new Error(`Error updating stock count: ${response.statusText}`);
        }
        return response.json();
      }).then((data) => {
        enqueueSnackbar(data.message, { variant: 'success' });
        window.location.reload();
      }).catch((error) => {
        console.error('Error updating stock count:', error);
        enqueueSnackbar('Error updating stock count', { variant: 'error' });
      });
    }      
  }
  const [selectValues, setSelectValues] = useState(user.map((item) => ""));
  const handleSelectChange = (index, value) => {
    const newSelectValues = [...selectValues];
    newSelectValues[index] = value;
    setSelectValues(newSelectValues);
  };
  const handleview = (comid, id, topic) => {
    localStorage.setItem('myID', comid);
    localStorage.setItem('rec', "");
    localStorage.removeItem('value');
    fetch(`http://localhost:8080/api/reminderdelete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ id: id, username: localStorage.getItem('username') }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Error deleting reminder: ${response.statusText}`);
      } return response.json();
    }).then((data) => {
      console.log(data);
      navigate(`/${typeo}/menext`);
      enqueueSnackbar("Reminder deleted successfully");
    }).catch((error) => {
      console.error('Error deleting reminder:', error);
    });
    navigate(`/${typeo}/menext`);
  }
  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }} >
            {jwt && ( 
        <>
      <div className="logout-button">
        {localStorage.getItem('type') === 'buyer' && (<>
          <img src={forpic} alt={forpic} style={{ height: '35px', marginLeft: '100px' }} />
          <button style={{ backgroundColor: "#5B0888" }} onClick={() => handlehelp("user")}>{username}</button>
          <select onChange={handleChange}
            style={{ backgroundColor: "#5B0888", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginRight: "5px" }}>
            <option>Weekend Delivery</option>
            <option value="Yes">Yes ✅</option>
            <option value="No">No ❌</option>
          </select>
          <select onChange={handleCategoryChange}
            style={{ backgroundColor: "#713ABE", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginRight: "5px" }}>
            <option>Category</option>
            <option value="Men">Men 👨</option>
            <option value="Women">Women 👩</option>
            <option value="Kids">Kids 👶</option>
          </select>
          <button style={{ backgroundColor: "#713ABE" }} onClick={() => handlehelp("help")}>Help❓</button>
        </>)}
        {(localStorage.getItem('type') === 'seller' || localStorage.getItem('type') === 'company') && (<>
          <select onChange={handleActionChange}
            style={{ backgroundColor: "#451952", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginLeft: "5px" }}>
            <option>Menu</option>
            <option value="Add">Remove</option>
            <option value="Draft">Add</option>
            <option value="Access">Access</option>
            <option value="Logout">Logout</option>
          </select>
        </>)}
        {localStorage.getItem('type') === 'buyer' && (<>
          <select onChange={handleActionChange}
            style={{ backgroundColor: "#793FDF", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginLeft: "5px" }}>
            <option>Menu</option>
            <option value="Back">Cart🛒</option>
            <option value="Logout">Logout</option>
          </select>
          <div style={{ marginLeft: "10px", backgroundColor: "#793FDF", borderRadius: "5px" }}>
            🛒{cart.length}
          </div>
          <button onClick={() => handlehelp("phone")} style={{ backgroundColor: "#7752FE" }}>Wishlist ⭐</button>
        </>)}
        {(localStorage.getItem('type') === 'access' || localStorage.getItem('type') === 'companyaccess') && (
          <button onClick={handlelogout}>Logout</button>
        )}
      </div>
      {localStorage.getItem('type') === 'buyer' && (<><>
        <div style={{ width: "350px", marginLeft: "800px" }}>
          {later.length > 0 && (<>
            {later.map((item, index) => (
              <LaterCard key={index} item={item} handlePayClick={(itemid) => handlePay(itemid)} />
            ))}
          </>)}
        </div>
        {Uniquereminder.length > 0 && (
          <div className="conrem" data-testid="Reminder">
            <Card style={{ backgroundColor: "#ccccff", paddingLeft: "20px", paddingRight: "20px", paddingBottom: "10px" }}>
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: ' #111' }}> Product Arrived</p>
              {(Uniquereminder).map((item, index) => (
                <tr key={index}>
                  <td>{item.topic}</td>
                  <td><button className="lob" style={{ marginLeft: "30px" }} onClick={() => handleview(item.combo_id, item.id, item.topic)}>View</button></td>
                </tr>
              ))}
            </Card>
          </div>
        )}
        {uniqueItems.length > 0 && (
          <><h2 style={{ marginLeft: "10px" }} data-testid="Title">RECOMMENDED PRODUCTS:</h2>
            <div className='class-contain' data-testid="Card">
              {uniqueItems.map((item, index) => ( 
                <>
                <CustomCard
                  key={index}
                  item={item}
                  handleView={(itemid) => handleRecommendation(itemid)}
                  showButton={true} />
              {uniqueItems.combo_id}</>))}
            </div>
          </>)}
      </> </>)}
      <div>
        {(localStorage.getItem('type') === 'seller' || localStorage.getItem('type') === 'company') && (<>
          <h2 style={{ marginLeft: "10px" }}>SOLD HISTORY:</h2>
          <div className="search-container">
            {renderInputField("text", "Search...", searchQuery, (e) => setSearchQuery(e.target.value), { marginLeft: "10px" }, "search-bar")}
            <select value={sortingCriteria}
              onChange={handleSortingChange}
              style={{
                height: '35px', backgroundColor: "#6666ff", borderRadius: "5px"
                , marginRight: "5px", color: "white", marginLeft: "800px"
              }}
            > <option value="">Sort</option>
              <option value="cost">By Cost</option>
              <option value="count">By Count</option>
              <option value="revenue">By Revenue</option>
            </select>
          </div>
          <div>
            <BarGraph data={sortedData} />
            <div style={{ width: "600px" }}>
              <h2 style={{ marginLeft: "20px" }}>Revenue:</h2>
              <PieChart data={sortedData} />
            </div>
              <BubbleGraph data={sortedData} />
          </div>
          {renderInputField("text", "Search...", searchQuery, (e) => setSearchQuery(e.target.value), { marginLeft: "10px" }, "search-bar")}
          <table className="purchase-history-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>Count</th>
                <th>Stock</th>
                <th>Add Stock</th>
              </tr>
            </thead>
            <tbody>
              {(sortedData).map((item, index) => (
                <tr key={index}>
                  <td>{item.topic}</td>
                  <td>{item.count}</td>
                  <td>{item.stockcount}</td>
                  <td>{renderInputField("number", "count", inputValues[index], (e) => handleChangein(index, e), { backgroundColor: "#E4F1FF", color: "black", border: "none", padding: "5px", width: "50px", borderRadius: "5px", marginTop: "10px", marginLeft: "10px", })}
                    <button onClick={() => handlestock(item.id, item.topic, index)} className="cart-button" >Add</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {(localStorage.getItem('type') === 'seller' || localStorage.getItem('type') === 'company') && (<>
            <h2>Users</h2>
            <table className="purchase-history-table">
              <thead>
                <tr>
                  <th>id</th>
                  <th>user</th>
                  <th>type</th>
                  <th>Remove</th>
                  <th>Edit</th>
                </tr>
              </thead>
              <tbody>
                {(user).map((item, index) => (
                  <tr key={index}>
                    <td>{item.id}</td>
                    <td>{item.username}</td>
                    <td>{item.type}</td>
                    <td><button className="cart-button" onClick={() => handleRemove(item.id)} >Remove</button></td>
                    <td><select
                      value={selectValues[index]}
                      onChange={(e) => handleSelectChange(index, e.target.value)}
                      style={{ backgroundColor: "#713ABE", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginTop: "10px", marginLeft: "10px" }}>
                      <option value="">Select Type</option>
                      <option value="cost">Cost</option>
                      <option value="count">Count</option>
                      <option value="revenue">Revenue</option>
                    </select>
                      <button className="cart-button" onClick={() => handleEdit(item.id, index)} >Edit</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>)}
        </>)}
        {(localStorage.getItem('type') === 'access' || localStorage.getItem('type') === 'companyaccess') && (<>
          <select
            value={accsortingCriteria}
            onChange={handleSortingChange1}
            style={{ height: '35px', backgroundColor: "#6666ff", borderRadius: "5px", marginRight: "5px", color: "white", marginLeft: "1100px" }}
          > <option value="">Sort</option>
            <option value="ass">Ascending</option>
            <option value="des">Descending </option>
          </select>
          <br /><br />
          <table className="purchase-history-table">
            <thead>
              <tr>
                <th>Topic</th>
                <th>{typ}</th>
              </tr>
            </thead>
            <tbody>
              {(sorted).map((item, index) => (
                <tr key={index}>
                  <td>{item.topic}</td>
                  <td>{typ === 'cost' ? item.cost : typ === 'count' ? item.count : item.count * item.cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>)}
      </div>
      </>
      )}
    </div>
  );
}
export default withLogoutHandler(HomePage);
