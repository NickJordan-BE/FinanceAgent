import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'
import useAuth from '../../hooks/useAuth'

import './index.css'


const AddTransaction = () => {
  const axiosPrivate = useAxiosPrivate();
  const [amount, setAmount] = useState("");
  const [company, setCompany] = useState("");
  const { curUser } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      const result = await axiosPrivate.post("/api/transactions/create", {
        amount,
        company,
        uid: curUser.uid
      })

      setAmount("");
      setCompany("");
      nav('/spending/log');

      return;
    } catch (err) {
      console.log(err)
      return err
    }
  }


  return (
    <div className='add-container'>
        <h1 className='add-header'>Create A New Transaction</h1>
      <form onSubmit={handleSubmit}>
        <label>Amount</label>
        <input placeholder='Amount in $$$' onChange={(e) => setAmount(e.target.value)} type="text" value={amount}/>
        <label>Company</label>
        <input placeholder='Company' onChange={(e) => setCompany(e.target.value)} type="text" value={company}/>
        <button type='submit'>Add</button>
      </form>
      <Link to="/spending/log"><button>Cancel</button></Link>
    </div>
  )
}

export default AddTransaction;
