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
        Cookies.remove("token");
        Cookies.remove("dataid");
        Cookies.remove("username");
        Cookies.remove("type");
        enqueueSnackbar("Logout Successful");
        setTimeout(window.location.reload(), 1000);
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