import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import PieChart from "./piechart";
import './App.css';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from "notistack";
import BubbleGraph from "./BubbleGraph";
import BarGraph from "./Bargraph";
import html2pdf from 'html2pdf.js';
import * as XLSX from 'xlsx';
function Sellerhome() {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [sortingCriteria, setSortingCriteria] = useState("");
    let count = 0;
    let typeo = Cookies.get('type');
    const [Data, setData] = useState([]);
    const [user, setuser] = useState([]);
    const sel = (typeo == "seller" ? "access" : "companyaccess");
    const username = Cookies.get('username');
    const [patch, setpatch] = useState([]);
    const [sortedData, setSortedData] = useState([]);
    const [inputValues, setInputValues] = useState(Array(sortedData.length).fill(''));
    const { enqueueSnackbar } = useSnackbar();
    const [selectValues, setSelectValues] = useState(user.map((item) => ""));
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
    const handleSelectChange = (index, value) => {
        const newSelectValues = [...selectValues];
        newSelectValues[index] = value;
        setSelectValues(newSelectValues);
    };
    const handleSortingChange = (event) => {
        setSortingCriteria(event.target.value);
        count = count + 1;
    };
    useEffect(() => {
        fetchData(`http://localhost:8080/api/${sel}/${username}`, setuser);
        fetchData(`http://localhost:8080/api/history/view/${username}`, setData);
    }, []);
    const handleEdit = async (id, index) => {
        const response = await fetch(`http://localhost:8080/api/edit/${typeo}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ id, type: selectValues[index] }),
            credentials: 'include',
        });
        if (response.ok) {
            enqueueSnackbar("Registration Successful", { variant: "success" });
            console.log(response);
            window.location.reload();
        } else if (response.status === 409) {
            const errorData = await response.json();
            enqueueSnackbar(errorData.error, { variant: "error" });
        } else {
            enqueueSnackbar("Registration Failed", { variant: "error" });
        }
    }
    const handleActionChange = (event) => {
        if (event.target.value == "Add")
            navigate(`/${typeo}/history`);
        else if (event.target.value == "Draft") {
            navigate(`/${typeo}/add`);
        } else if (event.target.value == "Access") {
            navigate(`/${typeo}/payment`);
        } else if (event.target.value == "Back") {
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
    const handleChangein = (index, e) => {
        const newInputValues = [...inputValues];
        newInputValues[index] = e.target.value;
        setInputValues(newInputValues);
    };
    const handlestock = (id, topic, index) => {
        const inputValue = inputValues[index];
        if (inputValue <= 0) {
            enqueueSnackbar("Enter a Number greater than 0")
        }
        else {
            fetch(`http://localhost:8080/api/updatestock/${id}/${inputValue}/${topic}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
            }).then((response) => {
                if (!response.ok) {
                    throw new Error(`Error updating stock count: ${response.statusText}`);
                }
                return response.json();
            }).then((data) => {
                enqueueSnackbar(data.message, { variant: 'success' });
                window.location.reload();
            }).catch((error) => {
                console.error('Error updating stock count:', error);
                enqueueSnackbar('Error updating stock count', { variant: 'error' });
            });
        }
    }

    const handleRemove = (id) => {
        fetch(`http://localhost:8080/api/delete${sel}/${id}`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', },
        }).then((response) => {
            if (!response.ok) {
                throw new Error(`Error deleting data: ${response.statusText}`);
            } return response.json();
        }).then((data) => {
            window.location.reload();
            console.log(data);
        }).catch((error) => {
            console.error('Error deleting data:', error);
        });
        window.location.reload();
        enqueueSnackbar("Removed Successfully");
    }
    const filterData = (data, query) => {
        return data.filter((item) => item.topic.toLowerCase().includes(query.toLowerCase()));
    };
    useEffect(() => { setpatch(filterData(Data, searchQuery)); }, [Data, searchQuery])
    useEffect(() => {
        const sorted = [...(patch)].sort((a, b) => {
            if (sortingCriteria === "cost") {
                return b.cost - a.cost;
            } else if (sortingCriteria === "count") {
                return b.count - a.count;
            }
            else if (sortingCriteria === "revenue") {
                return (b.cost) * (b.count) - ((a.cost) * (a.count));
            }
            else {
                return 0;
            }
        });
        setSortedData(sorted);
    }, [sortingCriteria, patch])
    const renderInputField = (type, placeholder, value, onChange, style, classs) => (
        <input type={type} placeholder={placeholder} value={value} onChange={onChange} style={style} className={classs}
        />);

    const handleDownloadPDF = () => {
        const element = document.getElementById('pdf-content');
        const pdfOptions = {
            margin: 10,
            filename: 'sorted_data.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
        };

        html2pdf(element, pdfOptions);
    };
    const handleDownloadExcel = () => {

        const excelData = sortedData.map(({ id, cost, count, stockcount }) => ({
            id,
            cost,
            count,
            stockcount,
        }));

        const worksheet = XLSX.utils.json_to_sheet(excelData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, 'sorted_data.xlsx');
    };
    return (<>
        <div>
            <div className="logout-button">
                <select onChange={handleActionChange}
                    style={{ backgroundColor: "#451952", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginLeft: "5px" }}>
                    <option>Menu</option>
                    <option value="Add">Remove</option>
                    <option value="Draft">Add</option>
                    <option value="Access">Access</option>
                    <option value="Logout">Logout</option>
                </select>

            </div>
            <h2 style={{ marginLeft: "10px" }}>SOLD HISTORY:</h2>
            <div className="search-container">
                {renderInputField("text", "Search...", searchQuery, (e) => setSearchQuery(e.target.value), { marginLeft: "10px" }, "search-bar")}
                <select value={sortingCriteria}
                    onChange={handleSortingChange}
                    style={{
                        height: '35px', backgroundColor: "#6666ff", borderRadius: "5px"
                        , marginRight: "5px", color: "white", marginLeft: "800px"
                    }}
                > <option value="">Sort</option>
                    <option value="cost">By Cost</option>
                    <option value="count">By Count</option>
                    <option value="revenue">By Revenue</option>
                </select>
            </div>
            <div>
                <BarGraph data={sortedData} />
                <div style={{ width: "600px" }}>
                    <h2 style={{ marginLeft: "20px" }}>Revenue:</h2>
                    <PieChart data={sortedData} />
                </div>
                <BubbleGraph data={sortedData} />
            </div>
            {renderInputField("text", "Search...", searchQuery, (e) => setSearchQuery(e.target.value), { marginLeft: "10px" }, "search-bar")}
            <div id="pdf-content">
                <table className="purchase-history-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Topic</th>
                            <th>Count</th>
                            <th>Stock</th>
                            <th>Add Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(sortedData).map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>{item.topic}</td>
                                <td>{item.count}</td>
                                <td>{item.stockcount}</td>
                                <td>{renderInputField("number", "count", inputValues[index], (e) => handleChangein(index, e), { backgroundColor: "#E4F1FF", color: "black", border: "none", padding: "5px", width: "50px", borderRadius: "5px", marginTop: "10px", marginLeft: "10px", })}
                                    <button onClick={() => handlestock(item.id, item.topic, index)} className="cart-button" >Add</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="logout-button">
                <button onClick={handleDownloadExcel}>Download Excel</button>
                <button onClick={handleDownloadPDF}>Download PDF</button>
            </div>
            <h2>Users</h2>
            <table className="purchase-history-table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>user</th>
                        <th>type</th>
                        <th>Remove</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {(user).map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.username}</td>
                            <td>{item.type}</td>
                            <td><button className="cart-button" onClick={() => handleRemove(item.id)} >Remove</button></td>
                            <td><select
                                value={selectValues[index]}
                                onChange={(e) => handleSelectChange(index, e.target.value)}
                                style={{ backgroundColor: "#713ABE", color: "white", border: "none", padding: "5px", borderRadius: "5px", marginTop: "10px", marginLeft: "10px" }}>
                                <option value="">Select Type</option>
                                <option value="cost">Cost</option>
                                <option value="count">Count</option>
                                <option value="revenue">Revenue</option>
                            </select>
                                <button className="cart-button" onClick={() => handleEdit(item.id, index)} >Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </>
    )
}
export default Sellerhome;