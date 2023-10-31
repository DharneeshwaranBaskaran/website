import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DissatisfiedSymbol from './DissatisfiedSymbol'; // Import your dissatisfied symbol component
import { Button,Card, CardActions,CardContent,CardMedia,Rating,Typography,} from "@mui/material";
import { FaStar } from 'react-icons/fa'; 
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from "notistack";
import CustomCard from './customcard';
import './App.css'; 
import { useNavigate } from 'react-router-dom';
function Men() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
    let num=1;
    const [ascending, setAscending] = useState(true);   
    const [selectedCategory, setSelectedCategory] = useState(''); 
    const [showModal, setShowModal] = useState(false);
    let per="";
    let fil1="";
    let fil2="";
    let fil3="";
    const toggleModal = () => {
      setShowModal(!showModal);
    }; 
    const type=localStorage.getItem("type");
    const target = localStorage.getItem('myRef');
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
   
    const handlemenex=(id)=>{
      localStorage.setItem('myID', id); 
      localStorage.setItem('rec',"");
      localStorage.removeItem('value'); 
      console.log(localStorage.getItem("count"));
      // menex();
      
      navigate(`/${type}/menext`);
    }
    const handlebackhome=()=>{
      // backhome(); 
      
      navigate(`/${type}/homepage`);
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
    const toggleSorting = () => {
      setAscending(!ascending);
    };
    useEffect(() => {
      axios.get(`http://localhost:8080/api/combo/${per}`)
          .then((response) => {
            let sortedData = response.data;
            if (!ascending) {
              // Sort the data based on the "cost" property in descending order
              sortedData = sortedData.sort((a, b) => b.cost - a.cost);
            } else {
              // Sort the data based on the "cost" property in ascending order
              sortedData = sortedData.sort((a, b) => a.cost - b.cost);
            }
            setData(sortedData);
          })
          
          .catch((error) => {
              console.error('Error fetching history items:', error);
          });
  }, [per,ascending]);
  
  
    
    const filteredData = data.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase())); 
    const filterdata=data.filter(item => {
      const lowerCaseTopic = item.topic.toLowerCase();
      const lowerCaseCategory = item.cat.toLowerCase();
      const matchesSearchQuery = lowerCaseTopic.includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === '' || lowerCaseCategory === selectedCategory;
      return matchesSearchQuery && matchesCategory;
    });
    const f=filterdata.filter(item =>item.count == 0);
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
            <button onClick={toggleSorting}>
          {ascending ? "Sort Descending" : "Sort Ascending"}
        </button>
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
          {(filteredData && filterdata).length === 0 ? (
        // Render the dissatisfied symbol 
        <>
        <DissatisfiedSymbol />
        <br/>
        <br/>
        <h2>No products Found</h2>
        
        
        </>
      ) : (
        
       (filteredData && f).map((item, index)  => (
          <CustomCard
            key={index}
            item={item}
            handleView={(itemName) => handlemenex(itemName)}
            showButton={true}
          />
        ))
      )}
        </>
        )}
          {!showModal &&( <>
      {filteredData && filterdata.length === 0 ? (
        // Render the dissatisfied symbol 
        <>
        <DissatisfiedSymbol />
        <br/>
        <br/>
        <h2>No products Found</h2>
        
        
        </>
      ) : (
        
        filterdata.map((item, index) => (
          <CustomCard
            key={index}
            item={item}
            handleView={(itemName) => handlemenex(itemName)}
            showButton={true}
          />
        ))
      )}
    </>
        )}
      </div>
      <br/>   
    </div>    
    )
  }

export default Men;
