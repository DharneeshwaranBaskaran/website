import React, { useState, useEffect } from "react";
import { useSnackbar } from "notistack";
import './App.css';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';
import { BroadcastChannel } from "broadcast-channel";
function Payment() {
  const navigate = useNavigate();
  let Username = localStorage.getItem('username');
  const [Balance, setBalance] = useState(0);
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [type, setType] = useState('');
  const typeo = localStorage.getItem('type');
  const [csvData, setCsvData] = useState([]);
  const [formData, setFormData] = useState(new FormData());
  const handlebacktohomefrompay = () => {
    enqueueSnackbar("Redirecting to homepage", { variant: "default" });
    navigate(`/${typeo}/homepage`);
  }
  useEffect(() => {
    const logoutChannel = new BroadcastChannel('logoutChannel');
    logoutChannel.onmessage = () => {
      navigate("/start");
      localStorage.clear();
      window.location.reload();
      enqueueSnackbar("Logout Successful");
    };
    fetch(`http://localhost:8080/api/balance/${Username}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      }).then((data) => {
        setBalance(data);
      }).catch((error) => {
        console.error('Error fetching balance:', error);
      });
  }, [Username]);
  const handleRegister = async (event) => {
    let endpoint = "";
    if (localStorage.getItem("type") === "seller") {
      endpoint = "http://localhost:8080/api/register/access";
    } else {
      endpoint = "http://localhost:8080/api/register/companyaccess";
    }
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, type, provider: Username }),
      credentials: 'include'
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
  };
  const handleChange3 = (e) => {
    setEmail(e.target.value);
  }
  const handleChange = (e) => {
    setUsername(e.target.value);
  }
  const handleChange2 = (e) => {
    setType(e.target.value);
  }
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
        Papa.parse(csvContent, {
          complete: (result) => {
            setCsvData(result.data);
            console.log(result.data);
          },
          header: true,
        });
      };
      reader.readAsText(file);
    } else {
      enqueueSnackbar("Please select a CSV file first", { variant: "error" });
    }
  };
  const uploadCsvToBackend = async () => {
    if (csvData.length > 0) {
      fetch("http://localhost:8080/api/upload-csv/company", {
        method: 'POST',
        body: formData,
        credentials: 'include',
      }).then(async response => {
          if (response.ok) {
            enqueueSnackbar("CSV data uploaded successfully", { variant: "success" });
            setCsvData([]);
          } else {
            enqueueSnackbar("Failed to upload CSV data", { variant: "error" });
            const errorData = await response.text();
            enqueueSnackbar(errorData, { variant: "error" });
            console.log(errorData, { variant: "error" });
          }
        }).catch(error => {
          console.error(error);
        });
    }
  };
  const InputField = (type, placeholder, value, onChange) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh"}}>
      <div className="logout-button">
        <button onClick={handlebacktohomefrompay} >Back To Home 🏠</button>
      </div>
      {localStorage.getItem('type') === 'buyer' && (<>
            <h2 className='balance-header'>Thank you for shopping with us</h2>
            <h2 className='balance-header'>Your Balance:</h2>
            <p className="balance-amount" data-testid="Balance">${Balance}</p> 
            </> )}
      {(localStorage.getItem('type') === 'seller' || localStorage.getItem('type') === 'company') && (
        <div className="app"  style={{overflowY: "hidden" }}>
          <div className="login-page" style={{ backgroundColor: "white" ,paddingRight:"30px",paddingLeft:"20px" }}>
            <h2 data-testid="PRODUCTS">Give Access</h2> {Username}
            {InputField("text", "Username", username, handleChange)}
            {InputField("text", "Email", email, handleChange3)}
            {InputField("text", "Type", type, handleChange2)}
            <button className="lob" onClick={handleRegister}>
              Give Access</button>
            {localStorage.getItem('type') === 'company' && (<>
              <div>
                <input type="file" accept=".csv" onChange={handleFileUpload} style={{ color: '#6499E9' }} />
                <br />
                <button onClick={uploadCsvToBackend} className="lob">Upload CSV to Backend</button>
                <br />
              </div>
            </> )}
          </div>
        </div>
      )}
      <div className="p-history-table" style={{ marginTop: "20px" }}>
        <table>
          <thead>
            <tr>
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
