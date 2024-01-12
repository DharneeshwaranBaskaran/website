import React, { useState,lazy, Suspense} from "react";
import HomePage from './component/homepage';
import Men from './component/men';
import Menext from './component/menext';
import Cart from "./component/cart";
import Payment from "./component/payment";
import Add from "./component/add";
import History from "./component/history";
import Edit from "./component/edit";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Help from "./component/help";  
import Phone from "./component/Wish";
import User from "./component/User"; 
import Address from "./component/address"; 
import Email from "./component/Email"; 
import Reset from "./component/reset"; 
import { LoginContext } from "./contexts/LoginContext";
import Cookies from "js-cookie";
const Home = lazy(() => import('./component/homepage'));
const Start = lazy(() => import('./component/start'));
const LoginPage = lazy(() => import('./component/loginpage'));
const RegisterPage = lazy(() => import('./component/register')); 
function App() {
  let type=Cookies.get('type');
  const [showModal,setShowModal]=useState(false); 
  const [Balance, setBalance] = useState(0);  

  const [jwt, setjwt] = useState(() => Cookies.get('token') || '');
  return (
  <div >
  <SnackbarProvider>
    <Router>
      <LoginContext.Provider value={{ Balance,setBalance,showModal, setShowModal,jwt,setjwt}}>
      <Suspense fallback={<div><h1>⌛Loading...</h1></div>}>
      <Routes> 
      
      {(type == "access" || type==="companyaccess") ? (
                <>
        <Route path="/start" element={<Start/>} />
        <Route path={`/${type}/login`} element={!showModal ? <LoginPage /> : <Reset />} />
        <Route path={`/${type}/homepage`} element={<Home />}/> 
                </>
              ) 
               : (<>
        <Route path="/start" element={<Start/>} />
        <Route path={`/${type}/register`} element={<RegisterPage />} />
        <Route path={`/${type}/login`} element={!showModal ? <LoginPage /> : <Reset />} />
        <Route path={`/${type}/homepage`} element={<HomePage />}/> 
        <Route path={`/${type}/men`} element={<Men />}/>
        <Route path={`/${type}/menext`} element={<Menext />}/> 
        <Route path={`/${type}/cart`} element={<Cart />}/> 
        <Route path={`/${type}/payment`} element={<Payment/>}/>
        <Route path={`/${type}/history`} element={<History/>}/>
        <Route path={`/${type}/add`}element={<Add/>}/>
        <Route path={`/${type}/edit`} element={<Edit/>}/>
        <Route path={`/${type}/help`} element={<Help/>}/>
        <Route path={`/${type}/phone`} element={<Phone/>}/>
        <Route path={`/${type}/user`}element={<User/>}/>
        <Route path={`/${type}/address`}element={<Address/>}/> 
        <Route path={`/${type}/mail`}element={<Email/>}/>
        </>
              )}
             
        </Routes>
        </Suspense>
        </LoginContext.Provider>      
    </Router>
  </SnackbarProvider>
</div>
  );
}
export default App;
