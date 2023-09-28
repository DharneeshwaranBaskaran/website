import React, {useRef,useEffect, useState } from "react";
import backpic from "./images/backpic.jpg";
import { Button,Card, CardActions,CardContent,CardMedia,Rating,Typography,} from "@mui/material";
import { FaStar } from 'react-icons/fa'; 
import axios from "axios";
import ReactPlayer from 'react-player'; 
const VIDEO_PATH = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';
function Start({toregister,tologin}){ 
    const [data,setData]=useState([]); 
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
        axios.get("http://localhost:8080/api/start")
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching cart items:', error);
          });
      },[]);
    const playerRef = useRef(null);
    const uniqueItems = data.filter((item, index, self) =>
    index === self.findIndex((t) => t.name === item.name)
    );   
    return (
        <div style={{ backgroundImage: `url(${backpic})` , minHeight: "220vh" }}> 
        <div className="logout-button">
          <button onClick={() =>handletoregister(2)}>Register</button>
           <button onClick={() =>handletologin(2)}>Login</button>       
                </div>
               
        <h2 style={{textAlign:"center"}}> MOST PURCHASED PRODUCTS: </h2>
        <div  className='class-contain' >
            {(uniqueItems).map(item => (
         <div key={item.id} className='class'>
         <Card >
           <CardMedia component="img" image={item.url} alt="img" />
           <CardContent className="card-content" style={{ padding: '0px'}}>
             <Typography gutterBottom variant="h6">
               <p style={{textAlign:"center"}}>{item.name}</p>
             </Typography> 
             <div class="contain" style={{marginLeft: '25px'}}>
             <Typography gutterBottom fontWeight="bold">
               <p>${item.cost}</p>
             </Typography> 
             
             <Typography gutterBottom fontWeight="bold"> 
             <div className='star-Rating'>
             <FaStar size={15} color="black" />{item.rating}
             </div>    
             
             </Typography>
             </div>
           </CardContent>
           {/* <CardActions className="card-actions">
             <Button
               variant="contained"
               className="card-button"
               fullWidth
               onClick={() =>handleRecommendation(item.name)}>
               view
             </Button>
           </CardActions> */}
         </Card> 
         </div>
       ))}
        <div className="video-container">
          <ReactPlayer ref={playerRef} url={VIDEO_PATH} controls={true} /> 
        </div>
        
        </div ><div style={{textAlign:"center"}}>
        <h2>Want To Sell Your Product I Our Website: <br/>
         
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
