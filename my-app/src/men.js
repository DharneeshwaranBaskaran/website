import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button,Card, CardActions,CardContent,CardMedia,Rating,Typography,} from "@mui/material";
import { FaStar } from 'react-icons/fa'; 
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from "notistack";
function Men({menex,backhome}) {
  const { enqueueSnackbar } = useSnackbar();
    let num=1;
    const [selectedCategory, setSelectedCategory] = useState(''); 
    
    let per="";
    let fil1="";
    let fil2="";
    let fil3="";
    const target = localStorage.getItem('myRef');
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
   
    const handlemenex=(id)=>{
      localStorage.setItem('myID', id); 
      localStorage.setItem('rec',"");
      menex();
    }
    const handlebackhome=()=>{
      backhome();
    }
    
    if(target==1){
      per="men";
      fil1="shirt";
      fil2="pant";
      fil3="tshirt"; 
    }

    else if(target==2){
      per="women";
      fil1="top";
      fil2="access";
      fil3="bag";
      num=2;
    }
    else{
   
      per="kid"
      fil1="cloth";
      fil2="foot";
      fil3="bag";
      num=3;
    }
    useEffect(() => {
      axios.get(`http://localhost:8080/api/combo/${per}`)
          .then((response) => {
              setData(response.data);
          })
          .catch((error) => {
              console.error('Error fetching history items:', error);
          });
  }, [per]);
    
   
    const filteredData = data.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase())); 
    const filterdata=data.filter(item => {
      const lowerCaseTopic = item.topic.toLowerCase();
      const lowerCaseCategory = item.cat.toLowerCase();
      const matchesSearchQuery = lowerCaseTopic.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '' || lowerCaseCategory === selectedCategory;
      return matchesSearchQuery && matchesCategory;
    });
    return (
      <div style={{ backgroundColor:"lightgrey",
      overflowX: 'hidden'
       }}>
          <div className="logout-button">
          <Select 
            style={{ height: '30px' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value={fil1}>{fil1}</MenuItem>
            <MenuItem value={fil2}>{fil2}</MenuItem>
            <MenuItem value={fil3}>{fil3}</MenuItem>
          </Select>
            <button onClick={handlebackhome} style={{ backgroundColor: "darkgrey", }}>Back</button>
          </div>
          
          <div className="search-container">
          <input
          type="text"
          placeholder="Search..."
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          className="search-bar"
        />
     
        </div> 
          <div  className='class-contain' >
          
          {(filteredData&&filterdata).map(item => (
          <div key={item.id} className='class'>
          <Card >
            <CardMedia component="img" image={item.url} alt="img" />
            <CardContent className="card-content">
              <Typography gutterBottom variant="h6">
                <p>{item.topic}</p>
              </Typography> 
              <div class="contain">
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
                onClick={() => handlemenex(item.topic)}>
                view
              </Button>
            </CardActions>
          </Card> 
          </div>
        ))}
        </div> 
        <br/>
        
          
      </div>    
    )
  }

export default Men;
