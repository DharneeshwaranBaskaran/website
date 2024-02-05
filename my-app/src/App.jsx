import React, { useState,lazy, Suspense,useEffect} from "react";
import HomePage from './pages/Homepage/homepage';
import Men from './pages/productpage/men';
import Menext from './pages/productpage/menext';
import Cart from "./pages/cart/cart";
import Payment from "./pages/payment/payment";
import Add from "./pages/addbalance/add";
import History from "./pages/history/history";
import Edit from "./pages/user/edit";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import Help from "./pages/user/help";  
import Phone from "./pages/wish/Wish";
import User from "./pages/user/User"; 
import Address from "./pages/user/address"; 
import Email from "./pages/user/Email"; 
import Skeleton from "./pages/Homepage/skeleton_home";
import Reset from "./components/registerlogin/reset"; 
import { LoginContext } from "./usercontext/UserContext";
import Cookies from "js-cookie";

const electron = window.require ? window.require('electron') : null;
const { ipcRenderer } = electron || {};
const Home = lazy(() => import('./pages/Homepage/homepage'));
const Start = lazy(() => import('./pages/start/start'));
const LoginPage = lazy(() => import('./pages/Login/loginpage'));
const RegisterPage = lazy(() => import('./pages/register/register')); 

function App() {
  let type=Cookies.get('type');
  const [showModal,setShowModal]=useState(false); 
  const [Balance, setBalance] = useState(0);  
  useEffect(() => {
    // Check if ipcRenderer is available before using it
    if (ipcRenderer) {
      ipcRenderer.send('some-event', 'Hello from React!');
    }
  }, []);

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
