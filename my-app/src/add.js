import React, { useState,useEffect } from "react";
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
function Add({backpay,backcart,dtod}) {  
    const [inputValue, setInputValue] = useState("");
    const [Balance,setBalance]=useState(0);
    const [cat,setcat]=useState('');
    const [cost,setcost]=useState();
    const [id,setid]=useState();
    const [description,setdescription]=useState('');
    const [rating,setrating]=useState(); 
    const [url,seturl]=useState(''); 
    const [topic,settopic]=useState('');
    const [person,setperson]=useState('');
    const [removeId, setRemoveId] = useState();
   
    let Username=localStorage.getItem('username');
    const backtohomebal=()=>{
        backpay();
        enqueueSnackbar("Back to Home",{variant:"default"});
    }
    const drafttodata=()=>{
      dtod();
    }
    const backtocart=()=>{
      backcart(); 
      enqueueSnackbar("Back to Cart",{variant:"default"});
    }
    
    const addDatadb = async () => {                
      const response = await fetch('http://localhost:8080/api/adddata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id,cat,cost,description,rating,url,topic,person,seller:Username}),
        credentials: 'include',
      }); 
      
      if (response.ok ) {  
          enqueueSnackbar("Data Added Sucessfully",{ variant:"success" });  
          backpay();   
          }
      else if (response.status === 409) {
              const errorData = await response.json();
              enqueueSnackbar(errorData.error,{variant:"error"});
          }   
    }; 
    const addData = async () => {             
      const response = await fetch('http://localhost:8080/api/adddatadraft', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id,cat,cost,description,rating,url,topic,person,seller:Username}),
        credentials: 'include',
      }); 
      
      if (response.ok ) {
        enqueueSnackbar("Data Added Sucessfully",{ variant:"success" });  
        backpay();
        
          }
      else if (response.status === 409) {
            const errorData = await response.json();
            enqueueSnackbar(errorData.error,{variant:"error"});
          }    

    }; 
    
    let drafttodb=null;
    if (localStorage.getItem('type')=="seller") { 
      drafttodb = (
        <button onClick={drafttodata}>Launch Draft</button>
       );
        }
        const addBalance=()=>{ 
          const amountToAdd = parseFloat(inputValue);

          if (isNaN(amountToAdd) || amountToAdd <= 0|| amountToAdd.length<1) {
            enqueueSnackbar("Please enter a valid positive number", { variant: "error" });
          }
          else {
          const newBalance = Balance + amountToAdd;
          axios.post(`http://localhost:8080/api/updateUserBalance/${Username}`, newBalance, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          
        backcart();  
        enqueueSnackbar(`Balance Updated to ${newBalance}`,{variant:"success"});
        enqueueSnackbar("Back to Cart",{variant:"default"});
        }
      }
    const handleInputChange = (e) => {
        setInputValue(e.target.value);
      }
      useEffect(() => {
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
    <div style={{ backgroundColor: "#f0f0f0"  }}>
    <div  className="logout-button">
        {drafttodb}
        <button onClick={backtocart} >
          Cart
        </button>
      <button onClick={backtohomebal} >
          Back To Home
        </button>
    </div> 
    {localStorage.getItem('type') === 'buyer' && ( 
      <>
    <div className="app">
      <div className="login-page" >
      <h1>Balance: ${Balance}</h1>
      <form >
        <label>
          Enter Number to Add:
          <input
            type="number"
            step="100"
            value={inputValue}
            onChange={handleInputChange}
          />
        </label>
        <button onClick={addBalance} style={{ backgroundColor: "darkgrey" }}>Add to Balance</button>
      </form>
    </div>
    </div>
    </>
    )}
    {localStorage.getItem('type') =="seller" && (
        <div className='app'>
        <div className="login-page" style={{backgroundColor:"white"}}> 
                <h2>ADD DATA </h2> 
                <div className="con">
                <input
                    type="Long"
                    placeholder="Referance Number"
                    value={id}
                    onChange={(e) => setid(e.target.value)}
                    
                />
                <input
                    type="text"
                    placeholder="catogory"
                    value={cat}
                    onChange={(e) => setcat(e.target.value)}
                   
                />
                
                <input
                    type="integer"
                    placeholder="cost" 
                    value={cost}
                    onChange={(e) => setcost(e.target.value)}
                />
                
                <input
                    type="text"
                    placeholder="Description" 
                    value={description}
                   
                    onChange={(e) => setdescription(e.target.value)}
                />
                
                <input
                    type="double"
                    placeholder="Rating"
                    value={rating}
                    onChange={(e) => setrating(e.target.value)}
                   
                />
                <input
                    type="text"
                    placeholder="Topic" 
                    value={topic}
                    onChange={(e) => settopic(e.target.value)}
                   
                />
                <input
                    type="text"
                    placeholder="Url"
                    value={url}
                    onChange={(e) => seturl(e.target.value)}

                />
                <input
                    type="text"
                    placeholder="person"
                    value={person}
                    onChange={(e) => setperson(e.target.value)}
                   
                />
                </div>
                <button className="lob" onClick={addDatadb} style={{marginRight:"5px"}}>
                Launch Product</button> 
                <button className="lob" onClick={addData} style={{marginLeft:"5px"}}>
                Add To Draft</button> 
                
                </div>
                
           </div>  
           
           )}
           
    </div>
  );
}


export default Add;
