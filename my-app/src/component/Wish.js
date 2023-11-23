import React, { useEffect,useState } from 'react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
function Phone() {
  const { enqueueSnackbar } = useSnackbar();
  const [Items,setItems]=useState([]);
  const navigate = useNavigate(); 
  const username=localStorage.getItem("username");

  useEffect(() => {
      const logoutChannel = new BroadcastChannel('logoutChannel');
      logoutChannel.onmessage = () => {
        navigate("/start");
        localStorage.clear();
        window.location.reload();
        enqueueSnackbar("Logout Successful");
      };
    
    axios.get(`http://localhost:8080/api/wishlist/${username}`)
        .then((response) => {
            setItems(response.data);
        })
        .catch((error) => {
            console.error('Error fetching wish items:', error);
        });
  }, [username]);

  const removeItemFromCart = (id) => {
    axios
      .put(`http://localhost:8080/api/updatewish/${id}/${username}`)
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
      window.location.reload();localStorage.getItem("type")
      enqueueSnackbar(id+" removed from cart");
  };

  const home=()=>{
    navigate(`/${localStorage.getItem("type")}/homepage`);
  }

  const addtocart=(id)=>{
    axios.post(`http://localhost:8080/api/transferToCart/${id}`)
          .then((response) => {
              console.log(response.data);
              navigate(`/${localStorage.getItem("type")}/cart`); 
          })
          .catch((error) => {
              console.error('Error transferring data:', error);
          });
    console.log(id);
  }

  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
        <div className="logout-button"> 
        <button style={{backgroundColor:"#5B0888"}} onClick={home}>Home 🏠</button> 
        </div>
      <h2>Wishlist Collection</h2>
      <div  className='class-contain' >
      <table className="purchase-history-table">
        <thead>
          <tr>
            <th>Topic</th>
            <th>Count</th>
            <th>Cost</th>
            <th>Total Cost</th>
            <th>Add to Cart</th> 
            <th>Remove</th>
          </tr>
        </thead>
        <tbody>
          {Items.map((item, index) => (
            <tr key={index}>
              <td>{item.topic}</td>
              <td>{item.count}</td>
              <td>${item.cost}</td>
              <td>${item.cost * item.count}</td>
              <td><button className="cart-button" onClick={()=>addtocart(item.id)}>
                  Add to Cart</button></td>
                  <td><button className="cart-button" onClick={()=>removeItemFromCart(item.id)}>
                  remove</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default Phone;