import React, { useEffect, useState } from "react";
import './App.css'; 
import HomePage from "./homepage";
import Men from "./men";
import Menext from "./menext";
import Cart from "./cart";
import Payment from "./payment";
import Add from "./add";
import History from "./history";
import Start from "./start";  
import Edit from "./edit";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import LoginPage from './loginpage';
import RegisterPage from './register';
import Edituser from "./Edituser"; 
import Help from "./help";  
import Phone from "./Wish";
import User from "./User"; 
import Address from "./address"; 
// import Email from "./email";
import Email from "./Email";
function App() {
  let type=localStorage.getItem('type');
  return (
  <div >
  <SnackbarProvider>
    <Router>
      <Routes>
      
        <Route path="/start" element={<Start />} />
        <Route path={`/${type}/register`} element={<RegisterPage />} />
        <Route path={`/${type}/login`} element={<LoginPage />} /> 
        <Route path={`/${type}/homepage`} element={<HomePage />}/> 
        <Route path={`/${type}/men`} element={<Men />}/>
        <Route path={`/${type}/menext`} element={<Menext />}/> 
        <Route path={`/${type}/cart`} element={<Cart />}/> 
        <Route path={`/${type}/payment`} element={<Payment/>}/>
        <Route path={`/${type}/history`} element={<History/>}/>
        <Route path={`/${type}/add`}element={<Add/>}/>
        <Route path={`/${type}/edit`} element={<Edit/>}/>
        <Route path={`/${type}/edituser`} element={<Edituser/>}/> 
        <Route path={`/${type}/help`} element={<Help/>}/>
        <Route path={`/${type}/phone`} element={<Phone/>}/>
        <Route path={`/${type}/user`}element={<User/>}/>
        <Route path={`/${type}/address`}element={<Address/>}/> 
        <Route path={`/${type}/mail`}element={<Email/>}/>
      </Routes>
    </Router>
  </SnackbarProvider>
</div>
  );
}
export default App;
