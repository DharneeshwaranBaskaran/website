import React, {useEffect, useState } from 'react'; 
import { Box, Card } from '@mui/material';
import { FaStar } from 'react-icons/fa'; 
import ReactImageMagnify from "react-image-magnify";
import { useSnackbar } from "notistack";
import axios from 'axios';

import { FiVideo, FiImage } from 'react-icons/fi';
import ReactPlayer from 'react-player'; 
function Menext({back,cart,rechome,star}) {

    const videoUrl = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';
    const videoId = videoUrl.split('v=')[1];
    const [showModal, setShowModal] = useState(false);
    const [comment, setComment] = useState('');  
      const toggleModal = () => {
        setShowModal(!showModal);
      };
    const [imageData, setImageData] = useState({});
    const targetImageId = localStorage.getItem('myID');
    const [Items, setItems] = useState([]); 
    const [Item,setItem]=useState([]);
    const [isImage, setIsImage] = useState(true);
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
    const tostart=()=>{
       star();  
       
       localStorage.setItem('type',"buyer"); 
       enqueueSnackbar("Register",{ variant:"default" });
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
        backgroundColor: '#ccccff',
        padding: '12px',
        border: '2px solid black',
        width:'300px',
        height:'auto',
        // padding:15,
        borderRadius:'5px'
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
    const handleToggleImage = () => {
      setIsImage(true);
    };
    const handleToggleVideo = () => {
      setIsImage(false);
    };
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
          let purchase= null;
          if (state !== "true") { 
            if(localStorage.getItem('value')==""){
              backButton=null; 
              purchase = (
                <button className="lob" onClick={tostart}>Purchase</button>
              );
            }else{
            backButton = (
              <button onClick={handleback}>Back</button>
            );
          }
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
         className="lob" onClick={handlecart} 
         >Add To Cart</button>)
         countButton=(<div className='contain1'>
         <button onClick={decrement} style={{ 
                 backgroundColor: "#6666ff", }}>-</button>
          <h1>{count}</h1>
           <button onClick={increment} style={{ 
                 backgroundColor: "#6666ff", }}>+</button>
         </div>)
      }  
      const handleChangepass = (event) => {
        const value = event.target.value;
        setComment(value);
      };
      const addData = async () => {    
        if(comment==""){
          enqueueSnackbar("Enter your comment");
        }         
        else{
        const response = await fetch('http://localhost:8080/api/addcomment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({topic:imageData.topic,comment,username:Username}),
          credentials: 'include',
        });  
        
        console.log(Item);
        if (response.ok ) {
          enqueueSnackbar("Comment Added Sucessfully",{ variant:"success" });  
          setShowModal(!showModal);
            }
        else if (response.status === 409) {
              const errorData = await response.json();
              enqueueSnackbar(errorData.error,{variant:"error"});
            }    
          }
      };  
      const view =async()=>{
        axios.get(`http://localhost:8080/api/comments/${imageData.topic}`)
        .then((response) => {
          setItem(response.data); 
          if(response.data.length<1){
            enqueueSnackbar("No Comments Available");
          }
        })
        .catch((error) => {
          console.error('Error fetching history items:', error);
        });

    };
    return (
      <div style={{ backgroundColor:"#e5e5ff", minHeight: "100vh",overflowX: "hidden",overflowY: "hidden"}}>
        
        <div className="logout-button"> 
        {cartButton}

                    {backButton}
        </div>   
        <br />
        <div class="contain">
        <div id="mag">
        <div class="containimg">
      
        <div className='vim' style={{
             border: "2px solid #ccccff", // Add a black border
             backgroundColor: '#ccccff',
            //  display: '', // Make sure the div is displayed as an inline-block
             padding: '5px',
             borderRadius:'5px'}}>
            <img
              src={imageData.url}
              alt={imageData.topic}
              onClick={handleToggleImage}
              
              style={{ cursor: 'pointer',height:'100px',
               paddingTop: '10px',paddingBottom:'10px',
              }}
            />
         
            <FiVideo
              size={50}
              color="black"
              onClick={handleToggleVideo}
              style={{ cursor: 'pointer' }}
            />
            </div>
         
          {isImage ? (
            <div>
            <ReactImageMagnify style={{maxWidth:"500px"}}
              smallImage={{
                alt: imageData.topic,
                isFluidWidth: true,
                src: imageData.url,
                
                
              }}
              largeImage={{
                src: imageData.url,
                width: 1200,
                height: 1800,
              }}
            />
            </div>
          ) : (
          
          <iframe
        width="600"
        height="337.5"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube Video Player"
        
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
         )}
          
          </div>
          </div>
          <div>
        <Card onSubmit={handleSubmit}  style={divStyle}> 
        
        <h1  style={{ fontSize: '24px', fontWeight: 'bold', color: ' #111' }}>{imageData.topic} </h1>
        <h2 style={{ fontSize: '18px', color: '#333' }}>{imageData.description}</h2>  
        <h3 style={{ fontSize: '20px', color: '#222' }}>${imageData.cost}</h3>   
            {countButton}
            <Box>
            <div className='star-Rating'>
            <FaStar size={15} color="black" />{imageData.rating}
            </div>
            </Box> 
            <br />
            {addButton} 
            {purchase}
            <button onClick={toggleModal} className="lob"
            style={{
            marginLeft:"5px"}}>Comment</button>

      {showModal && (
        <div>
              <div className="con"> 
              <input
                type="text"
                placeholder="Comment"
                value={comment}
                onChange={handleChangepass}
              />
              <button type="submit" className="lob" onClick={addData}>Add Comment</button>
          </div>
         </div>
      )}
        </Card>
        <br/>
        <button onClick={view} className="lob"
            style={{
            marginLeft:"5px"}}>View Comments</button>
        {Item.length > 0 && (
         <> 
         <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: ' #111' }}>Comments</h2>
         
        <Card  style={divStyle}>
        {Item.map(item => (          
          <p style={{marginLeft:"5px",fontSize: '18px', color: '#333'}}>{item.username}:{item.comment}</p>
        ))}
        </Card>
        </> 
        )} 
         
        </div>
        </div>
        <br />
      </div>
  )
  
}
export default Menext;
