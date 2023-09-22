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
    const [cat,setcat]=useState('');
    const [cost,setcost]=useState();
    const [id,setid]=useState();
    const [description,setdescription]=useState('');
    const [rating,setrating]=useState(); 
    const [url,seturl]=useState(''); 
    const [topic,settopic]=useState('');
    const [person,setperson]=useState('');
    const [removeId, setRemoveId] = useState();
    const [removeTopic, setRemoveTopic] = useState('');
    let per="";
    let fil1="";
    let fil2="";
    let fil3="";
    const target = localStorage.getItem('myRef');
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
   
    const addData = async () => {
                    
      const response = await fetch('http://localhost:8080/api/adddata', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id,cat,cost,description,rating,url,topic,person}),
        credentials: 'include',
      }); 
      
      if (response.ok ) {
        
          enqueueSnackbar("Data Added Sucessfully",{ variant:"success" });  
          backhome();   
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
        body: JSON.stringify({ id: removeId, topic: removeTopic }),
        credentials: 'include',
      }); 
      
      if (response.ok ) {
        
          enqueueSnackbar("Data Removed Sucessfully",{variant:"success" });  
          backhome();   
          }
      else if (response.status === 409) {
              const errorData = await response.json();
              enqueueSnackbar(errorData.error,{variant:"error" });
          }  
          
    }
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
        {localStorage.getItem('type') =="seller" && (
        
      
        <div className='contain'>
        
        <div className="login-page" style={{backgroundColor:"white"}}> 
                <h2>ADD DATA</h2> 
                <div className="con">
                <input
                    type="Long"
                    placeholder="Id"
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
                <h2>Remove Data</h2> 
                <div className="con">
                <input
                    type="Long"
                    placeholder="Id"
                    value={removeId}
                    onChange={(e) => setRemoveId(e.target.value)}
                   
                />
                <input
                    type="text"
                    placeholder="Topic" 
                    value={removeTopic}
                    onChange={(e) => setRemoveTopic(e.target.value)}
                   
                />
                </div>
               <button className="lob" onClick={removeData}>
                Remove Data</button> 
                </div>
           </div> 
           
           )}
          
      </div>    
    )
  }

export default Men;
