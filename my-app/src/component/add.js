import React, { useState, useEffect } from "react";
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
import './App.css';
import Papa from 'papaparse';
import { useNavigate } from 'react-router-dom';

function Add() {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState("");
  const [Upi, setUpi] = useState("");
  const [Balance, setBalance] = useState(0);
  const [cat, setcat] = useState('');
  const [cost, setcost] = useState();
  const [description, setdescription] = useState('');
  const [rating, setrating] = useState();
  const [url, seturl] = useState('');
  const [topic, settopic] = useState('');
  const [person, setperson] = useState('');
  let Username = localStorage.getItem('username');
  const type = localStorage.getItem('type');
  const [csvData, setCsvData] = useState([]);
  const [formData, setFormData] = useState(new FormData());

  const backtocart = (value) => {
    navigate(`/${type}/${value}`);
    enqueueSnackbar(`Back to ${value}`, { variant: "default" });
  }

  const InputField = ({ type, placeholder, value, onChange }) => {
    return (
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    );
  };

  const addData = async (key) => {
    const response = await fetch(`http://localhost:8080/api/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ cat, cost, description, rating, url, topic, person, seller: Username }),
      credentials: 'include',
    });
    if (response.ok) {
      enqueueSnackbar("Data Added Sucessfully", { variant: "success" });
      navigate(`/${type}/homepage`);
      const response1 = await fetch('http://localhost:8080/api/mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cat, cost, description, rating, url, topic, person, seller: Username }),
        credentials: 'include',
      });
    }
    else if (response.status === 409) {
      const errorData = await response.json();
      enqueueSnackbar(errorData.error, { variant: "error" });
    }
  };

  const addBalance = () => {
    const amountToAdd = parseFloat(inputValue);
    if (isNaN(amountToAdd) || amountToAdd <= 0 || amountToAdd.length < 1) {
      enqueueSnackbar("Please enter a valid positive number", { variant: "error" });
    } else if (Upi.length < 6 || !(Upi.includes("@"))) {
      enqueueSnackbar("Enter a valid Upi")
    } else {
      const newBalance = Balance + amountToAdd;
      axios.post(`http://localhost:8080/api/updateUserBalance/${Username}`, newBalance, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      navigate(`/${type}/cart`);
      enqueueSnackbar(`Balance Updated to ${newBalance}`, { variant: "success" });
      enqueueSnackbar("Back to Cart", { variant: "default" });
    }
  }

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const handleUpi = (e) => {
    setUpi(e.target.value);
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
  useEffect(() => {
    const logoutChannel = new BroadcastChannel('logoutChannel');
    logoutChannel.onmessage = () => {
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
        console.error('Error fetching data:', error);
      });
  }, [Username]);
  return (
    <div style={{ backgroundColor: "#e5e5ff" }}>
      <div className="logout-button">
        <button onClick={() => backtocart("cart")} >Cart</button>
        <button onClick={() => backtocart("homepage")} >Back To Home</button>
      </div>
      {localStorage.getItem('type') === 'buyer' && (<>
        <div className="app">
          <div className="login" >
            <h1>Balance: ${Balance}</h1>
            <form >Enter UPI ID:
              <InputField type="text" placeholder="UPI" value={Upi} onChange={handleUpi} />
              <label>
                Enter Amount to Add:
                <InputField type="number" placeholder="cost" value={inputValue} onChange={handleInputChange} />
              </label>
              <button onClick={addBalance} className="lob">Add to Balance</button>
            </form>
          </div>
        </div>
      </>)}
      {localStorage.getItem('type') !== "buyer" && (
        <div className='app'>
          <div className="login-page" style={{ backgroundColor: "white" }}>
            <h2>LAUNCH PRODUCT</h2>
            <div className="con">
              <InputField type="text" placeholder="category" value={cat} onChange={(e) => setcat(e.target.value)} />
              <InputField type="integer" placeholder="cost" value={cost} onChange={(e) => setcost(e.target.value)} />
              <InputField type="text" placeholder="Description" value={description} onChange={(e) => setdescription(e.target.value)} />
              <InputField type="double" placeholder="Rating" value={rating} onChange={(e) => setrating(e.target.value)} />
              <InputField type="text" placeholder="Topic" value={topic} onChange={(e) => settopic(e.target.value)} />
              <InputField type="text" placeholder="Url" value={url} onChange={(e) => seturl(e.target.value)} />
              <InputField type="text" placeholder="person" value={person} onChange={(e) => setperson(e.target.value)} />
            </div>
            <button className="lob" onClick={() => addData("adddata")} style={{ marginRight: "5px" }}>Launch Product</button>
            <button className="lob" onClick={() => addData("adddatadraft")} style={{ marginLeft: "5px" }}>Add To Draft</button>
            <div>
              <input type="file" accept=".csv" onChange={handleFileUpload} style={{ color: '#6499E9' }} /><br />
              <button onClick={uploadCsvToBackend} className="lob">Upload CSV to Backend</button><br />
            </div>
          </div>
        </div>
      )}
      <div className="purchase-history-table" style={{ marginTop: "20px" }}>
        <table>
          <thead>
            <tr>
              {csvData.length > 0 && Object.keys(csvData[0]).map((header, index) => (
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
  );
}
export default Add;
