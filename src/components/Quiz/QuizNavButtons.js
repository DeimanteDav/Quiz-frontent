import React from 'react'

const QuizNavButtons = ({ length, questionIndex, onQuestionChange, onQuizFinish}) => {
  return (
    <div className='quiz-nav-buttons'>
      {questionIndex > 0 && <button className='quiz-nav-button next-button' onClick={() => onQuestionChange(-1)}>Previous</button>}

      {questionIndex < length - 1 ? (
        <>
          <button className='quiz-nav-button previous-button' onClick={() => onQuestionChange(1)}>Next</button>
          <div className='extra-info'>
            <small>Press Enter for the next question</small>
          </div>
        </>
      ) : (
        <button className='quiz-nav-button finish-button' onClick={onQuizFinish}>finish</button>
      )}
    </div>
  )
}

export default QuizNavButtons