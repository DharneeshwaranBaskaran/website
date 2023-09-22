import React, {useRef,useEffect, useState } from "react";
import ReactPlayer from 'react-player'; 
import Video from "./sam.mp4";
import axios from "axios";
import { useSnackbar } from "notistack";
const VIDEO_PATH = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';
function HomePage({click,tocart,homelog,reco}) {
  const { enqueueSnackbar } = useSnackbar();
  const [Items,setItems]=useState([]);
  const username = localStorage.getItem('username'); 
  let type=localStorage.getItem('type');
    const redirecttocart=()=>{
       tocart(); 
       enqueueSnackbar("Redirecting to cart",{ variant:"default"});
    };
    const handleRedirect = (id) => {
      localStorage.setItem('myRef', id);
      click();
    };
    const handleRecommendation = (id)=>{
     
      localStorage.setItem('myID', id); 
      localStorage.setItem('rec',"true");
      reco();
    }
    const playerRef = useRef(null); 
    const logout=()=>{
      localStorage.removeItem('username');
      window.location.reload()
      localStorage.removeItem("token");

    }
    useEffect(() => {
      axios.get(`http://localhost:8080/api/historyhome/${username}`)
          .then((response) => {
              setItems(response.data);
          })
          .catch((error) => {
              console.error('Error fetching history items:', error);
          });
    }, [username]);
    const uniqueItems = Items.filter((item, index, self) =>
    index === self.findIndex((t) => t.name === item.name)
    );  
    let backButton = null;
      if (type=="buyer") { 
        backButton = (
          <button onClick={redirecttocart} style={{ 
            backgroundColor: "darkgrey", 
            }}>View Cart</button>
         );
      }
    return (
      <div style={{ 
        backgroundColor: "lightgrey", 
        }}> 
          <div className="logout-button">
            <button style={{ 
                    backgroundColor: "darkgrey", 
                    }}>{username}</button>
            {backButton}
            
            <button onClick={logout} style={{ 
                    backgroundColor: "darkgrey", 
                    }}>
              Logout
            </button> 
          </div>
        <div>
          <button className="but" onClick={() => handleRedirect(1)} >Men</button>
          <button className="but" onClick={() => handleRedirect(2)}>Women</button>
          <button className="but" onClick={() => handleRedirect(3)}>Kids</button>
        </div>
        {uniqueItems.length > 0 && (
        <div className="rec" style={{ maxHeight: "120px", overflowY: "auto" }}>
          <div style={{ margin: 25 }}><h3>Recommendation</h3></div>
          <ul>
            {uniqueItems.map((item, index) => (
              <li className="cart-item" key={index}>
                <div className="cart-item-name">{item.name}</div>
                <button className="lob" onClick={() =>handleRecommendation(item.name)}>View</button>
              </li>
            ))}
          </ul>
        </div>
      )}
          <div className="video-container">
          <ReactPlayer ref={playerRef} url={VIDEO_PATH} controls={true} /> 
        </div>
        <div>
          <center>
            <video width="50%" height="50%" controls>
              <source src={Video} type="video/mp4" />
            </video>
          </center>
        </div>
      </div>
    );
  } 
  export default HomePage;