import React from 'react'

const StarRating = (props) => {
  return (
    <div>
    {[1, 2, 3, 4, 5].map((star) => {
        return (  
            <span
            className='start'
            style={{
                color: props.props >= star ? 'gold' : 'gray',
                fontSize: `42px`,
            }}
            >
            {' '}
            ★{' '}
            </span>
        )
        })}
    </div>
  )
}

export default StarRating
