import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { useSnackbar } from "notistack";
import { useNavigate } from 'react-router-dom';
function Header() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const actionOptions = ["Menu", "Remove", "Add", "Access", "Logout"];
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

    const selectStyle = (backgroundColor, additionalStyles = {}) => ({
        backgroundColor,
        color: "white",
        border: "none",
        padding: "5px",
        borderRadius: "5px",
        ...additionalStyles
    });

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
        fetchData(`http://localhost:8080/api/cart/getItems/${username}`, setcart);
    }, []);
    useEffect(() => {
        fetch(`http://localhost:8080/api/user/${username}`)
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
            {(Cookies.get('type') === 'buyer' || Cookies.get('type') === 'company') && (<>
                <img src={forpic} alt={forpic} style={{ height: '35px', marginLeft: '100px' }} />
                <button style={{ backgroundColor: "#5B0888" }} onClick={() => handlehelp("user")}>{username}</button>
                <select onChange={handleChange} style={selectStyle("#5B0888")}>
                    {deliveryOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <select onChange={handleCategoryChange} style={selectStyle("#713ABE", { marginLeft: "10px" })}>
                    {categoryOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <button style={{ backgroundColor: "#713ABE" }} onClick={() => handlehelp("help")}>Help</button>
                <select onChange={handleActionChange} style={selectStyle("#793FDF", { marginLeft: "5px" })}>
                    {actionOption.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
                <div style={{ marginLeft: "10px", backgroundColor: "#793FDF", borderRadius: "5px", padding: "5px" }}>
                    {cart.length}
                </div>
                <button onClick={() => handlehelp("phone")} style={{ backgroundColor: "#7752FE" }}>Wishlist </button>
            </>)}
            {(Cookies.get('type') === 'seller' || Cookies.get('type') === 'company') && (
                <select onChange={handleActionChange} style={selectStyle("#451952", { marginLeft: "5px" })}>
                    {actionOptions.map((option, index) => (
                        <option key={index} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            )}
            {(Cookies.get('type') === 'access' || Cookies.get('type') === 'companyaccess') && (
                <button onClick={handlelogout}>Logout</button>
            )}
        </div>
    );
}

export default Header;  
