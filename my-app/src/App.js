import HomePage from './component/homepage';
import Men from './component/men';
import Menext from './component/menext';
import Cart from "./component/cart";
import Payment from "./component/payment";
import Add from "./component/add";
import History from "./component/history";
import Start from "./component/start";  
import Edit from "./component/edit";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import LoginPage from './component/loginpage';
import RegisterPage from './component/register';
import Help from "./component/help";  
import Phone from "./component/Wish";
import User from "./component/User"; 
import Address from "./component/address"; 
import Email from "./component/Email"; 
import withLoader from "./component/loader" 
const Load = withLoader(Start);
function App() {
  let type=localStorage.getItem('type');
  return (
  <div >
  <SnackbarProvider>
    <Router>
      <Routes>
          <Route path="/start" element={<Load />} />
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
