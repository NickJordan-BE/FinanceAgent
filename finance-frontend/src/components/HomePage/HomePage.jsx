import { useEffect, useState } from 'react'
import useAxiosPrivate from "../../hooks/useAxiosPrivate"

import "./index.css"


const HomePage = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const axiosPrivate = useAxiosPrivate();

  // Re-render every message
  useEffect(() => {
  },[messages])

  // API call for chatbot
  const handleMessage = async (e) => {
    e.preventDefault();
    setInput("")

    if (input.trim() === "") {
      setMessages((prevMessages) => [...prevMessages, "Please Ask A Valid Question."]);
      return 
    }

    const userMessage = input.trim();
    setMessages((prevMessages) => [...prevMessages, { sender: "user", content: userMessage}]);

    try {
      const AIResponse = await axiosPrivate.post("/api/chat", {
        query: userMessage
      });

      setMessages((prevMessages) => [...prevMessages, { sender: "ai", content: AIResponse.data.data }]);
      
    } catch (err) {
      console.log("Error getting AI response: ", err)
    }
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
                <li key={index} className={`${msg.sender}-message`}>{msg.content}</li>
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
