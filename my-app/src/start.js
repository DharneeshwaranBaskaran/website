import React, {useRef,useEffect, useState } from "react";
import backpic from "./images/backpic.jpg";
import { Button,Card, CardActions,CardContent,CardMedia,Rating,Typography,} from "@mui/material";
import { FaStar } from 'react-icons/fa'; 
import axios from "axios";
import ReactPlayer from 'react-player'; 
import CustomCard from "./customcard";
const VIDEO_PATH = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';
function Start({toregister,tologin,startmen}){ 
    const [data,setData]=useState([]); 
    const handletomenex=(id)=>{
      localStorage.setItem('myID', id); 
      localStorage.setItem('rec',"");
      localStorage.setItem('value',"");
      startmen();
    }
    const handletologin=(key)=>{
        tologin(); 
        if(key==2)
        localStorage.setItem('type',"buyer");
        else
        localStorage.setItem('type',"seller");
    }
    const handletoregister=(key)=>{
        toregister();
        if(key==2)
        localStorage.setItem('type',"buyer");
        else
        localStorage.setItem('type',"seller");
    }
    useEffect(() => {
        axios.get("http://localhost:8080/api/combo")
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching cart items:', error);
          });
      },[]);
    const playerRef = useRef(null);
    const uniqueItems = data.filter((item, index, self) =>
    index === self.findIndex((t) => t.topic === item.topic)
    );   
    return (
        <div style={{ backgroundImage: `url(${backpic})` , minHeight: "980vh" }}> 
        <div className="logout-button">
          <button onClick={() =>handletoregister(2)}>Register</button>
           <button onClick={() =>handletologin(2)}>Login</button>       
                </div>
               
        <h2 style={{textAlign:"center"}}> MOST PURCHASED PRODUCTS: </h2>
        <div  className='class-contain' >
            {(uniqueItems).map(item => (
      
        <CustomCard
          key={item.id}
          item={item}
          handleView={(itemName) => handletomenex(itemName)}
           // Don't show the button
        />
       ))}
       
       </div >
       <br/>
        <div className="video-container">
          <ReactPlayer ref={playerRef} url={VIDEO_PATH} controls={true} /> 
        </div>
        <div style={{textAlign:"center"}}>
        <h2>Want To Sell Your Product In Our Website: <br/>
         
        <button className="lob" onClick={() => handletoregister(1)}>
                Register</button>
        <button className="lob" style={{marginLeft: '25px'}}  onClick={() => handletologin(1)}>
                Login</button>
                 </h2>
                 </div>
        </div>
    )
}
export default Start;
