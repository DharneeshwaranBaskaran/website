import React, { useEffect, useState } from "react";
import CustomCard from "./customcard";
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import './App.css';
import LaterCard from "./Latercard";
import { Card } from "@mui/material";
import Cookies from 'js-cookie';
import { BroadcastChannel } from "broadcast-channel";
function Buyhome() {
   const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [Items, setItems] = useState([]);
  const [reminder, setremider] = useState([]);
  const [Balance, setBalance] = useState(0);
  const [cart, setcart] = useState([]);
  const username = Cookies.get('username');
  let typeo = Cookies.get('type');
  const [later, setLater] = useState('');
  const [forpic, setforpic] = useState('');
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
        fetchData(`http://localhost:8080/api/balance/${username}`, setBalance);
        fetchData(`http://localhost:8080/api/historyhome/${username}`, setItems);
        fetchData(`http://localhost:8080/api/reminder/getItems/${username}`, setremider);
        fetchData(`http://localhost:8080/api/paylater/getpaylater/${username}`, setLater);
        console.log(username);
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
        Cookies.set('myID', id);
        Cookies.set('rec', "true");
        navigate(`/${typeo}/menext`);
      }
    
      const uniqueItems = Items.filter((item, index, self) => index === self.findIndex((t) => t.topic === item.topic));
      const Uniquereminder = reminder.filter((item, index, self) => index === self.findIndex((t) => t.topic === item.topic));
      const handleCategoryChange = (event) => {
        const categoryMap = { Men: 1, Women: 2 };
        const myRef = categoryMap[event.target.value] || 3;
        Cookies.set("myRef", myRef);
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
        Cookies.set("weekend", event.target.value === "No" ? "No" : "Yes");
      }
      const handleActionChange = (event) => {
        if (event.target.value == "Add")
          navigate(`/${typeo}/history`);
        else if (event.target.value == "Draft") {
          navigate(`/${typeo}/add`);
        } else if (event.target.value == "Access") {
          navigate(`/${typeo}/payment`);
        } else if (event.target.value == "Back") {
          navigate(`/${typeo}/cart`);
        } else {
          const broadcastChannel = new BroadcastChannel('logoutChannel');
          broadcastChannel.postMessage('logout');
          navigate("/start");
          const cookies = Cookies.get();
          for (const cookie in cookies) {
            Cookies.remove(cookie);
          }
          window.location.reload();
          enqueueSnackbar("Logout Successful");
        }
      };
    
      const handlehelp = (str) => {
        navigate(`/${typeo}/${str}`);
      }
  
      const handleview = (comid, id, topic) => {
        Cookies.set('myID', comid);
        Cookies.set('rec', "");
        Cookies.removeItem('value');
        fetch(`http://localhost:8080/api/reminderdelete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', },
          body: JSON.stringify({ id: id, username: Cookies.get('username') }),
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
    return(<>
    <div className="logout-button">
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
</div> 
<div>
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
</div>
    </>
    )}
export default Buyhome;