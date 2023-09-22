import React, { useEffect, useState } from "react";
import './App.css'; 
import LoginPage from "./loginpage";
import HomePage from "./homepage";
import Men from "./men";
import Menext from "./menext";
import RegisterPage from "./register";
import Cart from "./cart";
import Payment from "./payment";
import { Toaster } from 'react-hot-toast';
import { SnackbarProvider } from "notistack";  
import Add from "./add";
import History from "./history";
function App() {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [redirectToAnotherPage, setRedirectToAnotherPage] = useState(false); 
  const [mend,setMend]=useState(false);
  const [isRegistered,setisRegistered]=useState(false);
  const [isCart,setisCart]=useState(false);  
  const [isPay,setisPay]=useState(false);
  const [isHistory,setisHistory]=useState(false);
  const [isBalance,setisBalance]=useState(false);
  const handlebacktohome=()=>{
    setisCart(false);
    setMend(false);
    setRedirectToAnotherPage(false);
  }  
  const handlebacktohomefromhis =()=>{
    setisCart(false);
    setMend(false);
    setRedirectToAnotherPage(false); 
    setisPay(false);
    setisHistory(false);
  }
  const backtohome =()=>{
    setisBalance(false); 
    setisHistory(false);
    setisCart(false);
    setMend(false);
    setRedirectToAnotherPage(false); 
    setisPay(false);
  }
  const handlehistory =()=>{
    setisPay(true);
    setisHistory(true);
  }
  const HistorytoCart =()=>{
    setisPay(false);
    setisHistory(false);
  }
  const updateBalance =()=>{
    setisPay(true);
    setisHistory(true);
    setisBalance(true);
  }
  const handlegoogle=()=>{
    setisAuthenticated(true);
    setisRegistered(true);
  }
  const homelogout=()=>{
    setisAuthenticated(false);
  }
  const handlebacktohomefrompay=()=>{
    setisCart(false);
    setMend(false);
    setRedirectToAnotherPage(false); 
    setisPay(false);
  }
  const redirecttocart=()=>{
    setisCart(true);
    setMend(true);
    setRedirectToAnotherPage(true);
  }
  const handlecart=()=>{
    setisCart(true);
  }
  const handlepayment=()=>{
    setisPay(true);
  }
  const handleRedirect = () => {
    setRedirectToAnotherPage(true);
  }; 
  const handleRecommendation = () => {
    setRedirectToAnotherPage(true);
    setMend(true);
  };
  const handlebackRegister=()=>{
    setisRegistered(false);
  }
  const handleback = () => {
    setMend(false);
  };
  const handleLogin = () => {
    setisAuthenticated(true);
  };
  const handlemenex=()=>{
    setMend(true);
  }
  const handlebackhome=()=>{
    setRedirectToAnotherPage(false);
  }
  const handleRegister=()=>{
    setisRegistered(true);
  }
  const backtocart=()=>{
    setisPay(false);
    setisHistory(false);
    setisBalance(false);
  }
  const handlebackfromrec=()=>{
    setRedirectToAnotherPage(false);
    setMend(false);
  }
  return (
    <SnackbarProvider maxSnack={3}>
     <div> 
      {!isRegistered?
      <RegisterPage onRegister={handleRegister} redirectlogin={handleRegister} google={handlegoogle}/>:
      <>
      {!isAuthenticated ?
      <LoginPage onLogin={handleLogin} backRegister={handlebackRegister} />
      :<>
      {!redirectToAnotherPage?
        <HomePage click={handleRedirect} homelog={homelogout}tocart={redirecttocart} reco={handleRecommendation}/>
        : <>
        {!mend?
           <Men menex={handlemenex} backhome={handlebackhome}/>
           :<>
           {!isCart?
           <Menext back={handleback} cart={handlecart} rechome={handlebackfromrec}/>:<>
            {!isPay?
            <Cart backtohome={handlebacktohome} pay={handlepayment} history={handlehistory} balance={updateBalance}/>:<>
              {!isHistory?
                  <Payment full={handlebacktohomefrompay}/>
                  :<>{!isBalance?
                       <History his={handlebacktohomefromhis} histocart={HistorytoCart}/>:
                          <Add  backpay={backtohome}  backcart={backtocart}/>}
                          </> 
                        }
                  </>
                  }
               </>
            }
          </>
           }
        </>
        }
       </>
       }  
       </> 
      }      
    </div>
    </SnackbarProvider>
  );
}
export default App;
