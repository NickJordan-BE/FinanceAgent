import React from 'react'
import { useState } from 'react'

import "./index.css"


const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");


  const handleMessage = () => {
    
  }


  return (
    <div className='home-container'>
      <h1 className='home-header'>Welcome To Financial Literacy</h1>
      <div className='chat-container'> 
        <div className="card">
          <div className="chat-header">Financial Literate</div>
          <div className="chat-window">
            <ul className="message-list" >
            {messages.map((msg, index) => {
              return (
                <li key={index} className='message'>{msg}</li>
              )
            })}
            </ul>
          </div>
          <div className="chat-input">
            <input type="text" className="message-input" placeholder="Ask Finance Questions Here" value={input} onChange={e => setInput(e.target.value)}/>
            <button className="send-button" onClick={handleMessage}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
