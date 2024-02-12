import React, { useEffect, useState } from "react";
import CustomCard from "../cards/customcard";
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import '../../App.css';
import LaterCard from "../cards/Latercard";
import { Card } from "@mui/material";
import Cookies from 'js-cookie';
import Header from "./header"; 
import './homcom.css'
function Buyhome() {
  const username = Cookies.get('username');
  let typeo = Cookies.get('type');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [Items, setItems] = useState([]);
  const [reminder, setremider] = useState([]);
  const [Balance, setBalance] = useState(0);
  const [later, setLater] = useState('');

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

  useEffect(() => {
    fetchData(
      [`http://localhost:8080/balance/${username}`, `http://localhost:8080/historyhome/${username}`,
      `http://localhost:8080/reminder/getItems/${username}`, `http://localhost:8080/paylater/getpaylater/${username}`
      ],
      [setBalance, setItems, setremider, setLater]
    );
  }, []);

  const handleRecommendation = (id) => {
    Cookies.set('myID', id);
    Cookies.set('rec', "true");
    navigate(`/${typeo}/menext`);
  }

  const uniqueItems = Items.filter((item, index, self) => index === self.findIndex((t) => t.topic === item.topic));
  const Uniquereminder = reminder.filter((item, index, self) => index === self.findIndex((t) => t.topic === item.topic));

  const handlePay = async (id) => {
    try {
      enqueueSnackbar("id:" + id);
      const cartResponse = await fetch(`http://localhost:8080/getpaylat/${id}`);
      if (!cartResponse.ok) {
        throw new Error(`Error fetching cart items: ${cartResponse.statusText}`);
      }
      const cartData = await cartResponse.json();
      let total = 0;
      if (cartData.length > 0) {
        total = cartData[0].cost * cartData[0].count;
      }
      enqueueSnackbar("total:$" + total);
      if (Balance > total) {
        const newBalance = Balance - total;
        const markPaidResponse = await fetch(`http://localhost:8080/paidlater/${username}/${id}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!markPaidResponse.ok) {
          throw new Error(`Error transferring data: ${markPaidResponse.statusText}`);
        }
        const markPaidData = await markPaidResponse.text();
        const updateUserBalanceResponse = await fetch(`http://localhost:8080/updateUserBalance/${username}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newBalance),
        });
        
        if (!updateUserBalanceResponse.ok) {
          throw new Error(`Error updating user balance: ${updateUserBalanceResponse.statusText}`);
        }
        const updateUserBalanceData = await updateUserBalanceResponse.text();
        setBalance(newBalance);
        navigate(`/${typeo}/payment`);
        enqueueSnackbar("Payment Successful", { variant: "success" });
      } else {
        enqueueSnackbar("Insufficient Balance" + Balance + "  " + total, { variant: "warning" });
      }
    } catch (error) {
      console.error('Error handling payment:', error);
      enqueueSnackbar('Error handling payment:', error);
    }
  };

  const handleview = (comid, id) => {
    Cookies.set('myID', comid);
    Cookies.set('rec', "");
    Cookies.remove('value');
    fetch(`http://localhost:8080/api/reminderdelete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', },
      body: JSON.stringify({ id: id, username: Cookies.get('username') }),
    }).then((response) => {
      if (!response.ok) {
        throw new Error(`Error deleting reminder: ${response.statusText}`);
      } return response.json();
    }).then((data) => {
      navigate(`/${typeo}/menext`);
      enqueueSnackbar("Reminder deleted successfully");
    }).catch((error) => {
      console.error('Error deleting reminder:', error);
    });
    navigate(`/${typeo}/menext`);
  }

  return (<>
    <Header />
    <div>
      <div className="latercard">
        {later.length > 0 && (<>
          {later.map((item, index) => (
            <LaterCard key={index} item={item} handlePayClick={(itemid) => handlePay(itemid)} />
          ))}
        </>)}
      </div>
      {Uniquereminder.length > 0 && (
        <div className="conrem" data-testid="Reminder">
          <Card className="remindercard">
            <p className="remindermes"> Product Arrived</p>
            {(Uniquereminder).map((item, index) => (
              <tr key={index}>
                <td>{item.topic}</td>
                <td><button className="lob rembut" onClick={() => handleview(item.combo_id, item.id, item.topic)}>View</button></td>
              </tr>
            ))}
          </Card>
        </div>
      )}
      {uniqueItems.length > 0 && (
        <><h2  className="rembut" data-testid="Title">RECOMMENDED PRODUCTS:</h2>
          <div className='class-contain' data-testid="Card">
            {uniqueItems.map((item, index) => (
              <>
                <CustomCard
                  key={index}
                  item={item}
                  handleView={(itemid) => handleRecommendation(itemid)}
                  showButton={true} />
                {uniqueItems.combo_id}</>))}
          </div>
        </>)}
    </div>
  </>
  )
}
export default Buyhome;