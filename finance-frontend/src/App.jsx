import React from "react"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from "./route/Home"
import Register from "./route/Register"
import Login from "./route/Login"
import ProtectedRoute from "./route/ProtectedRoute"
import MissingPage from "./route/Missing"
import Layout from "./components/Layout/Layout"
import Spending from "./route/Spending"
import CreateTransaction from "./route/CreateTransaction"
import UpdateTransaction from "./route/UpdateTransaction"
import AnalysisPage from "./route/AnalysisPage"
import BudgetPage from "./route/BudgetPage"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />} />
              <Route path="/spending/log" element={<Spending />} />
              <Route path="/spending/log/create" element={<CreateTransaction />} />
              <Route path="/spending/log/update/:id" element={<UpdateTransaction />} />
              <Route path="/analysis" element={<AnalysisPage />} />
              <Route path="/budgets" element={<BudgetPage />} />
            </Route>
            
            <Route path="/register" element={<Register />}/>
            <Route path="/login" element={<Login />}/>
          </Route>

          <Route path="*" element={<MissingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
