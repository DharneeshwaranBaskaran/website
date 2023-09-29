import React, {useRef,useEffect, useState } from "react";
import ReactPlayer from 'react-player'; 
import Video from "./sam.mp4";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CustomCard from "./customcard";
import { Button,Card, CardActions,CardContent,CardMedia,Rating,Typography,} from "@mui/material";
import { FaStar } from 'react-icons/fa'; 
import axios from "axios";
import { useSnackbar } from "notistack";
const VIDEO_PATH = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';
function HomePage({click,tocart,homelog,reco,draft,addata}) {
  const { enqueueSnackbar } = useSnackbar();
  const [Items,setItems]=useState([]);
  const [Data,setData]=useState([]);
  const [person,setPerson]=useState([]);
  const username = localStorage.getItem('username'); 
  const [selectedPerson, setSelectedPerson] = useState(''); 
  let type=localStorage.getItem('type');
  const [searchQuery, setSearchQuery] = useState('');
    const redirecttocart=()=>{
       tocart(); 
       enqueueSnackbar("Redirecting to cart",{ variant:"default"});
    }; 
    const redirecttodraft=()=>{
      draft();
    }
    const redirecttoadd=()=>{
      addata();
    }
   
    const handleRecommendation = (id)=>{
      
      localStorage.setItem('myID', id); 
      localStorage.setItem('rec',"true");
      reco();
    }
    const playerRef = useRef(null); 
    const logout=()=>{
      localStorage.removeItem('username');
      window.location.reload()
      enqueueSnackbar("Logout Successful");

    }
    useEffect(() => {
      axios.get(`http://localhost:8080/api/getperson/${username}`)
        .then((response) => {
            setPerson(response.data[0].person); // Extract and set the person value

        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    }, [username]);
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
    const uniqueItems = Items.filter((item, index, self) =>
    index === self.findIndex((t) => t.topic === item.topic)
    );  
    let backButton = null;
    let addButton = null;
    let draftButton = null;
      if (type=="buyer") { 
        backButton = (
          <button onClick={redirecttocart}>View Cart</button>
         );
          }
         else{
          backButton=(
            <button onClick={redirecttocart}>Cart Details</button>
          );
          addButton=(
            <button onClick={redirecttodraft}>ADD & REMOVE</button>
          );
          draftButton=(
            <button onClick={redirecttoadd}>Draft</button>
          );
      }
      const [selectedCategory, setSelectedCategory] = useState(""); // Default category

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
    
    click();
  };
  
  const [selectedAction, setSelectedAction] = useState(""); // Default action
  const handleActionChange = (event) => {
    // setSelectedAction(event.target.value);
    if(event.target.value=="Back"){
      tocart(); 
      enqueueSnackbar("Redirecting to cart",{ variant:"default"});
    }
    else if(event.target.value=="Add")
    draft();
    else if(event.target.value=="Draft"){
      addata();
    }
    else{
      localStorage.removeItem('username');
      window.location.reload()
      enqueueSnackbar("Logout Successful");
    }
  };
  const filteredData = Data.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase())); 
    const filterdata=Data.filter(item => {
      const lowerCaseTopic = item.topic.toLowerCase();
      const lowerCaseCategory = item.person.toLowerCase();
      const matchesSearchQuery = lowerCaseTopic.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedPerson === '' || lowerCaseCategory === selectedPerson;
      return matchesSearchQuery && matchesCategory;
    });

    return (
      <div style={{ backgroundColor: "lightgrey", minHeight: "100vh" }}> 
        <div className="logout-button">
        <button >{username}</button>
        <select value={selectedCategory} onChange={handleCategoryChange} 
         style={{ backgroundColor: "grey", color: "white", 
         border: "none", padding: "5px",borderRadius:"5px",marginRight:"5px" }}> 
            <option>Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            
          </select>
            
            {localStorage.getItem('type') === 'seller' && (
            <>
            <select 
            style={{ height: '35px',backgroundColor: "grey",borderRadius:"5px"
            ,marginRight:"5px",color: "white",marginLeft:"5px"}}
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
          >
            <option value="">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kids</option>
          </select>
            <select
            value={selectedAction}
            onChange={handleActionChange}
            style={{ backgroundColor: "grey", color: "white", border: "none",
             padding: "5px",borderRadius:"5px",marginLeft:"5px"  }}
          >
            <option>Menu</option>
            <option value="Back">Cart</option>
            <option value="Add">Remove</option>
            <option value="Draft">Add</option>
            <option value="Logout">Logout</option>
            </select>
            </>
            )}
            {localStorage.getItem('type') === 'buyer' && (
            <select
            value={selectedAction}
            onChange={handleActionChange}
            style={{ backgroundColor: "grey", color: "white", border: "none",
             padding: "5px",borderRadius:"5px",marginLeft:"5px" }}
          >
            <option>Menu</option>
            <option value="Back">Cart</option>
            <option value="Logout">Logout</option>
            </select>
            )}
            {/* {backButton}
            {addButton}
            {draftButton}
            <button onClick={logout} >
              Logout
            </button>  */}
          </div>
          {localStorage.getItem('type') === 'seller' && (
            
          <div className="search-container">
          <input
          type="text"
          placeholder="Search..."
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="search-bar"
        />
        </div>
        )}

        
        {uniqueItems.length > 0 && (
          <><h2>RECOMMENDED PRODUCTS:</h2>
         <div  className='class-contain' >
         
         {/* {(uniqueItems).map(item => (
         <div key={item.id} className='class'>
         <Card >
           <CardMedia component="img" image={item.url} alt="img" />
           <CardContent className="card-content" style={{ padding: '0px'}}>
             <Typography gutterBottom variant="h6">
               <p style={{textAlign:"center"}}>{item.name}</p>
             </Typography> 
             <div class="contain" style={{marginLeft: '25px'}}>
             <Typography gutterBottom fontWeight="bold">
               <p>${item.cost}</p>
             </Typography> 
             
             <Typography gutterBottom fontWeight="bold"> 
             <div className='star-Rating'>
             <FaStar size={15} color="black" />{item.rating}
             </div>    
             
             </Typography>
             </div>
           </CardContent>
           <CardActions className="card-actions">
             <Button
               variant="contained"
               className="card-button"
               fullWidth
               onClick={() =>handleRecommendation(item.name)}>
               view
             </Button>
           </CardActions>
         </Card> 
         </div>
       ))} */}
       {uniqueItems.map(item => (
              <CustomCard
                key={item.id}
                item={item}
                handleView={(itemName) => handleRecommendation(itemName)}
                showButton={true}
              />
            ))}
       </div>
       </> 
      )}
          
        <div>
          {/* <center>
            <video width="50%" height="50%" controls>
              <source src={Video} type="video/mp4" />
            </video>
          </center> */}
          {localStorage.getItem('type') === 'seller' && (
      <>
         <h2>PURCHASE HISTORY:</h2>
         <table className="purchase-history-table">
          <thead>
           <tr>
            <th>Topic</th>
            <th>Count</th>
            <th>Cost</th>
            <th>Total Cost</th>
          </tr>
        </thead>
        <tbody>
          {(filteredData&&filterdata).map((item, index) => (
            <tr key={index}>
              <td>{item.topic}</td>
              <td>{item.count}</td>
              <td>${item.cost}</td>
              <td>${item.cost * item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>

        </>
          )}
        </div>
         {/* {person} */}
        
      </div>
    );
  } 
  export default HomePage;
