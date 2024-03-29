import React, { useEffect, useState } from 'react';
import { Box, Card } from '@mui/material';
import { FaStar } from 'react-icons/fa';
import ReactImageMagnify from "react-image-magnify";
import { useSnackbar } from "notistack";
import '../../App.css';
import { FiVideo } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom'; 
import withLogoutHandler from '../../components/hoc/withLogouthandler';
import Cookies from 'js-cookie';
import "./men.css";
function Menext() {
  const navigate = useNavigate();
  const videoUrl = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';
  const videoId = videoUrl.split('v=')[1];
  const [showModal, setShowModal] = useState(false);
  const [comment, setComment] = useState('');
  const [imageData, setImageData] = useState({});
  const targetImageId = (Cookies.get('myID'));
  const [Items, setItems] = useState([]);
  const [wish, setwish] = useState([]);
  const [Item, setItem] = useState([]);
  const [isImage, setIsImage] = useState(true);
  const [count, setCount] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  let Username = Cookies.get("username");
  let state = Cookies.get('rec');
  let type = Cookies.get('type');
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handleback = (page) => {
    navigate(`/${type}/${page}`);
  }
  const tostart = () => {
    navigate(`/buyer/register`);
    Cookies.set('type', "buyer");
    enqueueSnackbar("Register", { variant: "default" });
    setTimeout(window.location.reload(), 1000);
  }
  useEffect(() => {
    fetch(`http://localhost:8080/cart/getItems/${Username}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } return response.json();
  }).then(data => {
    setItems(data);
  }).catch(error => {
    console.error('Error fetching cart items:', error);
  });
  }, [Username]);
  const weekends = Cookies.get("weekend") === "Yes" ? "Yes" : "No";
  useEffect(() => {
    fetch(`http://localhost:8080/wishlist/${Username}`)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    } return response.json();
  }).then(data => {
    setwish(data);
  }).catch(error => {
    console.error('Error fetching wishlist items:', error);
  });
  }, [Username]);
  const handleAction = (url,updateurl, successMessage, errorMessage,ty,page) => {
    if (count > 0) {
      const cartItem = {
        id: imageData.id,topic: imageData.topic,description: imageData.description,cost: imageData.count === 0 ? imageData.cost * 0.9 : imageData.cost,count,
        username: Cookies.get("username"),rating: imageData.rating,url: imageData.url,person: imageData.person,seller: imageData.seller,weekend: weekends,
      }; 
      console.log(cartItem);
      const existingCartItems = (ty) || [];
      const existingIndex = existingCartItems.findIndex((item) => item.topic === cartItem.topic);
      if (existingIndex !== -1) {
        fetch(`${updateurl}/${cartItem.id}/${Username}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(cartItem),
        })
          .then((response) => {
            if (response.status === 201) {
              response.text().then((message) => {
                enqueueSnackbar(message, { variant: 'success' });
                setCount(0);
                navigate(`/${type}/${page}`);
                setTimeout(window.location.reload(), 1000);
              });
            } else if (response.status === 400) {
              response.text().then((errorMessage) => {
                enqueueSnackbar(errorMessage, { variant: 'error' });
              });
            }
          })
          .catch((error) => {});
        existingCartItems[existingIndex].count += count;
      } else {
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cartItem),
        })
          .then((response) => {
            if (response.status === 201) {
              enqueueSnackbar(`${count} ${imageData.topic}(s) ${successMessage}.`, { variant: 'success' });
              setCount(0);
              navigate(`/${type}/${page}`);
            } else if (response.status === 400) {
              response.text().then((errorMessage) => {
                enqueueSnackbar(errorMessage, { variant: 'error' });
              });
            }
          })
          .catch((error) => {
            enqueueSnackbar(error);
          });
  
        existingCartItems.push(cartItem);
      }
      Cookies.set('cartItems', JSON.stringify(existingCartItems));
      setCount(0);
      navigate(`/${type}/${page}`);
      setTimeout(window.location.reload(), 1000);
    } else {
      enqueueSnackbar(`Please select at least one item before adding to ${successMessage.toLowerCase()}.`, {
        variant: 'warning',
      });
    }
  };
  const handlewish = () => {
    handleAction('http://localhost:8080/api/wish/add','http://localhost:8080/api/update/wish', 'added to the wish', 'Error adding to wish',wish,"phone");
  };
  const handlecart = () => {
    handleAction('http://localhost:8080/api/cart/add','http://localhost:8080/api/update/cart', 'added to the cart', 'Error adding to cart',Items,"cart");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const divStyle = {backgroundColor: '#ccccff', padding: '12px', border: '2px solid black', width: '300px', height: 'auto', borderRadius: '5px'};
  function increment() {
    setCount((prevCount) => prevCount + 1);
  }
  function decrement() {
    setCount((prevCount) => Math.max(prevCount - 1, 0));
  }
  const handleToggleImage = () => {
    setIsImage(true);
  };
  const handleToggleVideo = () => {
    setIsImage(false);
  };
  let link = "http://localhost:8080/api/combodata";
  useEffect(() => {
    
    fetch(link)
      .then(response => response.json())
      .then(data => {
        const image = data.find(item => item.id == (Cookies.get('myID')));
        if (image) {
          setImageData(image);
        } else {
          console.error(`Image data for id ${typeof (targetImageId)} not found.`);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  let backButton = null;
  let purchase = null;
  if (state !== "true") {
    if (Cookies.get('value') == "") {
      backButton = null;
      purchase = (
        <button className="lob" onClick={tostart}>Purchase</button>
      );
    } else {
      backButton = (
        <button onClick={()=>handleback("homepage")} className='purple'>Back </button>
      );
    }}
  else {
    backButton = (
      <button onClick={()=>handleback("homepage")} className='purple'>Back To Home </button>
    );
  }
  let cartButton = null,addButton = null,countButton = null,Wishlist = null;
  if (type == "buyer") {
    cartButton = (<button onClick={()=>handleback("cart")} className='purple'>View Cart</button>);
    addButton = (<button type="submit" className="lob" onClick={handlecart}>Add To Cart</button>)
    Wishlist = (<button type="submit" className="lob wishbut"  onClick={handlewish}>Wishlist</button>)
    countButton = (<div className='contain1'>
      <button onClick={decrement} className='inde'>-</button>
      <h1>{count}</h1>
      <button onClick={increment} className='inde'>+</button>
    </div>)
  }

  const handleChangepass = (event) => {
    const value = event.target.value;
    setComment(value);
  };

  const addData = async () => {
    if (comment == "") {
      enqueueSnackbar("Enter your comment");
    }
    else {
      const response = await fetch('http://localhost:8080/api/addcomment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: imageData.topic, comment, username: Username ,id:imageData.id}),
        credentials: 'include',
      });
      if (response.ok) {
        enqueueSnackbar("Comment Added Sucessfully", { variant: "success" });
        setShowModal(!showModal);
      }
      else if (response.status === 409) {
        const errorData = await response.json();
        enqueueSnackbar(errorData.error, { variant: "error" });
      }
    }
  };

  const view = async () => {
    fetch(`http://localhost:8080/api/comments/${imageData.id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }return response.json();
    }) .then(data => {
      setItem(data);
      if (data.length < 1) {
        enqueueSnackbar("No Comments Available");
      }
    }) .catch(error => {
      console.error('Error fetching comments:', error);
    });
  };

  const renderDiscountAmount = () => {
    if (imageData.count > 0) {
      return (
        <h3 className='costh'>Actual Cost: ${imageData.cost}</h3>
      );
    } else {
      return (
        <h3 className='costh'>Discount Cost: ${imageData.cost * 0.9}</h3>
      );
    }
  };

  return (
    <div className='menextbackground'>
      <div className="logout-button">
        {cartButton}
        {backButton}
      </div>
      <br />
      <div class="contain">
        <div id="mag">
          <div class="containimg">
            <div className='vim' >
              <img
                src={imageData.url}
                alt={imageData.topic}
                onClick={handleToggleImage}
                className='im'
              />
              <FiVideo
                size={50}
                color="black"
                onClick={handleToggleVideo}
                className='v'
              />
            </div>
            {isImage ? (
              <div>
                <ReactImageMagnify  
                className='magnify'
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
        <div data-testid="custom-card">
          <Card onSubmit={handleSubmit} style={divStyle}>
            <h1 className='topic'>{imageData.topic} </h1>
            <h2 className='des'>{imageData.description}</h2>
            <h2 className='quantity'>Quantity:{imageData.stockcount} pieces</h2>
            {renderDiscountAmount()}
            {countButton}
            <Box>
              <div className='star-Rating'>
                <FaStar size={15} color="black" />{imageData.rating}
              </div>
            </Box>
            <br />
            {addButton}
            {Wishlist}
            {purchase}
            <button onClick={toggleModal} className="lob wishbut">Comment</button>
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
          <br />
          <button onClick={view} className="lob wishbut" >View Comments</button>
          {Item.length > 0 && (<>
              <h2 className='comh'>Comments</h2>
              <Card style={divStyle}>
                {Item.map(item => (
                  <p className='comp'>{item.username}:{item.comment}</p>
                ))}
              </Card>
            </>)}
        </div>
      </div>
      <br />
     
    </div>
  )
}
export default withLogoutHandler(Menext);
