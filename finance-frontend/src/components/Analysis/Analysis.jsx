import React, { useEffect, useState } from 'react'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"
import useAuth from '../../hooks/useAuth';
import Loading from "../Loading/Loading"
import StarRating from '../StarRating/StarRating';
import { Link } from 'react-router-dom';

import "./index.css"

const Analysis = () => {
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const { curUser } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const date = new Date();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];



    useEffect(() => {
        const getAnalysis = async () => {
            try {
                setLoading(true);
                const response = await axiosPrivate.get(`/api/users/${curUser.uid}/analysis/${monthNames[date.getMonth()]}`);
                if (response.status == 200) {
                    setAnalysis(response.data.data);
                }

                setLoading(false)
                return response;
            } catch (err) {
                setLoading(false)
                console.log(err);
                return err;
            }

        };
        getAnalysis();
    },[]);


    return (
        loading ? <Loading props={"Loading Analysis"}/> : (
        analysis == null ? (<h1>No Analysis For: {monthNames[date.getMonth()]} Yet. Create one!</h1> ) :
        ( <div className='analysis-container'>
            <h1 className='analysis-header'>Financial Analysis For: {monthNames[date.getMonth()]}</h1>
            <h2 className='good-habits'>Good Habits: {analysis.good_habits}</h2>
            <p className='feedback'>Feedback: {analysis.feedback}</p>
            <div className='rating-container'>
                <h1 className='rating-header'>Ratings</h1>
                <h2 className='investments-rating'>Investments: {analysis.ratings.investing.rating}</h2>
                <StarRating props={analysis.ratings.investing.rating}/>
                <p className='investments-explanation'>{analysis.ratings.investing?.explanation}</p>
                <h2 className='savings-rating'>Savings: {analysis.ratings.saving.rating}</h2>
                <StarRating props={analysis.ratings.saving.rating}/>
                <p className='investments-explanation'>{analysis.ratings.saving?.explanation}</p>
                <h2 className='spending-rating'>Spending: {analysis.ratings.spending.rating}</h2>
                <StarRating props={analysis.ratings.spending.rating}/>
                <p className='investments-explanation'>{analysis.ratings.spending?.explanation}</p>
                <h2 className='overall-rating'>Overall: {analysis.ratings.overall.rating}</h2>
                <StarRating props={analysis.ratings.overall.rating}/>
                <p className='investments-explanation'>{analysis.ratings.overall?.explanation}</p>
            </div>
            <Link to="/budgets"><button className='budget-button'>Create Budget?</button></Link>
        </div> ))
    )
}

export default Analysis
