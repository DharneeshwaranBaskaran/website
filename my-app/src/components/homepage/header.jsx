import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom'; 
import "./homcom.css"; 
import carticon from "../../images/icons8-cart-50.png"
function Header() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const actionOptions = ["Menu", "Remove", "Add", "Access","Status","Logout"];
    const deliveryOptions = ["Weekend Delivery", "Yes", "No"];
    const categoryOptions = ["Category", "Men", "Women", "Kids"];
    const actionOption = ["Menu", "Cart", "Logout"];
    const [forpic, setforpic] = useState('');
    const [cart, setcart] = useState([]);
    const username = Cookies.get('username');
    let typeo = Cookies.get('type');

    const handleCategoryChange = (event) => {
        const categoryMap = { Men: 1, Women: 2 };
        const myRef = categoryMap[event.target.value] || 3;
        Cookies.set("myRef", myRef);
        navigate(`/${typeo}/men`);
    };

    const handlelogout = () => {
        const broadcastChannel = new BroadcastChannel('logoutChannel');
        broadcastChannel.postMessage('logout');
        navigate("/start");
        const cookies = Cookies.get();
        for (const cookie in cookies) {
            Cookies.remove(cookie);
        }
        window.location.reload()
        enqueueSnackbar("Logout Successful");
    }

    const handlehelp = (str) => {
        navigate(`/${typeo}/${str}`);
    }

    const fetchData = async (url, setDataCallback) => {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Error fetching data from ${url}: ${response.statusText}`);
            } const data = await response.json();
            setDataCallback(data);
        } catch (error) {
            console.error(`Error fetching data from ${url}:`, error);
        }
    };
    useEffect(() => {
        fetchData(`http://localhost:8080/cart/getItems/${username}`, setcart);
    }, []);
    useEffect(() => {
        fetch(`http://localhost:8080/user/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching user data: ${response.statusText}`);
                } return response.json();
            }).then((data) => {
                setforpic(data[0].profilepic);
            }).catch((error) => {
                console.error("Error fetching user data:", error);
            });
    }, []);
    
    const handleActionChange = (event) => {
        if (event.target.value == "Remove")
            navigate(`/${typeo}/history`);
        else if (event.target.value == "Add") {
            navigate(`/${typeo}/add`);
        } else if (event.target.value == "Access") {
            navigate(`/${typeo}/payment`);
        } else if (event.target.value == "Cart") {
            navigate(`/${typeo}/cart`); 
        }else if (event.target.value == "Status") {
            navigate(`/${typeo}/status`); 
        } else {
            const broadcastChannel = new BroadcastChannel('logoutChannel');
            broadcastChannel.postMessage('logout');
            navigate("/start");
            const cookies = Cookies.get();
            for (const cookie in cookies) {
                Cookies.remove(cookie);
            }
            window.location.reload();
            enqueueSnackbar("Logout Successful");
        }
    };
    const handleChange = (event) => {
        Cookies.set("weekend", event.target.value === "No" ? "No" : "Yes");
    }
    return (
        <div className="logout-button">
            {(Cookies.get('type') === 'buyer') && (<>
                <img src={forpic} alt={forpic} className='profilepic'/>
                <button className='helpbut' onClick={() => handlehelp("user")}>{username}</button>
                <select onChange={handleChange} className='delivery'>
                    {deliveryOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <select onChange={handleCategoryChange} className='catbut'>
                    {categoryOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <button onClick={() => handlehelp("help")} className='helpbutton'>Help</button>
                <select onChange={handleActionChange} className='selmenu'>
                    {actionOption.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <div className='cartview'> 
                <img src={carticon} alt={carticon} className='carticon'></img>
                    {cart.length}
                </div>
                <button onClick={() => handlehelp("phone")} className='wishbut'>Wishlist </button>
            </>)}
            {(Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') && (
                <select onChange={handleActionChange} className='purple'>
                    {actionOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}
            {(Cookies.get('type') === 'access' || Cookies.get('type') === 'companyaccess') && (
                <button onClick={handlelogout} className='purple'>Logout</button>
            )}
        </div>
    );
}

export default Header;  
