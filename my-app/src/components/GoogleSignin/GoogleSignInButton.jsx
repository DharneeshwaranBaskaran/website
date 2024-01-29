import React from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from "../../usercontext/UserContext";
import Cookies from 'js-cookie';
import { Helper } from "../../components/helper/helpers";
const GoogleSignInButton = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { setjwt } = useLoginContext();
  const navigate = useNavigate();
  
  const handleLogin = async (userData) => {
    try {
      const response = await fetch('http://localhost:8080/register/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        const receivedToken = await response.text(); 
        Cookies.set('token', receivedToken);
        setjwt(receivedToken);
        Cookies.set('dataid',Helper(receivedToken).id) 
        navigate(`/${Cookies.get('type')}/homepage`);
        enqueueSnackbar('Login Successful', { variant: 'success' });
      } else {
        console.error(response);
        enqueueSnackbar('Invalid Credentials');
      }
    } catch (error) {
      console.error(error.message);
      enqueueSnackbar(`An error occurred: ${error.message}`, { variant: 'error' });
    }
  };

  return (
    <LoginSocialGoogle
      client_id={'812988011805-bjggbnbauqg4a4g7f9e8r2qd0rh290u6.apps.googleusercontent.com'}
      scope='openid profile email'
      discoveryDocs='claims_supported'
      access_type='offline'
      onResolve={({ provider, data }) => {
        Cookies.set('username', data.given_name);
        const firstName = data.given_name;
        const userEmail = data.email;
        const userData = {
          username: firstName,
          email: userEmail,
        };

        handleLogin(userData);
      }}
      onReject={(err) => {
      }}
    >
      <GoogleLoginButton />
    </LoginSocialGoogle>
  );
};

export default GoogleSignInButton;
