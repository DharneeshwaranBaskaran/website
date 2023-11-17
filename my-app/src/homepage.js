import React, {useRef,useEffect, useState } from "react";
import CustomCard from "./customcard";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import './App.css';  
import BarGraph from "./Bargraph";
import LaterCard from "./Latercard";
import { Card } from "@mui/material";
function HomePage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [ty,settyp] = useState('');  
  const [inputNumber,setInputnumber]=useState([]);
  const [Items,setItems]=useState([]);
  const [reminder,setremider]=useState([]);
  const [Data,setData]=useState([]);  
  const [data,setdata]=useState([]);  
  const [pro,setpro]=useState([]);
  const [user,setuser]=useState([]);
  const [Balance,setBalance]=useState(0); 
  const [cart,setcart]=useState([]);
  const username = localStorage.getItem('username'); 
  let typeo=localStorage.getItem('type');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortingCriteria, setSortingCriteria] = useState(""); 
  const [accsortingCriteria, setAccSortingCriteria] = useState("");
  const [sortedData, setSortedData] = useState([]); 
  const [sorted,setsorted] = useState([]); 
  const [patch,setpatch]=useState([]); 
  const [prov,setprov]=useState('');
  const [typ,settye]=useState('');
  const [selectedFile, setSelectedFile] = useState(null); 
  const [later,setLater]=useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [forpic, setforpic] = useState('');
  const fileInputRef = useRef();
  
  useEffect(() => {
    // Listen for logout messages from other tabs
    const logoutChannel = new BroadcastChannel('logoutChannel');
    logoutChannel.onmessage = () => {
      // Perform the local logout actions
      navigate("/start");
      localStorage.clear();
      window.location.reload();
      enqueueSnackbar("Logout Successful");
    };
  
    // Fetch user data
    const username = localStorage.getItem("username");
    axios.get(`http://localhost:8080/api/user/${username}`)
      .then(response => {
        setforpic(response.data[0].profilepic);
        console.log(response.data[0].profilepic);
      })
      .catch(error => {
        console.error("Error fetching user data:", error);
      });
  
    // Cleanup the channel and listener when component unmounts
    return () => {
      logoutChannel.close();
    };
  }, []);
  
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the first selected file
  
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file); // Set the selected image file
      const imageURL = URL.createObjectURL(file); // Get the URL of the selected image
      setImageUrl(imageURL); // Set the image URL in state  
      console.log(imageUrl);
      axios.post(`http://localhost:8080/api/userpic/${username}`, { profilepic: imageURL })
      .then((response) => {
        console.log("Image URL sent to the backend:", response.data);
      })
      .catch((error) => {
        console.error("Error sending image URL to the backend:", error);
        
      });
      console.log(imageURL);
    } else {
      console.error('Selected file is not a valid image.');
    }
    // window.location.reload();
  };
  
let sel="";
if(typeo=="seller"){
  sel="access";
}
else{
  sel="companyaccess";
}
useEffect(() => {
  axios.get(`http://localhost:8080/api/cart/getItems/${username}`)
    .then((response) => {
      setcart(response.data); 
      console.log(response.data); 
      
    })
    .catch((error) => {
      console.error('Error fetching cart items:', error);
    });
}, [username]);


  let count=0;
  useEffect(() => {
    axios.get(`http://localhost:8080/api/${sel}/${username}`)
        .then((response) => {
            setuser(response.data); 
            console.log(response.data);
        })
        .catch((error) => {
            console.error('Error fetching history items:', error);
        });
  }, [username]);
  useEffect(() => {
    axios.get(`http://localhost:8080/api/balance/${username}`)
          .then((response) => {
            const data = response.data;
            
            setBalance(data);
          })
          .catch((error) => {
            console.error('Error fetching data:', error);
          });
          
      }, [username]);  
   
    const handleRecommendation = (id,topic)=>{
      localStorage.setItem('myID', id); 
      console.log(id);
      localStorage.setItem('rec',"true");
      navigate(`/${typeo}/menext`);
    }
    useEffect(() => {
      axios.get(`http://localhost:8080/api/historyhome/${username}`)
          .then((response) => {
              setItems(response.data);
          })
          .catch((error) => {
              console.error('Error fetching history items:', error);
          });
    }, [username]);

    useEffect(() => {
      axios.get(`http://localhost:8080/api/history/view/${username}`)
        .then((response) => {
          setData(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    },[username]); 
    
    useEffect(() => {
      axios.get(`http://localhost:8080/api/ty/${typeo}/${username}`)
        .then((response) => {
          setdata(response.data); 
          setprov(response.data[0]?.provider); 
          settye(response.data[0]?.type); 
          console.log(response.data[0].type);
          
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    },[username]); 
    
    useEffect(() => {
      if (prov) {
      axios.get(`http://localhost:8080/api/history/view/${prov}`)
        .then((response) => {
          setpro(response.data); 
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        }); 
      } 
    },[prov]);
    const uniqueItems = Items.filter((item, index, self) =>
    index === self.findIndex((t) => t.topic === item.topic)
    );   
    const Uniquereminder =reminder.filter((item, index, self) =>
    index === self.findIndex((t) => t.topic === item.topic)
    );   
  
  const handleCategoryChange = (event) => {
    if(event.target.value=="Men"){
      localStorage.setItem("myRef",1);
    }
    else if(event.target.value=="Women"){
      localStorage.setItem("myRef",2);
    }
    else{
      localStorage.setItem("myRef",3);
    }
    console.log(event.target.value); 
     
    navigate(`/${typeo}/men`);

  };
  const handlePay =(id)=>{ 
    enqueueSnackbar("id:"+id);
    console.log("id:"+id);
    axios.get(`http://localhost:8080/api/paylater/getpaylat/${id}`)
    .then((response) => {
      const cur = response.data;
      let total = 0;

      if (cur.length > 0) {
        total = cur[0].cost * cur[0].count;
      }
      enqueueSnackbar("total:$"+total);
      if(Balance>total){
      const newBalance = Balance - total; 
      axios.post(`http://localhost:8080/api/paidlater/${username}/${id}`)
          .then((response) => {
              console.log(response.data);
          })
          .catch((error) => {
              console.error('Error transferring data:', error);
          });
        axios.post(`http://localhost:8080/api/updateUserBalance/${username}`, newBalance, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          navigate(`/${typeo}/payment`); 
          enqueueSnackbar("Payment Successful",{ variant:"success" });
        }
        else{
    enqueueSnackbar("Insuficient Balance"+Balance+"  "+total,{ variant:"warning"});
  }
    })
    .catch((error) => {
      console.error('Error fetching cart items:', error); 
      enqueueSnackbar('Error fetching cart items:', error);
    });
    
  
}
  const handleChange = (event) => {  
    if(event.target.value=="No"){
      localStorage.setItem("weekend","No");
    }
    else{
      localStorage.setItem("weekend","Yes");
    }
  }
  
  const [selectedAction, setSelectedAction] = useState(""); // Default action
  const handleActionChange = (event) => {
    if(event.target.value=="Back"){
       
      
      navigate(`/${typeo}/cart`);
      enqueueSnackbar("Redirecting to cart",{ variant:"default"});
    }
    else if(event.target.value=="Add")
    
    navigate(`/${typeo}/history`);
    else if(event.target.value=="Draft"){
    navigate(`/${typeo}/add`);
    }else if(event.target.value=="Access"){
    navigate(`/${typeo}/payment`);
    }
    else{
      // navigate("/start"); 
      // localStorage.clear();
      // window.location.reload();
      // enqueueSnackbar("Logout Successful");
      const broadcastChannel = new BroadcastChannel('logoutChannel');
  broadcastChannel.postMessage('logout');

  // Perform the local logout actions
  navigate("/start");
  localStorage.clear();
  window.location.reload();
  enqueueSnackbar("Logout Successful");
    }
  }; 
  
  const handlelogout =()=>{
    navigate("/start"); 
      localStorage.clear();
      window.location.reload()
      enqueueSnackbar("Logout Successful");
      
  }
  const handleSortingChange = (event) => {
    setSortingCriteria(event.target.value);
    count=count+1;
  };
  const handleSortingChange1 = (event) => {
    setAccSortingCriteria(event.target.value);
    count=count+1;
  };
  const filterData = (data, query) => {
    return data.filter((item) =>
      item.topic.toLowerCase().includes(query.toLowerCase())
    );
  };
 
    useEffect(()=>{
      setpatch(filterData(Data, searchQuery));
    },[Data,searchQuery])
    useEffect(() => {
      const sorted = [...(patch)].sort((a, b) => {
        if (sortingCriteria === "cost") {
          return b.cost - a.cost;
        } else if (sortingCriteria === "count") {
          return b.count - a.count;
        }
        else if(sortingCriteria === "revenue"){
          return (b.cost)*(b.count)-((a.cost)*(a.count));
        }
        else{
        return 0; // Default to no sorting
        }
      });
      setSortedData(sorted);
    }, [sortingCriteria,patch])
    const handleRemoveImage = () => {
      setSelectedFile(null); // Set the selected image to null to remove it
    };
    const handleRemove=(id)=>{
      axios
            .delete(`http://localhost:8080/api/delete${sel}/${id}`)
            .then((response) => { 
              window.location.reload()
              console.log(response.data);
            })
            .catch((error) => {
                console.error('Error transferring data:', error);
            });
    }
    
    useEffect(()=>{
      const sorted=[...(pro)].sort((a,b)=>{
        if(typ=="cost"){
          if(accsortingCriteria==="des"){
            return b.cost - a.cost;
          }else if(accsortingCriteria==="ass"){
            return a.cost - b.cost;
          }
          else{
            return 0; // Default to no sorting
            }
        }
        else if(typ=="count"){
          if(accsortingCriteria==="des"){
            return b.count - a.count;
          }else if(accsortingCriteria==="ass"){
            return a.count - b.count;
          }
          else{
            return 0; // Default to no sorting
            }
        } 
        else if(typ=="stockcount"){
          if(accsortingCriteria==="des"){
            return b.stockcount - a.stockcount;
          }else if(accsortingCriteria==="ass"){
            return a.stockcount - b.stockcount;
          }
          else{
            return 0; // Default to no sorting
            }
        }
        else{
          if(accsortingCriteria==="des"){
            return (b.cost)*(b.count) - (a.cost)*(a.count);
          }else if(accsortingCriteria==="ass"){
            return (a.cost)*(a.count) - (b.cost)*(b.count);
          }
          else{
            return 0; // Default to no sorting
            }
        }
      })
      setsorted(sorted)
    },[accsortingCriteria,pro])
    useEffect(() => {
      axios.get(`http://localhost:8080/api/paylater/getpaylater/${username}`)
        .then((response) => {
          setLater(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }, [username]);
    const handlehelp =()=>{
      navigate(`/${typeo}/help`);
    } 
    const handleChange5 = (e) => {
      const value = e.target.value;
      settyp(value);
     };
  
     const handlewish=()=>{
      navigate(`/${typeo}/phone`); 
     }
     const jwtToken = localStorage.getItem('token');
   


  const handleEdit = async (id,index) => { 
      const response = await fetch(`http://localhost:8080/api/edit/${typeo}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id,type:selectValues[index]}),
                    credentials: 'include',
                  });
                  if (response.ok) {
                      enqueueSnackbar("Registration Successful", { variant: "success" });    
                      console.log(response);  
                      window.location.reload();
                      // navigate(`/${typeo}/homepage`); 
                      
                  } else if (response.status === 409) {
                      const errorData = await response.json();
                      enqueueSnackbar(errorData.error, { variant: "error" });
                  } else {
                      enqueueSnackbar("Registration Failed", { variant: "error" });
                  }        
  } 
  
  const [inputValues, setInputValues] = useState(Array(sortedData.length).fill('')); // Use an array of strings to store input values

  const handleChangein = (index, e) => {
    const newValue = e.target.value;
    const newInputValues = [...inputValues];
    newInputValues[index] = newValue;
    setInputValues(newInputValues);
  };
  useEffect(() => {
    axios.get(`http://localhost:8080/api/reminder/getItems/${username}`)
      .then((response) => {
        setremider(response.data); 
        
      })
      .catch((error) => {
        console.error('Error fetching cart items:', error);
      });
  }, [username]);
  const validatePositiveNum = (value) => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && numericValue >= 0) {
      return numericValue;
    } else {
      // If the input is not a valid positive number, return the current value.
      return null;
    }
  };
  
  const handlestock = (id,topic,index) => { 
     
    
    const inputValue = inputValues[index]; 
    if(inputValue<=0){
      enqueueSnackbar("Enter a Number greater than 0")
    }
    else{
    axios
      .post(`http://localhost:8080/api/updatestock/${id}/${inputValue}/${topic}`)
      .then((response) => {
        console.log(response.data);
        enqueueSnackbar('Stock count updated successfully', { variant: 'success' }); 
        window.location.reload();
      })
      .catch((error) => {
        console.error('Error updating stock count:', error);
        enqueueSnackbar('Error updating stock count', { variant: 'error' });
      });
    
  }
  console.log(topic);
  
}
const [selectValues, setSelectValues] = useState(user.map((item) => ""));

// Function to handle changes in the select element
const handleSelectChange = (index, value) => {
  // Create a copy of the selectValues array
  const newSelectValues = [...selectValues];
  // Update the value for the specific select element
  newSelectValues[index] = value;
  // Set the updated state  
  console.log(newSelectValues)
  setSelectValues(newSelectValues);
};
const handleuser=()=>{
  navigate(`/${typeo}/user`);
}
const handleview=(comid,id,topic)=>{
  localStorage.setItem('myID', comid); 
  console.log(comid);
  localStorage.setItem('rec', "");
  localStorage.removeItem('value');
  console.log(localStorage.getItem("count"));
// You need to set the username here, as it is used in the request body

  axios.delete(`http://localhost:8080/api/reminderdelete`, {
      data: { id: id, username:  localStorage.getItem('username') }
    })
    .then(response => {
      // Handle the response from the backend if needed
      console.log(response.data);
      navigate(`/${typeo}/menext`);
      enqueueSnackbar("Reminder deleted successfully");
    })
    .catch(error => {
      // Handle the error if the HTTP request fails
      console.error('Error sending id to the backend:', error);
    });
}
    return ( 
      
      <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}> 
        <div className="logout-button"> 
        {/* {localStorage.getItem("token")} */}
       
        {localStorage.getItem('type') !== 'buyer' && (
          <>
              
          <button style={{backgroundColor:"#5B0888"}}>{username}</button> 
          </>   
          )}
        {localStorage.getItem('type') === 'buyer' && (
          <>  
          <img src={forpic} alt={forpic} style={{ height: '35px' ,marginLeft:'100px'}}  />
           <button style={{backgroundColor:"#5B0888"}} onClick={handleuser}>{username}</button> 
           
          <select 
            onChange={handleChange} 
            style={{ backgroundColor: "#5B0888", color: "white", 
            border: "none", padding: "5px",borderRadius:"5px",marginRight:"5px" }}
          >
            <option>Weekend Delivery</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
    
          <select 
          onChange={handleCategoryChange} 
          style={{ backgroundColor: "#713ABE", color: "white", 
          border: "none", padding: "5px",borderRadius:"5px",marginRight:"5px" }}> 
              <option>Category</option>
              <option value="Men">Men</option>
              <option value="Women">Women</option>
              <option value="Kids">Kids</option>
              
          </select>
          <button style={{backgroundColor:"#713ABE"}} onClick={handlehelp}>Help</button> 
          </>
        )}
            {(localStorage.getItem('type') === 'seller'||localStorage.getItem('type') === 'company') && (
            <>
            <select
            value={selectedAction}
            onChange={handleActionChange}
            style={{ backgroundColor: "#451952", color: "white", border: "none",
             padding: "5px",borderRadius:"5px",marginLeft:"5px"  }}
          >
            <option>Menu</option>
            <option value="Back">Cart</option>
            <option value="Add">Remove</option>
            <option value="Draft">Add</option> 
            <option value="Access">Access</option>
            <option value="Logout">Logout</option>
            </select>
            </>
            )}
            {localStorage.getItem('type') === 'buyer' && ( 
              <>
            <select
            value={selectedAction}
            onChange={handleActionChange}
            style={{ backgroundColor: "#793FDF", color: "white", border: "none",
             padding: "5px",borderRadius:"5px",marginLeft:"5px" }}
          >
            <option>Menu</option>
            <option value="Back">Cart</option>
            <option value="Logout">Logout</option>
            </select>  
            <div  style={{marginLeft:"10px",backgroundColor:"#793FDF",borderRadius:"5px" }}>
            🛒{cart.length}
            </div>
            <div>
            <input
      type="file"
      accept="image/*" // Specify the accepted file types
      onChange={handleFileChange}
      style={{ display: "none" }}
      ref={fileInputRef}
    />
    {/* <button onClick={() => fileInputRef.current.click()} style={{backgroundColor:"#7752FE"}}>Select Image</button>
    <button onClick={handleRemoveImage} style={{backgroundColor:"#7752FE"}}>Remove Image</button> */}
    <button onClick={handlewish} style={{backgroundColor:"#7752FE"}}>Wishlist</button>
          </div> 
          </>
            )}
             {(localStorage.getItem('type') === 'access'||localStorage.getItem('type') === 'companyaccess') && (  
              <button onClick={handlelogout}>Logout</button>
             )} 
          </div>
        {localStorage.getItem('type') === 'buyer' && (  
          <>
        
  
      
          <>
          <div style={{width:"350px",marginLeft:"800px"}}> 
          {later.length > 0 && (   
            <>
            {later.map((item, index) => (
               <LaterCard key={index} item={item} handlePayClick={(itemid) =>handlePay(itemid)} />
               
            ))}
            </>)}
          </div> 
          {Uniquereminder.length>0 &&(
          <div className="conrem">
            <Card style={{backgroundColor:"#ccccff",paddingLeft:"20px",paddingRight:"20px",paddingBottom:"10px"}}> 
              <> 
              <p style={{ fontSize: '24px', fontWeight: 'bold', color: ' #111' }}> Product Arrived</p>
          {(Uniquereminder).map((item, index) => (
            <tr key={index}>
              <td>{item.topic}</td> 
              <td><button className="lob" style={{marginLeft:"30px"}} onClick={() =>handleview(item.combo_id,item.id,item.topic)}>View</button></td>
       
            </tr>
          ))}
          </>
          </Card>
          </div>
          )}
        {uniqueItems.length > 0 && (
          
          <><h2>RECOMMENDED PRODUCTS:</h2>
         <div  className='class-contain' >
                
       {uniqueItems.map((item, index)  => (
              <CustomCard
                key={index}
                item={item}
                handleView={(itemid,itemName) => handleRecommendation(itemid,itemName)}
                showButton={true}
              /> 
            ))} 
            
       </div>
       </>
            )}
       </> 
       </>
      )}
      
        <div>
          {(localStorage.getItem('type') === 'seller'||localStorage.getItem('type') === 'company') && (
      <>
         <h2 style={{marginLeft:"10px"}}>SOLD HISTORY:</h2> 
         <div className="search-container">
          <input
          type="text"
          placeholder="Search..."
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="search-bar"
        />
        <select
          value={sortingCriteria}
          onChange={handleSortingChange}
          style={{ height: '35px',backgroundColor: "#6666ff",borderRadius:"5px"
            ,marginRight:"5px",color: "white",marginLeft:"800px"}}
        > <option value="">Sort</option>
          <option value="cost">By Cost</option>
          <option value="count">By Count</option>
          <option value="revenue">By Revenue</option>
        </select>
        
        </div>
        <div>
      <BarGraph data={sortedData} />
    </div>
         <table className="purchase-history-table">
          <thead>
           <tr>
            <th>Topic</th>
            <th>Count</th>
            <th>Cost</th>
            <th>Revenue</th> 
            <th>Stock</th> 
            <th>Add Stock</th>
          </tr>
        </thead>
        <tbody>
          {(sortedData).map((item, index) => (
            <tr key={index}>
              <td>{item.topic}</td>
              <td>{item.count}</td>
              <td>${item.cost}</td>
              <td>${item.cost * item.count}</td> 
              <td>{item.stockcount}</td> 
              <td><input
          type="number"
          value={inputValues[index]}
        onChange={(e) => handleChangein(index, e)}
          placeholder="Enter a number" 
          style={{ backgroundColor: "#713ABE", color: "white", 
             border: "none", padding: "5px",width:"50px",borderRadius:"5px",marginTop:"10px",marginLeft:"10px" }}
        />
        <button onClick={()=>handlestock(item.id,item.topic,index)} className="cart-button" >Add</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {(localStorage.getItem('type') === 'seller' ||localStorage.getItem('type') === 'company') &&(
        <>
        <h2>Users</h2>
      <table className="purchase-history-table">
      <thead>
           <tr>
            <th>id</th>
            <th>user</th>
            <th>type</th>
            <th>Remove</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {(user).map((item, index) => (
            <tr key={index}>
              <td>{item.id}</td>
              <td>{item.username}</td>
              <td>{item.type}</td>
              <td><button className="cart-button" onClick={() => handleRemove(item.id)} >Remove</button></td>
              <td><select
  value={selectValues[index]} // Use the state for this select element
  onChange={(e) => handleSelectChange(index, e.target.value)} // Pass the index and value
  style={{
    backgroundColor: "#713ABE",
    color: "white",
    border: "none",
    padding: "5px",
    borderRadius: "5px",
    marginTop: "10px",
    marginLeft: "10px"
  }}
>
  <option value="">Select Type</option>
  <option value="cost">Cost</option>
  <option value="count">Count</option>
  <option value="revenue">Revenue</option>
</select>
              <button className="cart-button" onClick={() => handleEdit(item.id,index)} >Edit</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      </>)}
        </>
          )} 
          
          {(localStorage.getItem('type') === 'access'||localStorage.getItem('type') === 'companyaccess') && (
       <> 
        <select
          value={accsortingCriteria}
          onChange={handleSortingChange1}
          style={{ height: '35px',backgroundColor: "#6666ff",borderRadius:"5px"
            ,marginRight:"5px",color: "white",marginLeft:"1100px"}}
        > <option value="">Sort</option>
          <option value="ass">Ascending</option>
          <option value="des">Descending </option>
          
        </select> 
        <br/>
        <br/>
      <table className="purchase-history-table">
          <thead>
           <tr>
            <th>Topic</th>
            <th>{typ}</th>
          </tr>
        </thead>
        <tbody>
          {(sorted).map((item, index) => (
            <tr key={index}>
              <td>{item.topic}</td> 
              <td>{typ === 'cost' ? item.cost : typ === 'count' ? item.count:item.count*item.cost}</td>        
            </tr>
          ))}
        </tbody>
      </table>
      </>
      )}
        </div>
       
      </div>
    );
  } 
  export default HomePage;
