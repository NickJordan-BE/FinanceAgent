import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAxiosPrivate from '../../hooks/useAxiosPrivate'

import "./index.css"

const UpdateTransactionLog = () => {
  const [amountCheck, setAmountChecked] = useState(false);
  const [compCheck, setCompChecked] = useState(false);
  const [newAmount, setNewAmount] = useState("");
  const [newCompany, setNewCompany] = useState("");
	const { id } = useParams();
  const axiosPrivate = useAxiosPrivate();
  const nav = useNavigate();

  const handleAmountCheck = (event) => {
    setAmountChecked(event.target.checked);
  };

  const handleCompCheck = (event) => {
    setCompChecked(event.target.checked);
  };


	const handleSubmit = async (e) => {
    e.preventDefault();

		try {

      if (compCheck && amountCheck) {
		    const fullUpdateRes = await axiosPrivate.patch(`/api/transactions/${id}/update`,{
          new_amount: newAmount,
          new_company: newCompany 
        });
      } else if (compCheck && !amountCheck) {
        const companyUpdateRes = await axiosPrivate.patch(`/api/transactions/${id}/new-company`,{
          new_company: newCompany 
        });
      } else {
        const amountUpdateRes = await axiosPrivate.patch(`/api/transactions/${id}/new-amount`,{
          new_amount: newAmount 
        });
      }

      setAmountChecked(false);
      setCompChecked(false);
      setNewAmount("");
      setNewCompany("");
      nav('/spending/log');

      return;
		} catch (err) {

			console.log(err);
			return err;
		}
	}	


  return (
    <div className='update-container'>
        <h1 className='update-header'>Update Transaction</h1>
    <form onSubmit={handleSubmit}>
      <label className='update-text-label'>Amount</label>
      <input className='update-text-input' placeholder='New Amount in $$$' onChange={(e) => setNewAmount(e.target.value)} type="text" value={newAmount}/>
      <label className='update-text-label'>Company</label>
      <input className='update-text-input' placeholder='New Company' onChange={(e) => setNewCompany(e.target.value)} type="text" value={newCompany}/>
      <div className='checkbox-container'>
        <input className='update-check-input' type='checkbox' checked={amountCheck} onChange={handleAmountCheck}/>
        <label className='update-check-label'> Update Amount? </label>
        <input className='update-check-input' type='checkbox' checked={compCheck} onChange={handleCompCheck}/>
        <label className='update-check-label'> Update Company? </label>
      </div>
      <button type='submit'>Update</button>    <Link to="/spending/log"><button>Cancel</button></Link>
    </form>
  </div>
  )
}

export default UpdateTransactionLog
