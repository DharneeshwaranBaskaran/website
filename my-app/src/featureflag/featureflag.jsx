import React, { lazy, Suspense } from "react";
import Cookies from "js-cookie";
const Sellerview = lazy(() => import("../components/homepage/sellerview"));
const Acccessview = lazy(() => import("../components/homepage/accessview"));
const Buyerview = lazy(() => import("../components/homepage/buyerview"));
const FeatureFlags = {
    iscsvaccess: () => { 
        if(Cookies.get('type') === 'company')
        {
            return true; 
        }
    else
    {
        return false;
    }
    } ,
    ishome:()=>{
        if(Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') {
            return <Sellerview />;
        }
          else if(Cookies.get('type') === 'access' || Cookies.get('type') === 'companyaccess'){
            return <Acccessview />;
          }
          else if(Cookies.get('type') === 'buyer'){
            return  <Buyerview />;
          }
        
    }
  };
  
  export default FeatureFlags;