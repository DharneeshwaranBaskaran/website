
import React, { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import "./homcom.css"
import Header from "./header";
function Acccomacchome() {
    const [accsortingCriteria, setAccSortingCriteria] = useState("");
    const [sorted, setsorted] = useState([]);
    const [typ, settye] = useState('');
    const [pro, setpro] = useState([]);
    const [prov, setprov] = useState('');
    const username = Cookies.get('username');
    let typeo = Cookies.get('type');
    let count = 0;

    const handleSortingChange1 = (event) => {
        setAccSortingCriteria(event.target.value);
        count = count + 1;
    };
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
        if (Cookies.get('type') === 'access' || Cookies.get('type') === 'companyaccess') {
            fetchData(`http://localhost:8080/history/view/${prov}`, setpro);
        }
    }, [prov]);
    useEffect(() => {
        const sortByCriteria = (a, b) => {
            if (accsortingCriteria === "des") {
                return b - a;
            } else if (accsortingCriteria === "ass") {
                return a - b;
            } else {
                return 0;
            }
        };
        const sorted = [...pro].sort((a, b) => {
            if (typ === "cost") {
                return sortByCriteria(a.cost, b.cost);
            } else if (typ === "count") {
                return sortByCriteria(a.count, b.count);
            } else if (typ === "stockcount") {
                return sortByCriteria(a.stockcount, b.stockcount);
            } else {
                return sortByCriteria((a.cost) * (a.count), (b.cost) * (b.count));
            }
        });
        setsorted(sorted)
    }, [accsortingCriteria, pro])
    useEffect(() => {
        fetch(`http://localhost:8080/ty/${typeo}/${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error fetching cart items: ${response.statusText}`);
                } return response.json();
            }).then((data) => {
                setprov(data[0]?.provider);
                settye(data[0]?.type);
            }).catch((error) => {
                console.error('Error fetching cart items:', error);
            });
    }, [username]);
    return (
        <>
            <Header />
            <select
                value={accsortingCriteria}
                onChange={handleSortingChange1}
                className="access"
            > <option value="">Sort</option>
                <option value="ass">Ascending</option>
                <option value="des">Descending </option>
            </select><br /><br /><table className="purchase-history-table">
                <thead>
                    <tr>
                        <th>Topic</th>
                        <th>{typ}</th>
                    </tr>
                </thead>
                <tbody>
                    {(sorted).map((item, index) => (
                        <tr key={index}>
                            <td>{item.topic}</td>
                            <td>{typ === 'cost' ? item.cost : typ === 'count' ? item.count : item.count * item.cost}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </>
    );
}
export default Acccomacchome;