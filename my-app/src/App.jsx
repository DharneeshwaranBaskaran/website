import React, { useState,lazy, Suspense} from "react";
import HomePage from './component/homepage/homepage';
import Men from './component/productpage/men';
import Menext from './component/productpage/menext';
import Cart from "./component/cart/cart";
import Payment from "./component/payment";
import Add from "./component/add";
import History from "./component/history";
import Edit from "./component/user/edit";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Help from "./component/user/help";  
import Phone from "./component/Wish";
import User from "./component/user/User"; 
import Address from "./component/user/address"; 
import Email from "./component/user/Email"; 
import Skeleton from "./component/uielements/skeleton";
import Reset from "./component/registerlogin/reset"; 
import { LoginContext } from "./contexts/LoginContext";
import Cookies from "js-cookie";
const Home = lazy(() => import('./component/homepage/homepage'));
const Start = lazy(() => import('./component/registerlogin/start'));
const LoginPage = lazy(() => import('./component/registerlogin/loginpage'));
const RegisterPage = lazy(() => import('./component/registerlogin/register')); 

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
      <Suspense fallback={<div><Skeleton/></div>}>
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
