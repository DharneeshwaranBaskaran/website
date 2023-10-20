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
        else if(key==1)
        localStorage.setItem('type',"seller");
        else if(key==0){
        localStorage.setItem('type',"company");  
        }
        else if(key==4){
          localStorage.setItem('type',"companyaccess"); 
        }
        else
        localStorage.setItem('type',"access");
    }
    const handletoregister=(key)=>{
        toregister();
        if(key==2)
        localStorage.setItem('type',"buyer");
        else if(key==0){
        localStorage.setItem('type',"company");  
        }
        else
        localStorage.setItem('type',"seller");
    }
  
    const playerRef = useRef(null);
      
    useEffect(() => {
      axios.get(`http://localhost:8080/api/combodata`)
          .then((response) => {
              setData(response.data);
          })
          .catch((error) => {
              console.error('Error fetching history items:', error);
          });
  }, []);
  
  // Further down in your component
  const uniqueItems = Array.isArray(data)
      ? data.filter((item, index, self) =>
          index === self.findIndex((t) => t.topic === item.topic)
      )
      : [];
    return (
        <div style={{ backgroundImage: `url(${backpic})` , minHeight: "1080vh" }}> 
        <div className="logout-button">
          <button onClick={() =>handletoregister(2) }>Register</button>
           <button onClick={() =>handletologin(2)}>Login</button>       
                </div>
               
        <h2 style={{textAlign:"center"}}> MOST PURCHASED PRODUCTS: </h2>
        <div  className='class-contain' >
            {(uniqueItems).map(item => (
      
        <CustomCard
          key={item.id}
          item={item}
          handleView={(itemName) => handletomenex(itemName)}
           
        />
       ))}
       
       </div >
       <br/>
        <div className="video-container">
          <ReactPlayer ref={playerRef} url={VIDEO_PATH} controls={true} /> 
        </div>
        <div style={{ textAlign: "center" }}> 
        
        <h2>Want To Sell Your Product In Our Website: <br/>
        {/* <div>
           <h4>As Individual:</h4>
        <button className="lob" onClick={() => handletoregister(1)}>
                Register</button>
        <button className="lob" style={{marginLeft: '25px'}}  onClick={() => handletologin(1)}>
                Login</button>
                </div>
                <div>       
                 <h4>As Company:</h4>
        <button className="lob" onClick={() => handletoregister(0)}>
                Register</button>
        <button className="lob" style={{marginLeft: '25px'}}  onClick={() => handletologin(0)}>
                Login</button> 
                </div>   */}
                 <div class="registration-container">
                  <div class="individual-registration">
                    <h4>As Individual:</h4>
                    <button className="lob" onClick={() => handletoregister(1)}>Register</button>
                    <button className="lob" onClick={() => handletologin(1)}>Login</button>
                  </div>
                  <div class="company-registration">
                    <h4>As Company:</h4>
                    <button className="lob" onClick={() => handletoregister(0)}>Register</button>
                    <button className="lob" onClick={() => handletologin(0)}>Login</button>
                  </div>
                </div>
                 </h2> 
                 </div>
        {/* <div style={{textAlign:"center"}}>
        <h2>Are You a Database Viewer?<br/>
        <h4>Individual:</h4>
        <button className="lob" style={{marginLeft: '0px'}}  onClick={() => handletologin(3)}>
                Login</button>
                <h4>Company:</h4>
        <button className="lob" style={{marginLeft: '0px'}}  onClick={() => handletologin(4)}>
                Login</button>
                 </h2>
                 </div>  */}
                 <div style={{textAlign:"center"}}>
                  <h2>Are You a Database Viewer?</h2>
                  <div class="registration-container">
                  <div class="individual-registration">
                      <h4>Individual:</h4>
                      <button className="lob" style={{ marginLeft: '0px' }} onClick={() => handletologin(3)}>Login</button>
                    </div>
                    <div class="company-registration">
                      <h4>Company:</h4>
                      <button className="lob" style={{ marginLeft: '0px' }} onClick={() => handletologin(4)}>Login</button>
                    </div>
                  </div>
                </div>

        </div>     
    )
}
export default Start;
