import React, {useState } from "react"; 
import { useSnackbar } from "notistack";
import './App.css'; 
import { useNavigate } from 'react-router-dom';
function Edituser() { 
const [typ,settyp] = useState(''); 
const id=localStorage.getItem("id");  
const type=localStorage.getItem('type');
const { enqueueSnackbar } = useSnackbar();
const navigate = useNavigate();
const handleChange5 = (e) => {
    const value = e.target.value;
    settyp(value);
   };

const back=()=>{
    navigate(`/${type}/homepage`);
}
const handleedit = async (event) => { 
    const response = await fetch(`http://localhost:8080/api/edit/${type}`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({id,type:typ}),
                  credentials: 'include',
                });
                if (response.ok) {
                    enqueueSnackbar("Registration Successful", { variant: "success" });    
                    console.log(response);  
                    navigate(`/${type}/homepage`); 
                    
                } else if (response.status === 409) {
                    const errorData = await response.json();
                    enqueueSnackbar(errorData.error, { variant: "error" });
                } else {
                    enqueueSnackbar("Registration Failed", { variant: "error" });
                }        
}
return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}>
    <div className="logout-button">
        <button  onClick={back}>
        Back To Home
        </button>
    </div> 
    <div className="app">
        <div className="login-page">
        <h2>Edit</h2> 
        <select
            value={typ}
            onChange={handleChange5} 
            style={{ backgroundColor: "#713ABE", color: "white", 
          border: "none", padding: "5px",borderRadius:"5px",marginRight:"5px" }}
          >
            <option value="">Select Type</option>
            <option value="cost">Cost</option>
            <option value="count">Count</option>
            <option value="revenue">Revenue</option>
            {/* Add more options as needed */}
          </select>             
        <button onClick={handleedit} className="lob">
                Edit</button> 
                
</div> 
</div>
</div>
);
}
export default Edituser;