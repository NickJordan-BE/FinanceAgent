import React from 'react'

import "./index.css"

const Loading = (props) => {
  return (
    <div class="loader">
        <span class="loader-text">{props.props}</span>
        <span class="load"></span>
    </div>
  )
}

export default Loading
