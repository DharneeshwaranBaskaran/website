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
      </Routes>
    </Router>
  </SnackbarProvider>
</div>
  );
}
export default App;
