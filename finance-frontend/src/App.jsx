import React from "react"
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from "./route/Home"
import Register from "./route/Register"
import Login from "./route/Login"
import ProtectedRoute from "./route/ProtectedRoute"
import MissingPage from "./route/Missing"
import Layout from "./components/Layout/Layout"

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Home />}/>
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
