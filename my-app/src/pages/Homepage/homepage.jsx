import React, { lazy, Suspense } from "react";
import '../../App.css';
import Cookies from 'js-cookie';
import withLogoutHandler from "../../components/hoc/withLogouthandler";
import { useLoginContext } from "../../usercontext/UserContext";
import Skeleton from "../../components/homepage_skeleton/skeleton";
import { Helper } from "../../components/helper/helpers";
import "./homepage.css"
const Sellerview = lazy(() => import("../../components/homepage/sellerview"));
const Acccessview = lazy(() => import("../../components/homepage/accessview"));
const Buyerview = lazy(() => import("../../components/homepage/buyerview"));

function HomePage() {
  const { jwt, setjwt } = useLoginContext();
  return (
    <div className="backgroundcol">
      {(jwt == Cookies.get('token') && Cookies.get('type') == Helper(jwt).type && Helper(jwt).id == Cookies.get("dataid")) &&(
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
      )}
    </div>
  );
}
export default withLogoutHandler(HomePage);
