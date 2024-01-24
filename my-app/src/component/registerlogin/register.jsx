import React, { useState } from "react";
import backpic from "../images/backpic.jpg";
import '../App.css';
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
import GoogleSignInButton from '../uielements/GoogleSignInButton';
import Cookies from "js-cookie";
function RegisterPage() {
  const type = Cookies.get('type');
  const navigate = useNavigate();
  const [validUsername, setValidUsername] = useState(false);
  const [validPassword, setValidPassword] = useState(false);
  const [validConPassword, setValidConPassword] = useState(false);
  const [validEmail, setValidEmail] = useState(false);
  const [validAddress, setValidAddress] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [conpassword, setConPassword] = useState('');
  const [address, setAddress] = useState('');
  const [website, setWebsite] = useState('');
  const [comaddress, setcomAddress] = useState('');
  const [company, setCompany] = useState('');
  const [num, setnum] = useState('');
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [mail, setmail] = useState('');
  const [error, setError] = useState('');
  const [error1, setError1] = useState('');
  const [error2, setError2] = useState('');
  const [error3, setError3] = useState('');
  const [error4, setError4] = useState('');
  const [error5, setError5] = useState('');
  const [error6, setError6] = useState('');
  const [isname, setIsname] = useState(false)
  const [isnum, setisnum] = useState(false);
  const [iscompany, setiscompany] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isPassword, setIspassword] = useState(false)
  const [isconPassword, setIsconpassword] = useState(false)
  const [isAddress, setIsAddress] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');

  const handlePhoneNumberChange = (e) => {
    const inputPhoneNumber = e.target.value;
    const onlyNumbers = /^[0-9]*$/;
    if (onlyNumbers.test(inputPhoneNumber)) {
      setPhoneNumber(inputPhoneNumber);
    }
  };

  const handlephone = async (event) => {
    if (phoneNumber == "" || mail == "") {
      enqueueSnackbar("Enter the Required data");
    }
    try {
      const response = await fetch("http://localhost:8080/api/phone", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: phoneNumber, email: mail }),
        credentials: 'include',
      });

      if (response.ok) {
        setShowModal(!showModal);
        navigate(`/${type}/login`);
        enqueueSnackbar("Username and password sent to mail", { variant: "success" });
      }
      else {
        console.log(response);
        const errorData = await response.json();
        enqueueSnackbar(errorData.error, { variant: "error" });
      }
    } catch (error) {
      enqueueSnackbar("An error occurred", { variant: "error" });
    }
  }

  const renderInputField = (type, placeholder, value, onChange, style) => (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      style={style}
    />
  );
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const handleRegister = async (event) => {
    if (!username || !password || !conpassword || !email) {
      enqueueSnackbar("Please fill in all required fields", { variant: "error" });
      return;
    }
    if (password !== conpassword) {
      setError2('Passwords do not match');
      return;
    }
    const selectedValue = Cookies.get('type');
    let data = {};
    switch (selectedValue) {
      case "buyer":
        data = { username, password, conpassword, email, address };
        break;
      case "seller":
        data = { name, num, company, username, password, conpassword, email, address, comaddress };
        break;
      default:
        data = { num, company, username, password, conpassword, email, comaddress, website };
        break;
    }
    const response = await fetch(`http://localhost:8080/api/register/${selectedValue}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (response.ok) {
      enqueueSnackbar("Registration Successful", { variant: "success" });
      console.log(response);
      console.log(username, password);
      navigate(`/${type}/login`);
    } else if (response.status === 409) {
      const errorData = await response.json();
      enqueueSnackbar(errorData.error, { variant: "error" });
    } else {
      enqueueSnackbar("Registration Failed", { variant: "error" });
    }
    console.log(selectedValue);
  };

  const errorStyle = {color: 'red',fontSize: '10px'};
  const handleInputChange = (e, setValue, setValid, minLength, errorMessage, setInvalidFlag, setError) => {
    const value = e.target.value;
    setValue(value);
    setValid(value.length >= minLength);
    if (value.length >= minLength) {
      setError('');
      setInvalidFlag(false);
    } else {
      setInvalidFlag(true);
      setError(errorMessage);
    }
  };

  const handleChange = (e) => {
    handleInputChange(e, setUsername, setValidUsername, 6, '*Username should contain a minimum of 6 characters', setIsClicked, setError);
  };
  const handleChange1 = (e) => {
    handleInputChange(e, setPassword, setValidPassword, 6, '*Passwords should contain a minimum of 6 characters', setIspassword, setError1);
  };
  const handleChange2 = (e) => {
    handleInputChange(e, setConPassword, setValidConPassword, 6, '*Passwords should contain a minimum of 6 characters', setIsconpassword, setError2);
  };
  const handleChange3 = (e) => {
    handleInputChange(e, setEmail, setValidEmail, 6, '*Email should contain a minimum of 6 characters', setIsAddress, setError3);
  };
  const handleChange4 = (e) => {
    handleInputChange(e, setAddress, setValidAddress, 6, '*Email should contain a minimum of 6 characters or Enter a valid Email', setIsAddress, setError3);
  };
  const handleChange5 = (e) => {
    handleInputChange(e, setname, () => true, 6, '*Name should contain a minimum of 6 characters', setIsname, setError4);
  };
  const handleChange6 = (e) => {
    handleInputChange(e, setnum, () => true, 10, '*Number should contain a minimum of 10 characters', setisnum, setError5);
  };
  const handleChange7 = (e) => {
    handleInputChange(e, setCompany, () => true, 6, '*Company Name should contain 6 characters', setiscompany, setError6);
  };
  const handleChange8 = (e) => {
    handleInputChange(e, setcomAddress,() => true, 6, '*Company Name should contain 6 characters', setiscompany, setError6);
  };
  const handleChange9 = (e) => {
    handleInputChange(e, setWebsite,() => true, 6, '*Company Name should contain 6 characters', setiscompany, setError6);
  };
  const handleChange0 = (e) => {
    handleInputChange(e, setmail,() => true, 6, '*Company Name should contain 6 characters', setiscompany, setError6);
  };

  const redirectinglogin = () => {
    navigate(`/${type}/login`);
  }

  const generateInputStyle = (isInvalid) => ({
    outline: isInvalid ? '1px solid red' : '1px solid black',
  });

  const inputStyle = generateInputStyle(isClicked);
  const inputStyle1 = generateInputStyle(isPassword);
  const inputStyle2 = generateInputStyle(isconPassword);
  const inputStyle3 = generateInputStyle(isAddress);
  const inputStyle4 = generateInputStyle(isname);
  const inputStyle5 = generateInputStyle(isnum);
  const inputStyle6 = generateInputStyle(iscompany);

  return (
    <div style={{backgroundImage: `url(${backpic})`, minHeight: "130vh"}}>
      <div style={{ padding: "35px" }}></div>
      <div className="app" >
        <div className="login-page"  >
          <h2 data-testid="Title">Register</h2> 
          {Cookies.get('type')}
          <div className="con" data-text="form">
            {type === 'seller' && renderInputField("text", "Name", name, handleChange5, inputStyle4)}
            <div style={errorStyle}>{error4}</div>
            {type !== 'buyer' && renderInputField("text", "Contact Number", num, handleChange6, inputStyle5)}
            <div style={errorStyle}>{error5}</div>
            {type !== 'buyer' && renderInputField("text", "Company", company, handleChange7, inputStyle6)}
            <div style={errorStyle}>{error6}</div>
            {renderInputField("text", "Username", username, handleChange, inputStyle)}
            <div style={errorStyle}>{error}</div>
            {renderInputField("password", "Password", password, handleChange1, inputStyle1)}
            <div style={errorStyle}>{error1}</div>
            {renderInputField("password", "Confirm Password", conpassword, handleChange2, inputStyle2)}
            <div style={errorStyle}>{error2}</div>
            {renderInputField("text", "Email", email, handleChange3, inputStyle3)}
            {type !== 'company' && renderInputField("text", "Personal Address", address, handleChange4)}
            {type !== 'buyer' && renderInputField("text", "Company Address", comaddress, handleChange8)}
            {type=== 'company' && renderInputField("text", "Website", website, handleChange9)}
          </div>
          <button onClick={handleRegister} className="lob">
            Register</button>
          <div className="log">
            <p>already have a account:</p>
            <button onClick={redirectinglogin} className="lob"> Login </button>
            {Cookies.get('type') === 'buyer' && (<>
                <div>
                  <p>Sign Up using Phone Number</p>
                  <button onClick={toggleModal} className="lob">Register Phone Number</button>
                  {showModal && (
                    <div>
                      <h2>Enter Moblile Number:</h2>
                      <div className="con">
                        {renderInputField("text", "Number", phoneNumber, handlePhoneNumberChange)}
                        {renderInputField("text", "Email", mail, handleChange0)}
                        <button type="submit" className="lob" onClick={handlephone}>Submit</button>
                      </div>
                    </div>
                  )}
                  <p>Sign Up with Google</p>
                  <GoogleSignInButton />
                </div>
              </>)}
          </div>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;