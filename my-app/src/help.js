import React from "react";
import { useNavigate } from 'react-router-dom';
function Help() { 
    let type=localStorage.getItem('type');
    const navigate = useNavigate();
  const handleback=()=>{
    navigate(`/${type}/homepage`);
  }
  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>  
    <div className="logout-button"> 
        <button onClick={handleback}>Home</button>
    </div>
    </div>
  );
}

export default Help;