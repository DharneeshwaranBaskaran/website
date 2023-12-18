import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useSnackbar } from "notistack";
import { BroadcastChannel } from "broadcast-channel";
const withLogoutHandler = (WrappedComponent) => {
  return (props) => {
    
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
    useEffect(() => {
      const handleLogout = () => {
        navigate("/start");
        localStorage.clear();
        window.location.reload();
        enqueueSnackbar("Logout Successful");
      };

      const logoutChannel = new BroadcastChannel('logoutChannel');
      logoutChannel.onmessage = handleLogout;

      return () => {
        logoutChannel.onmessage = null;
      };
    }, [])
    
    return <WrappedComponent {...props} />;
  };
};

export default withLogoutHandler;
