import React, {useRef,useEffect, useState } from "react";
import ReactPlayer from 'react-player'; 
import Video from "./sam.mp4";
import CustomCard from "./customcard";
import { FaStar } from 'react-icons/fa'; 
import axios from "axios";
import { useSnackbar } from "notistack";
const VIDEO_PATH = 'https://www.youtube.com/watch?v=hHqW0gtiMy4';
function HomePage({click,tocart,reco,draft,addata,access}) {
  const { enqueueSnackbar } = useSnackbar();
  const [Items,setItems]=useState([]);
  const [Data,setData]=useState([]);  
  const [data,setdata]=useState([]);  
  const [pro,setpro]=useState([]);
  const username = localStorage.getItem('username'); 
  const [selectedPerson, setSelectedPerson] = useState(''); 
  let typeo=localStorage.getItem('type');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortingCriteria, setSortingCriteria] = useState(""); 
  const [personSortingCriteria, setPersonSortingCriteria] = useState('');
  const [accsortingCriteria, setAccSortingCriteria] = useState("");
  const [sortedData, setSortedData] = useState([]); 
  const [sorted,setsorted] = useState([]); 
  const [patch,setpatch]=useState([]); 
  const [prov,setprov]=useState('');
  const [typ,settye]=useState('');

  let count=0;
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
    // const playerRef = useRef(null); 
    
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
      axios.get(`http://localhost:8080/api/${typeo}/${username}`)
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
    let backButton = null;
    let addButton = null;
    let draftButton = null;
      if (typeo=="buyer") { 
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
      tocart(); 
      enqueueSnackbar("Redirecting to cart",{ variant:"default"});
    }
    else if(event.target.value=="Add")
    draft();
    else if(event.target.value=="Draft"){
      addata();
    }else if(event.target.value=="Access"){
     access();
    }
    else{
      localStorage.clear();
      window.location.reload()
      enqueueSnackbar("Logout Successful");
    }
  }; 
  const handlelogout =()=>{
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
      // const filteredData = Data.filter(item => item.topic.toLowerCase().includes(searchQuery.toLowerCase())); 
      // const filterdata=Data.filter(item => {
      //   const lowerCaseTopic = item.topic.toLowerCase();
      //   const lowerCaseCategory = item.person.toLowerCase();
      //   const matchesSearchQuery = lowerCaseTopic.includes(searchQuery.toLowerCase());
      //   const matchesCategory = selectedPerson === '' || lowerCaseCategory === selectedPerson;
      //   return matchesSearchQuery && matchesCategory;
      // });   
      // setpatch(filteredData && filterdata);
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
    return (
      <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }}> 
        <div className="logout-button">
        <button >{username}</button>
        {localStorage.getItem('type') === 'buyer' && (
          <>
          
      
    <select 
            onChange={handleChange} 
            style={{ backgroundColor: "#6666ff", color: "white", 
            border: "none", padding: "5px",borderRadius:"5px",marginRight:"5px" }}
          >
            <option>Weekend Delivery</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
            </select>
    
        <select 
        onChange={handleCategoryChange} 
         style={{ backgroundColor: "#6666ff", color: "white", 
         border: "none", padding: "5px",borderRadius:"5px",marginRight:"5px" }}> 
            <option>Category</option>
            <option value="Men">Men</option>
            <option value="Women">Women</option>
            <option value="Kids">Kids</option>
            
          </select>
          </>
        )}
            {(localStorage.getItem('type') === 'seller'||localStorage.getItem('type') === 'company') && (
            <>
            
            <select
            value={selectedAction}
            onChange={handleActionChange}
            style={{ backgroundColor: "#6666ff", color: "white", border: "none",
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
            <select
            value={selectedAction}
            onChange={handleActionChange}
            style={{ backgroundColor: "#6666ff", color: "white", border: "none",
             padding: "5px",borderRadius:"5px",marginLeft:"5px" }}
          >
            <option>Menu</option>
            <option value="Back">Cart</option>
            <option value="Logout">Logout</option>
            </select>
            )}
             {(localStorage.getItem('type') === 'access'||localStorage.getItem('type') === 'companyaccess') && (  
              <button onClick={handlelogout}>Logout</button>
             )} 
          </div>
        {localStorage.getItem('type') === 'buyer' && ( 
          <>
        {uniqueItems.length > 0 && (
          <><h2>RECOMMENDED PRODUCTS:</h2>
         <div  className='class-contain' >
                
       {uniqueItems.map((item, index)  => (
              <CustomCard
                key={index}
                item={item}
                handleView={(itemName) => handleRecommendation(itemName)}
                showButton={true}
              /> 
            ))} 
            
       </div>
       </>
            )}
       </> 
      )}
          
        <div>
          {/* <center>
            <video width="50%" height="50%" controls>
              <source src={Video} type="video/mp4" />
            </video>
          </center> */}
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
        {/* <select 
            style={{ height: '35px',backgroundColor: "#6666ff",borderRadius:"5px"
            ,marginRight:"5px",color: "white",marginLeft:"10px"}}
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
          >
            <option value="">All</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="kid">Kids</option>
          </select> */}
        </div>
        
         <table className="purchase-history-table">
          <thead>
           <tr>
            <th>Topic</th>
            <th>Count</th>
            <th>Cost</th>
            <th>Revenue</th>
          </tr>
        </thead>
        <tbody>
          {(sortedData).map((item, index) => (
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
