import React, {useRef,useEffect, useState } from "react";
import backpic from "./images/backpic.jpg";
import ReactPlayer from 'react-player'; 
const VIDEO_PATH = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';
function Start({toregister,tologin}){ 
    const handletologin=()=>{
        tologin();
    }
    const handletoregister=()=>{
        toregister();
    }
    const playerRef = useRef(null); 
    return (
        <div style={{ backgroundImage: `url(${backpic})` , minHeight: "100vh" }}> 
        <div className="logout-button">
          <button onClick={handletoregister}>Register</button>
           <button onClick={handletologin}>Login</button>       
                </div>
                <div className="video-container">
          <ReactPlayer ref={playerRef} url={VIDEO_PATH} controls={true} /> 
        </div>
        </div>
    )
}
export default Start;