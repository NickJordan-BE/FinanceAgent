import React, { useEffect, useState } from 'react'
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

import "./index.css"


const SpendingLog = () => {
    const [logs, setLogs] = useState([]);
    const [curMonth, setMonth] = useState("");
    const axiosPrivate = useAxiosPrivate();
    const { curUser } = useAuth();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const date = new Date();



    useEffect(() => {
        const getCurLogs = async () =>  {
            setMonth(monthNames[date.getMonth()]);
            try {
                const result = await axiosPrivate.get(`/api/transactions/users/${curUser.uid}`);
                setLogs(result.data.data);

                return result;

            } catch (err) {
                console.log(err);
                return err;
            }
        }

        getCurLogs();
    }, []);

    const handleDelete = async (e) => {
        e.preventDefault()
        const idToDelete = e.target.id

        try {

            const result = await axiosPrivate.delete(`/api/transactions/${idToDelete}/delete`);
            setLogs(logs.filter((log) => log[0] !== idToDelete));

            return;
        } catch (err) {
            console.log(err);
            return err;
        }
    }


    const previousMonth = () => {

    }

    const nextMonth = () => {
        
    }

    return (
        <div>
            <div className='log-container'>
                <h1 className='log-header'><button className='prev-month'> Prev</button>Transaction Log: {curMonth}<button className='next-month'>Next</button></h1>
                <h4 className='date-header'>Current Date: {curMonth} {date.getDate()}, {date.getFullYear()}</h4>
                <div className='action-container'>
                    <div className='search-container'>
                        <label className='search-label'>Search: </label>
                        <input className='search-input' placeholder='Search For Transactions'></input>
                        <Link to="/spending/log/create"><button className='new-button'>+ New Transcation</button></Link>
                        <button className='analyze-button'>Analyze Spending</button>
                    </div>
                </div>
                <ul className='logs-container'>
                    <li className='log'>
                        <span>Price in $$$</span>
                        <span>Category</span>
                        <span>Company</span>
                        <span>Date</span>
                    </li>
                    {logs.map((log) => {
                        return (
                            <li key={log[0]} className='log'>
                                <span>
                                    {log[1].amount}
                                </span>
                                <span>
                                    {log[1].category}
                                </span>
                                <span>
                                    {log[1].company}
                                </span>
                                <span>
                                    {log[1].createdAt}
                                </span>
                                <button className='log-delete-button' onClick={handleDelete} id={log[0]}>Delete</button>
                                <Link to={`/spending/log/update/${log[0]}`}><button className='log-update-button'>Update</button></Link>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}

export default SpendingLog
