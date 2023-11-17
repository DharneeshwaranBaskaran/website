import React, { useState,useEffect } from "react";
import { useSnackbar } from "notistack";
import axios from 'axios';
import './App.css'; 
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
function Payment() {
const navigate = useNavigate();
let Username=localStorage.getItem('username');
const [Balance,setBalance]=useState(0);
const { enqueueSnackbar } = useSnackbar();
const [cost,setcost]=useState();
const [email,setEmail]=useState('');
const [username, setUsername] = useState('');
const [type,setType]=useState('');
const typeo=localStorage.getItem('type');
const [csvData, setCsvData] = useState([]);
const [formData, setFormData] = useState(new FormData());
const handlebacktohomefrompay=()=>{
  enqueueSnackbar("Redirecting to homepage",{variant:"default"});
  navigate(`/${typeo}/homepage`);
}

useEffect(() => {

    const logoutChannel = new BroadcastChannel('logoutChannel');
    logoutChannel.onmessage = () => {
      // Perform the local logout actions
      navigate("/start");
      localStorage.clear();
      window.location.reload();
      enqueueSnackbar("Logout Successful");
    };
 
axios.get(`http://localhost:8080/api/balance/${Username}`)
      .then((response) => {
        const data = response.data;
        setBalance(data);
      })
      .catch((error) => {
        // console.error('Error fetching data:', error);
      });
  }, [Username]);
  
    const selectedValue=localStorage.getItem("type");
 
  const handleRegister = async (event) => { 
        if(selectedValue=="seller"){
        const response = await fetch(`http://localhost:8080/api/register/access`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username,email,type,provider:Username}),
          credentials: 'include',
        });
        if (response.ok) {
            enqueueSnackbar("Access Given Successfully", { variant: "success" });
            navigate(`/${typeo}/homepage`);
            console.log(response); 
            
            
        } else if (response.status === 409) {
            const errorData = await response.json();
            enqueueSnackbar(errorData.error, { variant: "error" });
        } else {
            enqueueSnackbar("Registration Failed", { variant: "error" });
        }        
      }
      else{
        const response = await fetch(`http://localhost:8080/api/register/companyaccess`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username,email,type,provider:Username}),
          credentials: 'include',
        });
        if (response.ok) {
            enqueueSnackbar("Access Given Successfully", { variant: "success" });
            navigate(`/${typeo}/homepage`);
            console.log(response); 
            
            
        } else if (response.status === 409) {
            const errorData = await response.json();
            enqueueSnackbar(errorData.error, { variant: "error" });
        } else {
            enqueueSnackbar("Registration Failed", { variant: "error" });
        }        
      }
  }
  const handleChange3 = (e) => {
    const value = e.target.value;
    setEmail(value); 
  } 
  const handleChange=(e)=>{
    const value = e.target.value;
    setUsername(value);
  }
  const handleChange2 = (e) => {
    const value = e.target.value;
    setType(value); 
  } 
  const jwtToken = localStorage.getItem('token');


  const handleFileUpload = (e) => {
  
    const file = e.target.files[0];
        
      
    if (file) {
      const formData = new FormData();
      formData.append("file", file); 
      setFormData(formData);
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvContent = event.target.result;

        // Parse CSV content using papaparse
        Papa.parse(csvContent, {
          complete: (result) => {
            // Set CSV data to state
            setCsvData(result.data);

            // Print CSV data to console
            console.log(result.data);
          },
          header: true, // Use the first row as headers
        });
      };

      reader.readAsText(file);
    } else {
      enqueueSnackbar("Please select a CSV file first", { variant: "error" });
    }
    const uploadCsvToBackend = async () => {
        
      // Check if csvData has elements
      if (csvData.length > 0) {
        // Make a POST request to your backend API
        fetch("http://localhost:8080/api/up-csv", {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })
      .then(async response => {
        if (response.ok) {
          enqueueSnackbar("CSV data uploaded successfully", { variant: "success" }); 
          setCsvData([]);
        } else {
          enqueueSnackbar("Failed to upload CSV data", { variant: "error" });
          const errorData = await response.text();
          enqueueSnackbar(errorData, { variant: "error" });
          console.log(errorData, { variant: "error" });
        }
      })
      .catch(error => {
        console.error(error);
      });
    }
  
};
  };
  const uploadCsvToBackend = async () => {
        
    // Check if csvData has elements
    if (csvData.length > 0) {
      // Make a POST request to your backend API
      fetch("http://localhost:8080/api/upload-csv/company", {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    .then(async response => {
      if (response.ok) {
        enqueueSnackbar("CSV data uploaded successfully", { variant: "success" }); 
        setCsvData([]);
      } else {
        enqueueSnackbar("Failed to upload CSV data", { variant: "error" });
        const errorData = await response.text();
        enqueueSnackbar(errorData, { variant: "error" });
        console.log(errorData, { variant: "error" });
      }
    })
    .catch(error => {
      console.error(error);
    });
  }

};

return(
  <div style={{ 
    backgroundColor: "#e5e5ff", minHeight: "100vh"
    }}>
  <div className="logout-button">
          <button onClick={handlebacktohomefrompay} >Back To Home</button>
  </div>
  {localStorage.getItem('type') === 'buyer' && (
  <div >
    <div>
      <h2 className='balance-header'>Thank you for shopping with us</h2>
      <h2 className='balance-header'>Your Balance:</h2>
      <p className="balance-amount">${Balance}</p> 
    </div>  
   
      </div>
  )}
  {(localStorage.getItem('type') === 'seller'||localStorage.getItem('type') === 'company') && ( 
    <div className="app">
    <div className="login-page" style={{backgroundColor:"white"}}> 
    <h2>Give Access</h2> {Username}
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={handleChange}
                
                />
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleChange3}
                /> 
                <input
                type="text"
                placeholder="Type"
                value={type}
                onChange={handleChange2}
                />
    
   
   <button className="lob" onClick={handleRegister}>
    Give Access</button> 
    {localStorage.getItem('type') === 'company' && ( 
                    <>
                    <div  >
                 <input type="file" accept=".csv" onChange={handleFileUpload}  style={{ color: '#6499E9' }}/>
                 <br/>
                 <button onClick={uploadCsvToBackend}>Upload CSV to Backend</button>
                 <br/>
                 </div>
                 </>
                )}
                
    </div> 
    
    </div>
    
  )}
   <div className="p-history-table" style={{marginTop:"20px"}}>
                 <table>
          <thead>
            <tr>
              {/* Assuming the first row of CSV is headers */}
              {csvData.length > 0 &&
                Object.keys(csvData[0]).map((header, index) => (
                  <th key={index}>{header}</th>
                ))}
            </tr>
          </thead>
          <tbody>
            {csvData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
                 </div>
  </div>
)
}
export default Payment;
