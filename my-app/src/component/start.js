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
    const [data,setData]=useState([]); 
    const [value, setValue] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 15; 

    const handletomenex = (id) => {
      localStorage.setItem('myID', id); 
      localStorage.setItem('rec',"");
      localStorage.setItem('value',"");
      navigate(`/${type}/menext`);
    };
    const RegistrationOption = ({ type, header, handleRegister, handleLogin }) => (
      <div className="individual-registration">
        <h4>{header}</h4>
        <button className="lob" onClick={() => handleLogin(type)}>Login</button>
        {handleRegister && <button className="lob" onClick={() => handleRegister(type)}>Register</button>}
      </div>
    );
  
    const handleAuthentication = (key, action) => {
      const types = {  0: 'company',  1: 'seller',  2: 'buyer',  3: 'access',  4: 'companyaccess',  };
      const type = types[key];
      if (action === 'login') {
        localStorage.setItem('type', type);
        navigate(`/${type}/login`);
      } else if (action === 'register') {
        localStorage.setItem('type', type);
        navigate(`/${type}/register`);
      }
      window.location.reload();
    };
 
    const handletologin = (key) => {
      handleAuthentication(key, 'login');
    };

    const handletoregister = (key) => {
      handleAuthentication(key, 'register');
    };
    
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
        ? data.filter((item, index, self) =>index === self.findIndex((t) => t.topic === item.topic))
        : [];
      
      const onInputChange = (event, { newValue }) => {
        setValue(newValue);
      };
     
      const suggestions = uniqueItems.map(item => item.topic);
      const [suggestionsList, setSuggestionsList] = useState([]);
      const onSuggestionsFetchRequested = ({ value }) => {
      const inputValue = (value || '').toLowerCase(); 
      setSuggestionsList(getSuggestions(inputValue));
      };

      const filteredItems = uniqueItems.filter((item) => {
        const inputValue = (value || '').toLowerCase(); 
        return item.topic.toLowerCase().includes(inputValue);
      });

      const onSuggestionsClearRequested = () => {
        setSuggestionsList([]);
      };

      const getSuggestions = (value) => {
        const inputValue = value.toLowerCase();
        const inputLength = inputValue.length;
        return inputLength === 0
          ? []
          : suggestions.filter(suggestion =>suggestion.toLowerCase().slice(0, inputLength) === inputValue);
      };

      const currentItems = filteredItems.slice(((currentPage * itemsPerPage) - itemsPerPage), currentPage * itemsPerPage);
      const paginate = pageNumber => setCurrentPage(pageNumber);
    return (
        <div style={{ backgroundImage: `url(${backpic})` , minHeight: "520vh" }}> 
        <div className="logout-button" style={{marginLeft:"800px"}}>
        <RegistrationOption type={2} handleRegister={handletoregister} handleLogin={handletologin} />
        </div>             
        <h2 style={{textAlign:"center"}}> MOST PURCHASED PRODUCTS: </h2>
        <div className="search-container"> 
        <Autosuggest
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
        </div><br/>
        <div className="video-container">
          <ReactPlayer ref={null} url={VIDEO_PATH} controls={true} /> 
        </div>
        <div style={{ textAlign: "center" }}>
          <h2>Want To Sell Your Product In Our Website: <br />
          <RegistrationOption type={1} header={"As Individual:"} handleRegister={handletoregister} handleLogin={handletologin} />
          <RegistrationOption type={0} header={"As company:"} handleRegister={handletoregister} handleLogin={handletologin} />
          </h2>
          <h2>Are You a DataBase Viewer?</h2>
          <RegistrationOption type={3} header={"As Individual:"} handleLogin={handletologin} />
          <RegistrationOption type={4} header={"As company:"} handleLogin={handletologin} />
        </div>
      </div>     
    )
}
export default Start;
