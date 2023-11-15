import React, {useRef,useEffect, useState} from "react";
import backpic from "./images/backpic.jpg"; 
import axios from "axios";
import ReactPlayer from 'react-player'; 
import CustomCard from "./customcard";
import { useNavigate } from 'react-router-dom';
import DissatisfiedSymbol from './DissatisfiedSymbol';
import Autosuggest from 'react-autosuggest';

import './App.css'; 
const VIDEO_PATH = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';
function Start(){ 
  const [type, setType] = useState(localStorage.getItem('type'));
    const navigate = useNavigate();
    const [searchValue, setSearchValue] = useState(''); 
    const [data,setData]=useState([]); 
    const [value, setValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; 
    const handletomenex=(id)=>{
      localStorage.setItem('myID', id); 
      localStorage.setItem('rec',"");
      localStorage.setItem('value',"");
      
      navigate(`/${type}/menext`);
    }
    const handletologin=(key)=>{
       
        if(key==2)
        localStorage.setItem('type',"buyer");
        else if(key==1)
        localStorage.setItem('type',"seller");
        else if(key==0){
        localStorage.setItem('type',"company");  
        }
        else if(key==4){
          localStorage.setItem('type',"companyaccess"); 
        }
        else{
        localStorage.setItem('type',"access"); 
        }
        navigate(`/${localStorage.getItem('type')}/login`);
        window.location.reload();
    }
    const handletoregister=(key)=>{
        
        if(key==2)
        localStorage.setItem('type',"buyer");
        else if(key==0){
        localStorage.setItem('type',"company");  
        }
        else{
        localStorage.setItem('type',"seller");
        }
        navigate(`/${localStorage.getItem('type')}/register`);
        window.location.reload();
        
    }  
    const playerRef = useRef(null);
    useEffect(() => {
      axios.get(`http://localhost:8080/api/combodata`)
          .then((response) => {
              setData(response.data);
          })
          .catch((error) => {
              console.error('Error fetching history items:', error);
          });
  }, []);
  const uniqueItems = Array.isArray(data)
      ? data.filter((item, index, self) =>
          index === self.findIndex((t) => t.topic === item.topic)
      )
      : [];
     
      const onInputChange = (event, { newValue }) => {
        setValue(newValue); // Update the value state directly
      };
     
      const suggestions = uniqueItems.map(item => item.topic);

  // Suggestions to be shown in the autosuggest dropdown
  const [suggestionsList, setSuggestionsList] = useState([]);

  // Autosuggest suggestion update handler
  const onSuggestionsFetchRequested = ({ value }) => {
  const inputValue = (value || '').toLowerCase(); // Ensure value is not undefined
  setSuggestionsList(getSuggestions(inputValue));
};

const filteredItems = uniqueItems.filter((item) => {
  const inputValue = (value || '').toLowerCase(); // Ensure value is not undefined
  return item.topic.toLowerCase().includes(inputValue);
});
  // Autosuggest suggestion clear handler
  const onSuggestionsClearRequested = () => {
    setSuggestionsList([]);
  };

  // Function to get suggestions based on user input
  const getSuggestions = (value) => {
    const inputValue = value.toLowerCase();
    const inputLength = inputValue.length;

    return inputLength === 0
      ? []
      : suggestions.filter(suggestion =>
        suggestion.toLowerCase().slice(0, inputLength) === inputValue
      );
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = pageNumber => setCurrentPage(pageNumber);
    return (
        <div style={{ backgroundImage: `url(${backpic})` , minHeight: "500vh" }}> 
        <div className="logout-button">
          <button onClick={() =>handletoregister(2) }>Register</button>
           <button onClick={() =>handletologin(2)}>Login</button>       
                </div>
                     
        <h2 style={{textAlign:"center"}}> MOST PURCHASED PRODUCTS: </h2>
        {/* <img  style={{height:"200px",paddingLeft:"40px"}}src="https://media1.giphy.com/media/wcmTjQoJVqMCOZpVLs/giphy.gif?cid=ecf05e47xo1xor0ksplnwojpq4lljhnto8hihwehzlc3eiuu&ep=v1_gifs_search&rid=giphy.gif&ct=g"></img>
        <img  style={{height:"200px",paddingLeft:"40px"}}src="https://media.tenor.com/Tdn9eRKG_5kAAAAi/shopaholic-malls.gif"></img>
         */}
        <div className="search-container">
       
        <Autosuggest
          value={searchValue} 
          suggestions={suggestionsList}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          getSuggestionValue={suggestion => suggestion}
          renderSuggestion={suggestion => <div>{suggestion}</div>}
          inputProps={{
            placeholder: "Search Products",
            value: value,
            onChange: onInputChange,
          }}
        />
      </div>
        <div  className='class-contain' >
       {(currentItems).length !== 0 ? (
          <>
            {(currentItems).map(item => (
              <CustomCard
                key={item.id}
                item={item}
                handleView={(itemName) => handletomenex(itemName)}
              />
            ))}
            
          </>
       ):(<>
        <DissatisfiedSymbol />
        <br/>
        <br/>
        <h2>No products Found</h2>
        
        
        </>)}
       </div >
       <div className="pagination">
          <ul>
            {Array.from({ length: Math.ceil(filteredItems.length / itemsPerPage) }, (_, i) => (
              <li key={i} onClick={() => paginate(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
                {i + 1}
              </li>
              
            ))}
          </ul>
        </div>
        
       <br/>
        <div className="video-container">
          <ReactPlayer ref={playerRef} url={VIDEO_PATH} controls={true} /> 
        </div>
        <div style={{ textAlign: "center" }}> 
        
        <h2>Want To Sell Your Product In Our Website: <br/>
       
                 <div class="registration-container">
                  <div class="individual-registration">
                    <h4>As Individual:</h4>
                    <button className="lob" onClick={() => handletoregister(1)}>Register</button>
                    <button className="lob" onClick={() => handletologin(1)}>Login</button>
                  </div>
                  <div class="company-registration">
                    <h4>As Company:</h4>
                    <button className="lob" onClick={() => handletoregister(0)}>Register</button>
                    <button className="lob" onClick={() => handletologin(0)}>Login</button>
                  </div>
                </div>
                 </h2> 
                 </div>
        
                 <div style={{textAlign:"center"}}>
                  <h2>Are You a DataBase Viewer?</h2>
                  <div class="registration-container">
                  <div class="individual-registration">
                      <h4>Individual:</h4>
                      <button className="lob" style={{ marginLeft: '0px' }} onClick={() => handletologin(3)}>Login</button>
                    </div>
                    <div class="company-registration">
                      <h4>Company:</h4>
                      <button className="lob" style={{ marginLeft: '0px' }} onClick={() => handletologin(4)}>Login</button>
                    </div>
                  </div>
                </div>

        </div>     
    )
}
export default Start;
