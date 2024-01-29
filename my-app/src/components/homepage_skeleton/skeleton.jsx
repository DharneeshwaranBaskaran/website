import React from "react";
import { Card } from "@mui/material";
import Cookies from 'js-cookie';
import '../../App.css';

const Skeleton = (item) => {
    return (
        <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}> 
            {(!Cookies.get('username'))&&(
                <><div className="app">
                <div className="login-page">
                  
                </div>
              </div></>
            )}
            {(Cookies.get('type') !== 'buyer') && (<>
                <div className="logout-button">
                    <select
                        style={{ backgroundColor: "#451952", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginLeft: "5px" }}>
                    </select>
                </div>
                <h2 style={{ marginLeft: "10px" }}>SOLD HISTORY:</h2>
                <div className="search-container">
                    <select
                        style={{ height: '35px', backgroundColor: "#6666ff", borderRadius: "5px", marginRight: "5px", color: "white", marginLeft: "800px" }}>
                    </select>
                </div>
                <div key={item.id} className='selclass'>
                    <Card>
                        <div style={{ height: "400px" }}></div>
                    </Card>
                </div>
            </>)}
            {(Cookies.get('type') === 'buyer') && (<>
                <div className="logout-button">
                    <img src={""} alt={""} style={{ height: '35px', marginLeft: '100px' }} />
                    <button style={{ backgroundColor: "#5B0888" }}></button>
                    <select
                        style={{ backgroundColor: "#5B0888", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginRight: "5px" }}>
                    </select>
                    <select
                        style={{ backgroundColor: "#713ABE", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginRight: "5px" }}>
                    </select>
                    <button style={{ backgroundColor: "#713ABE" }} > </button>
                    <select
                        style={{ backgroundColor: "#793FDF", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginLeft: "5px" }}>
                    </select>
                    <div style={{ marginLeft: "10px", backgroundColor: "#793FDF", borderRadius: "5px" }}>
                    </div>
                    <button style={{ backgroundColor: "#7752FE" }}></button>
                </div>
                <div></div>
                <div key={item.id} className='class'>
                    <Card>
                        <div style={{ height: "400px" }}></div>
                    </Card>
                </div>
            </>)}
        </div>
    );
};

export default Skeleton;
