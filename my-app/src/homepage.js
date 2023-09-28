import React, {useRef,useEffect, useState } from "react";
import ReactPlayer from 'react-player'; 
import Video from "./sam.mp4";
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
  let type=localStorage.getItem('type');
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
    const handleRedirect = (id) => {
      localStorage.setItem('myRef', id);
      click();
    };
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
    index === self.findIndex((t) => t.name === item.name)
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
    return (
      <div style={{ backgroundColor: "lightgrey", minHeight: "100vh" }}> 
          <div className="logout-button">
          <div>
          <button className="but" onClick={() => handleRedirect(1)} >Men</button>
          <button className="but" onClick={() => handleRedirect(2)}>Women</button>
          <button className="but" onClick={() => handleRedirect(3)}>Kids</button>
        </div>
            <button >{username}</button>
            {backButton}
            {addButton}
            {draftButton}
            <button onClick={logout} >
              Logout
            </button> 
          </div>
        
        {uniqueItems.length > 0 && (
          <><h2>RECOMMENDED PRODUCTS:</h2>
         <div  className='class-contain' >
         
         {(uniqueItems).map(item => (
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
          {Data.map((item, index) => (
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
