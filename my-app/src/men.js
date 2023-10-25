import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button,Card, CardActions,CardContent,CardMedia,Rating,Typography,} from "@mui/material";
import { FaStar } from 'react-icons/fa'; 
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from "notistack";
import CustomCard from './customcard';
function Men({menex,backhome}) {
  const { enqueueSnackbar } = useSnackbar();
    let num=1;
    const [selectedCategory, setSelectedCategory] = useState(''); 
    const [showModal, setShowModal] = useState(false);
    let per="";
    let fil1="";
    let fil2="";
    let fil3="";
    const toggleModal = () => {
      setShowModal(!showModal);
    };
    const target = localStorage.getItem('myRef');
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
   
    const handlemenex=(id)=>{
      localStorage.setItem('myID', id); 
      localStorage.setItem('rec',"");
      localStorage.removeItem('value'); 
      console.log(localStorage.getItem("count"));
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
    
    const f=data.filter(item =>item.count == 0);
    const filteredData = data.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase())); 
    const filterdata=data.filter(item => {
      const lowerCaseTopic = item.topic.toLowerCase();
      const lowerCaseCategory = item.cat.toLowerCase();
      const matchesSearchQuery = lowerCaseTopic.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '' || lowerCaseCategory === selectedCategory;
      return matchesSearchQuery && matchesCategory;
    });
    return (
      <div style={{ backgroundColor:"#e5e5ff",
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
            <button onClick={handlebackhome}>Back</button>
            <button onClick={toggleModal}>Offer Products</button>
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
        
        <div className='class-contain'>
        {showModal &&(<>
        {(filteredData && filterdata && f).map((item, index)  => (
          <CustomCard
            key={index}
            item={item}
            handleView={(itemName) => handlemenex(itemName)}
            showButton={true}
          />
        ))}
        </>
        )}
          {!showModal &&(<>
        {(filteredData && filterdata).map((item, index)  => (
          <CustomCard
            key={index}
            item={item}
            handleView={(itemName) => handlemenex(itemName)}
            showButton={true}
          />
        ))}
        </>
        )}
      </div>
      <br/>   
    </div>    
    )
  }

export default Men;
