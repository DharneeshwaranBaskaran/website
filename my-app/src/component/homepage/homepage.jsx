import React, { lazy, Suspense } from "react";
import '../App.css';
import Cookies from 'js-cookie';
import withLogoutHandler from "../hoc/withLogouthandler";
import { useLoginContext } from "../../contexts/LoginContext";
import Skeleton from "../uielements/skeleton";
const Sellerview = lazy(() => import("./sellerview"));
const Acccessview = lazy(() => import("./accessview"));
const Buyerview = lazy(() => import("./buyerview"));

function HomePage() {
  const { jwt, setjwt } = useLoginContext();
  const parseJwt = (token) => {
    if (typeof token !== 'string') {
      console.error('Invalid token format:', token);
      return null;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  };

  return (
    <div style={{ backgroundColor: "#e5e5ff", minHeight: "100vh" }} >
      {(jwt == Cookies.get('token') && Cookies.get('type') == parseJwt(jwt).type && parseJwt(jwt).id == Cookies.get("dataid")) ? (
        <> <Suspense fallback={<Skeleton />}><div>
          {(Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') && (<>
            <Sellerview />
          </>)}
          {(Cookies.get('type') === 'access' || Cookies.get('type') === 'companyaccess') && (<>
            <Acccessview />
          </>)}
          {Cookies.get('type') === 'buyer' && (<>
            <Buyerview />
          </>)}
        </div>  </Suspense>
        </>
      ) : (<><h1>YOU DO NOT HAVE ACCESS TO THIS PAGE</h1></>)}
    </div>
  );
}
export default withLogoutHandler(HomePage);
