import React, { useEffect,useState ,useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack"; 
import withLogoutHandler from './withLogouthandler';
function Phone() {
  const { enqueueSnackbar } = useSnackbar();
  const [Items,setItems]=useState([]);
  const navigate = useNavigate(); 
  const username=localStorage.getItem("username");

  const fetchWishlist = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/wishlist/${username}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        console.error('Error fetching wish items:', response.statusText);
      }
    } catch (error) {
      console.error('Error fetching wish items:', error);
    }
  }, [username]);
  
  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);
  
  const removeItemFromCart = async (id) => {
      try {
        const response = await fetch(`http://localhost:8080/api/updatewish/${id}/${username}`, {
          method: 'PUT',
        });
    
        if (response.ok) {
          const updatedCartItems = Items.map((item) => {
            if (item.id === id) {
              return { ...item, state: true };
            }
            return item;
          });
          setItems(updatedCartItems);
          localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        } else {
          console.error('Error updating wish item:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating wish item:', error);
      }
      window.location.reload();localStorage.getItem("type")
      enqueueSnackbar(id+" removed from cart");
  };

  const home=()=>{
    navigate(`/${localStorage.getItem("type")}/homepage`);
  }

  const addtocart=async (id)=>{
  try {
    const response = await fetch(`http://localhost:8080/api/transferToCart/${id}`, {
      method: 'POST',
    });

    if (response.ok) {
      const responseData = await response.json();
      console.log(responseData);
      navigate(`/${localStorage.getItem("type")}/cart`);
    } else {
      console.error('Error transferring data:', response.statusText);
    }
  } catch (error) {
    console.error('Error transferring data:', error);
  }
  }

  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
        <div className="logout-button"> 
        <button style={{backgroundColor:"#5B0888"}} onClick={home}>Home 🏠</button> 
        </div>
      <h2 data-testid="PRODUCTS">Wishlist Collection</h2>
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

export default withLogoutHandler(Phone);