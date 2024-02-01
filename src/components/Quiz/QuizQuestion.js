import React from 'react'
import Timer from '../Timer'
import './QuizQuestion.scss'

const QuizQuestion = ({ questionIndex, question, questionsLength, isTimed, num}) => {
  return (
    <div className='quiz-question-wrapper'>
      <div className='top-section'>
        <div className='current-question'>
          <span>{questionIndex + 1}</span>
          <span>/{questionsLength}</span>
        </div>

        {isTimed && (
          <Timer num={num} />
        )}
      </div>

      <h1 className='question'>{question}</h1>
    </div>
  )
}

export default QuizQuestion