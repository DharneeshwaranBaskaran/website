import React, { useState, useEffect } from 'react';
import DissatisfiedSymbol from './DissatisfiedSymbol';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useSnackbar } from "notistack";
import CustomCard from './customcard';
import './App.css'; 
import { useNavigate } from 'react-router-dom'; 
import withLogoutHandler from './withLogouthandler';
import { useLoginContext } from "../contexts/LoginContext";
import Cookies from 'js-cookie';
function Men() {
  const { enqueueSnackbar } = useSnackbar();
  const { jwt, setjwt } = useLoginContext();
  const navigate = useNavigate();
  const [ascending, setAscending] = useState(true);
  const [countSortAscending, setCountSortAscending] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const type = Cookies.get("type");
  const target = Cookies.get('myRef');
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const username = Cookies.get('username');
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  const handlemenex = (id, topic, sc) => {
    if (sc == 0) {
      fetch('http://localhost:8080/api/reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ combo_id: id, topic: topic, username }),
      }).then(response => response.json())
        .then(data => {
          console.log(data);
        }).catch(error => {
          console.error('Error sending id to the backend:', error);
        });
        navigate(`/${type}/homepage`);
          enqueueSnackbar("You will be Reminded if the stock arrives");
    }
    else {
      Cookies.set('myID', id);
      Cookies.set('rec', "");
      Cookies.remove('value');
      navigate(`/${type}/menext`);
    }
  }
  const handlebackhome = () => {
    navigate(`/${type}/homepage`);
  }
  const targetMappings = {
    1: { per: "men", fil1: "shirt", fil2: "pant", fil3: "tshirt", num: 1 },
    2: { per: "women", fil1: "top", fil2: "access", fil3: "bag", num: 2 },
    3: { per: "kid", fil1: "cloth", fil2: "foot", fil3: "bag", num: 3 },
  };
  const selectedMapping = targetMappings[target] || {};
  const { per, fil1, fil2, fil3, num } = selectedMapping;
  const toggleSorting = () => {
    setAscending(!ascending);
  };
  const toggleCountSorting = () => {
    setCountSortAscending(!countSortAscending);
  };
  useEffect(() => {
    fetch(`http://localhost:8080/api/combo/${per}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        } return response.json();
      })
      .then(data => {
        let sortedData = data;
        if (!ascending) {
          sortedData = sortedData.sort((a, b) => b.cost - a.cost);
        } else {
          sortedData = sortedData.sort((a, b) => a.cost - b.cost);
        }
        if (!countSortAscending) {
          sortedData = sortedData.sort((a, b) => b.count - a.count);
        }
        setData(sortedData);
      })
      .catch(error => {
        console.error('Error fetching history items:', error);
      });
  }, [per, ascending, countSortAscending]);
  const filteredData = data.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase()));
  const filterdata = data.filter(item => {
    const lowerCaseTopic = item.topic.toLowerCase();
    const lowerCaseCategory = item.cat.toLowerCase();
    const matchesSearchQuery = lowerCaseTopic.includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === '' || lowerCaseCategory === selectedCategory;
    return matchesSearchQuery && matchesCategory;
  });
  const f = filterdata.filter(item => item.count == 0);
  return (
    <div style={{ backgroundColor: "#e5e5ff", overflowX: 'hidden' }}> 
    {jwt ==Cookies.get('token')&& ( 
        <>
      <div className="logout-button">
        <Select
          style={{ height: '30px' }}
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value={fil1}>{fil1}</MenuItem>
          <MenuItem value={fil2}>{fil2}</MenuItem>
          <MenuItem value={fil3}>{fil3}</MenuItem>
        </Select> 
        <button onClick={handlebackhome} style={{ backgroundColor: "#5B0888" }}>Back 🏠</button>
        <button onClick={toggleModal} style={{ backgroundColor: "#713ABE" }}>Offer Products🎁</button>
        <button onClick={toggleSorting} style={{ backgroundColor: "#793FDF" }}>
          {ascending ? "Sort Descending ↓" : "Sort Ascending ↑"}
        </button>
        <button onClick={toggleCountSorting} style={{ backgroundColor: "#793FDF" }}>
          {countSortAscending ? "Most Purchased💎" : ""}
        </button>
      </div>
      <div className="search-container" data-testid="search-container">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-bar"
        />
      </div>
      <div className='class-contain' data-testid="custom-card">
        {showModal && (<>
          {(filteredData && filterdata).length === 0 ? (<> 
          
            <DissatisfiedSymbol />
            <h2 data-testid="no products">No products Found</h2>
          </>) :
            ((filteredData && f).map((item, index) => (
              <CustomCard
                key={index}
                item={item}
                handleView={(itemid, itemName, itemsc) => handlemenex(itemid, itemName, itemsc)}
                showButton={true}
              />
            ))
            )}
        </>)}
        {!showModal && (<>
          {filteredData && filterdata.length === 0 ? (<>
            <DissatisfiedSymbol />
            <h2>No products Found</h2>
          </>) :
            (filterdata.map((item, index) => (
              <CustomCard
                key={index}
                item={item}
                handleView={(itemid, itemName, itemsc) => handlemenex(itemid, itemName, itemsc)}
                showButton={true}
              />
            ))
            )}
        </>)}
      </div>
      <br /> 
      </>)}
    </div>
  )
}

export default withLogoutHandler(Men);
