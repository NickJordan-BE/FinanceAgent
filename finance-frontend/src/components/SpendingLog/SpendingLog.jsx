import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Loading from "../Loading/Loading"

import "./index.css"


const SpendingLog = () => {
    const date = new Date();
    const actualDate = new Date();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [month, setMonth] = useState(date.getMonth());
    const [curDate, setDate] = useState(actualDate.toISOString());
    const axiosPrivate = useAxiosPrivate();
    const { curUser } = useAuth();
    const nav = useNavigate();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    
    


    useEffect(() => {
        const getCurLogs = async () =>  {
            try {
                setLoading(true);
                const result = await axiosPrivate.get(`/api/transactions/users/${curUser.uid}/month/${curDate}`);
                setLogs(result.data.data);
                if (result.status == 200 && result.data.data.length == 0) {
                    window.alert("No Logs Created Yet. Add one!")
                }
                setLoading(false);
                return result;

            } catch (err) {
                setLoading(false);
                console.log(err);
                return err;
            }
        }

        getCurLogs();
    }, [month]);

    const handleAnalysis = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            const result = await axiosPrivate.post(`/api/users/${curUser.uid}/analysis/create`);
            setLoading(false);

            window.alert("Analysis Complete")
            nav("/analysis")
            return result

        } catch (err) {
            setLoading(false);
            console.log(err);
            return err;
        }
    }


    const handleDelete = async (e) => {
        e.preventDefault()
        const idToDelete = e.target.id

        try {

            const result = await axiosPrivate.delete(`/api/transactions/${idToDelete}/delete`);

            if (result.status == 200) {
                setLogs(logs.filter((log) => log[0] !== idToDelete));
                window.alert("Deletion Successful!")
            } else {
                window.alert("Error Occurred")
            }
          
            return;
        } catch (err) {
            console.log(err);
            return err;
        }
    }


    const previousMonth = () => {
        if (month - 1 < 0) {
            window.alert("Cannot Go Past Current Year.");
        } else {
            setMonth(month - 1);
            let tempDate = new Date(curDate);
            tempDate.setMonth(tempDate.getMonth() - 1);
            setDate(tempDate.toISOString())
        }
    }

    const nextMonth = () => {
        if (month + 1 > 11) {
            window.alert("Cannot Go Past Current Year.");
        } else {
            setMonth(month + 1);
            let tempDate = new Date(curDate);
            tempDate.setMonth(tempDate.getMonth() + 1);
            setDate(tempDate.toISOString())
        }
    }

    const resetMonth = () => {
        setMonth(actualDate.getMonth())
        setDate(actualDate.toISOString())
    }

    return (
        loading ? <Loading props={"Loading"}/> : 
        <div>
            <div className='log-container'>
                <h1 className='log-header'><button onClick={previousMonth} className='prev-month'> Prev</button>Transaction Log: {monthNames[month]}<button onClick={nextMonth} className='next-month'>Next</button>                 <button onClick={resetMonth} className='reset-button'>Reset</button></h1>
                <h4 className='date-header'>Current Date: {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}</h4>
                <div className='action-container'>
                    <div className='search-container'>
                        <label className='search-label'>Search: </label>
                        <input className='search-input' placeholder='Search For Transactions'></input>
                        <Link to="/spending/log/create"><button className='new-button'>+ New Transcation</button></Link>
                        <button onClick={handleAnalysis} className='analyze-button'>Analyze Spending</button>
                    </div>
                </div>
                <table className='logs-container'>
                    <thead className='log'>
                        <th className='item-header'>Price in $$$</th>
                        <th className='item-header'>Category</th>
                        <th className='item-header'>Company</th>
                        <th className='item-header'>Date</th>
                        <th className='item-header'>Actions</th>
                    </thead>
                    <tbody>
                    {logs.map((log) => {
                        return (
                            <tr key={log[0]} className='log'>
                                <td className='item'>
                                    {log[1].amount}
                                </td>
                                <td className='item'>
                                    {log[1].category}
                                </td>
                                <td className='item'>
                                    {log[1].company}
                                </td>
                                <td className='item'>
                                    {log[1].createdAt.slice(0, log[1].createdAt.length - 13)}
                                </td>
                                <td>
                                <button className='log-delete-button' onClick={handleDelete} id={log[0]}>Delete</button>
                                <Link to={`/spending/log/update/${log[0]}`}><button className='log-update-button'>Update</button></Link>
                                </td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default SpendingLog
