import React, { useEffect,useState ,useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack"; 
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from 'js-cookie';
function Phone() {
  const { enqueueSnackbar } = useSnackbar();
  const [Items,setItems]=useState([]);
  const navigate = useNavigate(); 
  const username=Cookies.get("username");
  const { jwt, setjwt } = useLoginContext();
  const fetchWishlist = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8080/wishlist/${username}`);
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
        const response = await fetch(`http://localhost:8080/updatewish/${id}/${username}`, {
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
          Cookies.set('cartItems', JSON.stringify(updatedCartItems));
        } else {
          console.error('Error updating wish item:', response.statusText);
        }
      } catch (error) {
        console.error('Error updating wish item:', error);
      }
      window.location.reload();Cookies.get("type")
      enqueueSnackbar(id+" removed from cart");
  };

  const home=()=>{
    navigate(`/${Cookies.get("type")}/homepage`);
  }

  const addtocart = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/transferToCart/${id}`, {
        method: 'POST',
      });
  
      if (response.ok) {
        const responseData = await response.text();  
        navigate(`/${Cookies.get("type")}/cart`);
      } else {
        console.error('Error transferring data:', response.statusText);
      }
    } catch (error) {
      console.error('Error transferring data:', error);
    }
  };
  

  return (
    <div  className="backgroundcol">
      {jwt ==Cookies.get('token')&& ( 
        <>
        <div className="logout-button"> 
        <button  onClick={home}>Home</button> 
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
    </>)}
    </div>
  );
}

export default withLogoutHandler(Phone);