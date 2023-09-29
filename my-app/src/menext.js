import React, {useEffect, useState } from 'react'; 
import { Box, Card } from '@mui/material';
import { FaStar } from 'react-icons/fa'; 
import ReactImageMagnify from "react-image-magnify";
import { useSnackbar } from "notistack";
import axios from 'axios';
function Menext({back,cart,rechome}) {
    const [imageData, setImageData] = useState({});
    const targetImageId = localStorage.getItem('myID');
    const [Items, setItems] = useState([]);
    const [formData, setFormData] = useState({
      name: '',
      email: ''
    });
    let state=localStorage.getItem('rec');
    const [count, setCount] = useState(0); 
    const { enqueueSnackbar } = useSnackbar();

    let Username=localStorage.getItem("username");
    let type=localStorage.getItem('type');
    const handleback=()=>{
        back();
    } 
    
    const viewcart=()=>{
      cart();
    }
    const handlebackfromrec=()=>{
      rechome();
    }
    useEffect(() => {
      axios.get(`http://localhost:8080/api/cart/getItems/${Username}`)
        .then((response) => {
          setItems(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }, [Username]);
    const handlecart = () => {
      if (count > 0) {
        const cartItem = {
          topic: imageData.topic,
          description: imageData.description,
          cost: imageData.cost,
          count: count,
          username: localStorage.getItem("username"), 
          rating:imageData.rating,
          url:imageData.url,
          person:imageData.person,
          seller:imageData.seller

        };
        console.log(cartItem);
        const existingCartItems = (Items) || [];
        const existingIndex = existingCartItems.findIndex(item => item.topic === cartItem.topic);
        if (existingIndex !== -1) { 
          enqueueSnackbar("Already in cart Incrementing The count",{ variant:"success"});
          fetch(`http://localhost:8080/api/update/${cartItem.topic}/${Username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartItem),
            })
                .then(response => {
                    if (response.status === 201) {
                        enqueueSnackbar(`${count} ${imageData.topic}(s) added to the cart.`, { variant:"success"}); 
                        console.log(cartItem);
                        setCount(0);
                        cart();
                    } else {
                        
                    }
                })
                .catch(error => {
              
                });
    
          
          existingCartItems[existingIndex].count += count;
        } else {
          fetch('http://localhost:8080/api/cart/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cartItem),
            })
                .then(response => {
                    if (response.status === 201) {
                        enqueueSnackbar(`${count} ${imageData.topic}(s) added to the cart.`, { variant:"success" }); 
                        console.log(cartItem);
                        setCount(0);
                        cart();
                    } else {
                       
                    }
                })
                .catch(error => {
                   
                });
    
          existingCartItems.push(cartItem);
        }
        localStorage.setItem('cartItems', JSON.stringify(existingCartItems)); 
 
        setCount(0);
        cart(); 
        enqueueSnackbar(`${count} ${imageData.topic}(s) added to the cart.`,{ variant:"success" });
      
        const username = localStorage.getItem('username');
        
        } else {
        enqueueSnackbar("Please select at least one item before adding to cart.",{ variant:"warning" });
        
      }
    };
    
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Form submitted with data:', formData);
    };
    const divStyle = {
        backgroundColor: 'lightgrey',
        padding: '20px',
        border: '2px solid black',
        width:'300px',
        height:'auto',
        padding:40
    };
     
    function increment() {   
        setCount(function (prevCount) {
          return (prevCount += 1);
      });
    }
    function decrement() {
        setCount(function (prevCount) {
          if (prevCount > 0) {
            return (prevCount -= 1); 
          } else {
            return (prevCount = 0);
          }
      });
    }
      let link="http://localhost:8080/api/combo";
      
          useEffect(() => {
            fetch(link)
              .then(response => response.json())
              .then(data => {
                const image = data.find(item => item.topic === (targetImageId));
                if (image) {
                  setImageData(image);
                } else {
                  console.error(`Image data for id ${targetImageId} not found.`);
                }
              })
              .catch(error => console.error('Error fetching data:', error));
          }, []);
          let backButton = null;
          if (state !== "true") { 
            backButton = (
              <button onClick={handleback}>Back</button>
            );
          }
          else{
            backButton = (
              <button onClick={handlebackfromrec} >Back To Home</button>
            );
          }
          let cartButton = null; 
          let addButton=null; 
          let countButton=null;
      if (type=="buyer") { 
        cartButton = (
          <button onClick={viewcart} >View Cart</button>
         );
         addButton=(<button type="submit" 
         className="lob"onClick={handlecart} 
         >Add To Cart</button>)
         countButton=(<div className='contain1'>
         <button onClick={decrement} style={{ 
                 backgroundColor: "darkgrey", }}>-</button>
          <h1>{count}</h1>
           <button onClick={increment} style={{ 
                 backgroundColor: "darkgrey", }}>+</button>
         </div>)
      }  
    return (
      <div style={{ backgroundColor:"#f0f0f0", minHeight: "100vh"}}>
        
        <div className="logout-button"> 
        {cartButton}
{/*           
          <button onClick={viewcart} style={{ 
                      backgroundColor: "darkgrey", }}>View Cart</button> */}
          {/* <button onClick={handleback} style={{ 
                    backgroundColor: "darkgrey", }}>Back</button> */}
                    {backButton}
        </div>   
        <br />
        <div class="contain">
        <div id="mag">
          <ReactImageMagnify
            {...{
              smallImage: {
                alt: imageData.topic,
                isFluidWidth: true,
                src: imageData.url,
              },
              largeImage: {
                src: imageData.url,
                width: 1200,
                height: 1800,
              },
            }}
          />
          </div>
          <div>
        <Card onSubmit={handleSubmit}  style={divStyle}>
        <h1>{imageData.topic} </h1>
        <h2>{imageData.description}</h2>  
        <h3>${imageData.cost}</h3>   
            {countButton}
            <Box>
            <div className='star-Rating'>
            <FaStar size={15} color="black" />{imageData.rating}
            </div>
            </Box> 
            <br />
            {addButton}
        </Card>
        </div>
        </div>
        <br />
      </div>
  )
  
}
export default Menext;
