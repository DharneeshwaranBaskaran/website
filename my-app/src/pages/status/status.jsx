import React, { useState, useEffect } from "react";
import { enqueueSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from "js-cookie"; 
import Statustable from "../../components/statustable/statustable";
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
      {jwt == Cookies.get('token') && (
        <>
          <div className="logout-button">
            <button onClick={handlehome} className="purple">Home</button>
          </div>
          <Statustable
            data={Data}
            handleSelectChange={handleSelectChange}
            handleEdit={handleEdit}
          />
        </>
      )}
    </div>
  );
}

export default withLogoutHandler(Status);