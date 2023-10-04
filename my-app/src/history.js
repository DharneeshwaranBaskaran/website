import React, { useState,useEffect } from "react";
import axios from 'axios';
import { enqueueSnackbar } from "notistack";
function History({ his,histocart}) {
    
    const [Data,setData]=useState([]);
    const [Items, setItems] = useState([]);
    const [Draft,setDraft]= useState([]);
    let Username=localStorage.getItem('username');
    let type=localStorage.getItem('type'); 
    const [searchQuery, setSearchQuery] = useState('');
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
      useEffect(() => {
        axios.get(`http://localhost:8080/api/history/view/${Username}`)
          .then((response) => {
            setData(response.data);
          })
          .catch((error) => {
            console.error('Error fetching cart items:', error);
          });
      },[Username]);
      useEffect(() => {
        axios.get(`http://localhost:8080/api/history/viewdraft/${Username}`)
          .then((response) => {
            setDraft(response.data);
          })
          .catch((error) => {
            console.error('Error fetching cart items:', error);
          });
      },[Username]);
      const removeItemFromCart = (topic) => {
        axios
            .delete(`http://localhost:8080/api/deletecombo/${topic}/${Username}`)
            .then((response) => {
              // const updatedCartItems = Items.filter((item) => item.topic !== topic);
              // setData(updatedCartItems);
              axios.get(`http://localhost:8080/api/history/view/${Username}`)
              .then((response) => {
                setData(response.data);
              })
              .catch((error) => {
                console.error('Error fetching cart items:', error);
              });
              axios.get(`http://localhost:8080/api/history/viewdraft/${Username}`)
              .then((response) => {
                setDraft(response.data);
              })
              .catch((error) => {
                console.error('Error fetching cart items:', error);
              });
              // localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
            })
            .catch((error) => {
            });
      };
      const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
      };

      // Filter items based on the search query
      const filteredItems = Items.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));
      const drafttodatabase = async (id) => {
        axios.post(`http://localhost:8080/api/transferdata/${id}`)
              .then((response) => {
                  console.log(response.data);
                  console.log(response.status);
                  enqueueSnackbar(response.data);
                  his(); 
                  
              })
              .catch((error) => {
                if (error.response){ 
                  enqueueSnackbar(error.response.data.error); 
                }
               else 
                  enqueueSnackbar(error.message); // Display the error message
              });
                            
      }
  return (
    <div style={{ backgroundColor: "lightgrey", minHeight: "100vh" }}> 
      <div className="logout-button">
        <button onClick={handlebacktohomefromhis} >
          Back To Home
        </button>
      </div>
      {localStorage.getItem('type') =="buyer" && (
      <input
                type="text"
                placeholder="Search Items"
                value={searchQuery}
                onChange={handleSearchChange}
                className="search-bar"
                style={{marginLeft:"10px"}}
            />
      )}
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
          {filteredItems.map((item, index) => (
            <tr key={index}>
              <td>{item.topic}</td>
              <td>{item.count}</td>
              <td>${item.cost}</td>
              <td>${item.cost * item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {backButton}
      {localStorage.getItem('type') =="seller" && (
        <>
        <h2>PRODUCTS:</h2>
        <table className="purchase-history-table">
         <thead>
          <tr>
           <th>Referance Number</th>
           <th>Topic</th>
           <th>Cost</th>
           <th>Remove</th>
         </tr>
       </thead>
       <tbody>
         {Data.map((item, index) => (
           <tr key={index}>
             <td>{item.id}</td>
             <td>{item.topic}</td>
             <td>${item.cost}</td>  
             <td><button className="cart-button" onClick={() => removeItemFromCart(item.topic)}>
                  Remove</button></td>           
           </tr>
         ))}
       </tbody>
     </table>
     {Draft.length > 0 && (
        <>
     <h2>DRAFT:</h2>
        <table className="purchase-history-table">
         <thead>
          <tr>
           <th>Referance Number</th>
           <th>Topic</th>
           <th>Cost</th>
           <th>Remove</th> 
           <th>Launch</th>
         </tr>
       </thead>
       
       <tbody>
       
         {Draft.map((item, index) => (
           <tr key={index}>
             <td>{item.id}</td>
             <td>{item.topic}</td>
             <td>${item.cost}</td>  
             <td><button className="cart-button" onClick={() => removeItemFromCart(item.topic)}>
                  Remove</button></td>     
             <td><button className="cart-button" onClick={() => drafttodatabase(item.id)}>
                  Launch</button></td>      
           </tr>
         ))}
       </tbody>
     </table>
       </>
           )}
         </>
         )} 
    </div>
  );
}


export default History;
