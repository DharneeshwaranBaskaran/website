import React, { useState,useEffect } from "react";
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
function History({ his,histocart}) {
    const [cat,setcat]=useState('');
    const [cost,setcost]=useState();
    const [id,setid]=useState();
    const [description,setdescription]=useState('');
    const [rating,setrating]=useState(); 
    const [url,seturl]=useState(''); 
    const [topic,settopic]=useState('');
    const [person,setperson]=useState([]);
    const [removeId, setRemoveId] = useState();
  const [Items, setItems] = useState([]);
  let Username=localStorage.getItem('username');
  let type=localStorage.getItem('type');
  const handlebacktohomefromhis = () => {
    his(); 
    enqueueSnackbar('Redirecting To Home Page',{variant:"default"})
  }
  const handleHistoryClear = () => {  
    if(Items.length === 0){
  enqueueSnackbar("Your History Page Is Empty",{variant:"info"});
}
else{
    axios.post(`http://localhost:8080/api/HistoryClear/${Username}`)
          .then((response) => {
              console.log(response.data);
          })
          .catch((error) => {
              console.error('Error transferring data:', error);
          }); 
          histocart();  
          enqueueSnackbar("History Has Been Cleared",{variant:"success"});
          enqueueSnackbar("Redirecting to Cart",{variant:"default"});
  }
}
 
  useEffect(() => {
        axios.get(`http://localhost:8080/api/history/${Username}`)
            .then((response) => {
                setItems(response.data);
            })
            .catch((error) => {
                console.error('Error fetching history items:', error);
            });
    }, [Username]);
    let backButton = null;
          if (type=="buyer") { 
            backButton = (<div className="logout-button">
            <button  
            onClick={handleHistoryClear}>
              Clear History</button>
            </div>
            );
      }
      const addData = async () => {
                    
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
            his();   
            }
        else if (response.status === 409) {
                const errorData = await response.json();
                enqueueSnackbar(errorData.error,{variant:"error"});
            }    
  
      }; 
      
      const removeData = async () => {
        const response = await fetch('http://localhost:8080/api/removedata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: removeId,seller:Username}),
          credentials: 'include',
        }); 
        
        if (response.ok ) {
          
            enqueueSnackbar("Data Removed Sucessfully",{variant:"success" });  
            his();   
            }
        else if (response.status === 409) {
                const errorData = await response.json();
                enqueueSnackbar(errorData.error,{variant:"error" });
            }  
            
      }
  return (
    <div style={{ backgroundColor: "lightgrey", minHeight: "100vh" }}> 
      <div className="logout-button">
        <button onClick={handlebacktohomefromhis} >
          Back To Home
        </button>
      </div>
      <table className="purchase-history-table">
      {localStorage.getItem('type') =="buyer" && (
        <thead>
          <tr>
            <th>Topic</th>
            <th>Count</th>
            <th>Cost</th>
            <th>Total Cost</th>
          </tr>
        </thead> 
      )}
        <tbody>
          {Items.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.count}</td>
              <td>${item.cost}</td>
              <td>${item.cost * item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {backButton}
      {localStorage.getItem('type') =="seller" && (
        
      
        <div className='contain'>
        
        <div className="login-page" style={{backgroundColor:"white"}}> 
                <h2>ADD DATA TO DB</h2> 
                <div className="con">
                <input
                    type="Long"
                    placeholder="refnum"
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
               <button className="lob" onClick={addData}>
                Add Data</button> 
                </div>
                <div className="login-page" style={{backgroundColor:"white"}}> 
                <h2>REMOVE DATA FROM DB</h2> 
                <div className="con">
                <input
                    type="Long"
                    placeholder="refnum"
                    value={removeId}
                    onChange={(e) => setRemoveId(e.target.value)}
                   
                />
                {/*  */}
                </div>
               <button className="lob" onClick={removeData}>
                Remove Data</button> 
                </div>
           </div> 
           )}
          
    </div>
  );
}


export default History;
