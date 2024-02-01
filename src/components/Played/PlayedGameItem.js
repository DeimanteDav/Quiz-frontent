import React from 'react'
import { Link } from 'react-router-dom'
import './PlayedGameItem.scss'
import { getFullDate } from '../../services/dateFunctions'

const PlayedGameItem = ({game, quizzes}) => {
    let gameDate = getFullDate(game.attributes.createdAt)

    let quiz = quizzes.filter(quiz => quiz.id === game.attributes.quiz.data.id)[0].attributes
    

    const {title, passed, correctAnswers, coinsReceived} = game.attributes
    const questionsLength = quiz.questions.data.length
    
   return (
    <div className='played-game-card' key={game.id}>
        <Link to={`/played-games/${game.id}`} >
            {title &&  <span>{title}</span>}

            {passed ? (
              <span className='passed'>Passed</span>
            ) : (
              <span className='failed'>Failed</span>
            )}

            <p>
            Total Questions: <span>{questionsLength}</span>
            </p>
            <p>
            Correct Answers: <span>{correctAnswers}</span>
            </p>
            <p>
            Your Score: <span>{Math.round((correctAnswers/questionsLength)*100)}%</span>
            </p>
            {(coinsReceived && coinsReceived !== 0) && <p>
            <span>Received {coinsReceived} coins</span>
            </p>}
            <span className='date'>{gameDate}</span>
        </Link>
    </div>
  ) 
}

export default PlayedGameItem