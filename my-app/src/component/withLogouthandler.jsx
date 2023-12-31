import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
import { BroadcastChannel } from "broadcast-channel";
import Cookies from 'js-cookie';
const withLogoutHandler = (WrappedComponent) => {
  return (props) => {
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    useEffect(() => {
      const handleLogout = () => {
        navigate("/start");
        const cookies = Cookies.get();
        for (const cookie in cookies) {
          Cookies.remove(cookie);
        }
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