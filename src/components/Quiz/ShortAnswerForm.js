import React from 'react'

const ShortAnswerForm = ({ onAnswer, enteredAnswer }) => {
  return (
    <input 
      type='text'
      value={enteredAnswer}
      onChange={(e) => onAnswer(e.target.value)}
    />
  )
}

export default ShortAnswerForm