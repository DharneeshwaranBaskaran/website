import React, { useState,useEffect } from "react";
import { enqueueSnackbar} from "notistack";
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie";
const Status = () => {
  const Username = Cookies.get("username");
  const navigate = useNavigate();
  const { jwt, setjwt } = useLoginContext();
  const [Data, setData] = useState([]);
  const [selectValues, setSelectValues] = useState([]);
  const handlehome = () => {
    navigate(`/${Cookies.get("type")}/homepage`);
  }
  const fetchData = async (urls, setDataCallbacks) => {
    try {
      const responses = await Promise.all(
        urls.map(url => fetch(url).then(response => response.json()))
      );
      responses.forEach((data, index) => {
        setDataCallbacks[index](data);
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const handleSelectChange = (index, value) => {
    const newSelectValues = [...selectValues];
    newSelectValues[index] = value;
    setSelectValues(newSelectValues);
};
  useEffect(() => {
    fetchData(
      [`http://localhost:8080/status/${Username}`],
      [setData]
    ); 
  }, []);

  
  const handleEdit = async (id, index) => {
    const response = await fetch(`http://localhost:8080/api/updatestatus`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: JSON.stringify({ id, status: selectValues[index] }),
        credentials: 'include',
    });
    if (response.ok) {
        enqueueSnackbar("Registration Successful", { variant: "success" }); 
        window.location.reload();
    } else if (response.status === 409) {
        const errorData = await response.json();
        enqueueSnackbar(errorData.error, { variant: "error" });
    } else {
        enqueueSnackbar("Registration Failed", { variant: "error" });
    }
}
  return (
    
    <div className="backgroundcol">
      {jwt ==Cookies.get('token')&& ( 
      <>
      <div className="logout-button"   >
        <button onClick={handlehome} >Home </button>
      </div>
      <table className="purchase-history-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Topic</th>
                            <th>Count</th> 
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Data).map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.topic}</td>
                                <td>{item.count}</td> 
                                <td><td><select
                                // value={selectValues[index]}
                                onChange={(e) => handleSelectChange(index, e.target.value)}
                                style={{ backgroundColor: "#713ABE", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginTop: "10px", marginLeft: "10px" }}>
                                <option value="">Current status:{item.status}</option>
                                <option value="Order Placed">Order Placed</option>
                                <option value="Shipping">Shipping</option>
                                <option value="Out For Delivery">Out For Delivery</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                                <button className="cart-button" onClick={() => handleEdit(item.id, index)} >Edit</button></td>
                        </td>
                               </tr>
                        ))}
                    </tbody>
                </table>
      </> 
    )}
    </div>
  );
}
export default withLogoutHandler(Status);