import React from 'react';
import { GoogleLoginButton } from 'react-social-login-buttons';
import { LoginSocialGoogle } from 'reactjs-social-login';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
const GoogleSignInButton = ({ onGoogleSignIn }) => {
    const { enqueueSnackbar } = useSnackbar();
    const type = localStorage.getItem("type");
    const navigate = useNavigate();
    return (
        <LoginSocialGoogle
            client_id={"812988011805-bjggbnbauqg4a4g7f9e8r2qd0rh290u6.apps.googleusercontent.com"}
            scope="openid profile email"
            discoveryDocs="claims_supported"
            access_type="offline"
            onResolve={({ provider, data }) => {
                console.log(provider, data);
                localStorage.setItem('username', data.given_name);
                const firstName = data.given_name;
                const userEmail = data.email;
                const userData = {
                    username: firstName,
                    email: userEmail,
                };
                fetch('http://localhost:8080/api/register/google', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(userData),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data.username);
                        navigate(`/${type}/homepage`);
                        enqueueSnackbar("Login Successful", { variant: "success" });
                    })
                    .catch(error => {
                        console.error(error);
                    });
            }}
            onReject={(err) => {
                console.log(err);
            }}
        >
            <GoogleLoginButton />
        </LoginSocialGoogle >
    );
};

export default GoogleSignInButton;
