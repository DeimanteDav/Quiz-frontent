import React from 'react'
import { Link } from 'react-router-dom'

const PlayedQuizInfo = ({className, ifPassed = false, passingPercentage, title, data, questionsLength, extraInfo = false, notRegistered, link = false, playedGameId, gameType}) => {
    let score = Math.round(data.correctAnswers/questionsLength*100)
  return (
    <div className={className}>
        <h1>{title}</h1>
        <h2>{data.quiz.data.attributes.title}</h2>

        {ifPassed && (
            passingPercentage <= score ? (
                <h2 className='passed'>You Passed</h2>
            ) : (
                <h2 className='failed'>You Failed</h2>
            )
        )}

        <p>
            Total Questions: <span>{questionsLength}</span>
        </p>
        <p>
            Correct Answers: <span>{data.correctAnswers}</span>
        </p>
        <p>
            Your Score: <span>{score}%</span>
        </p>
        <p>
            Hints Used: <span>{data.hintsUsed}</span>
        </p>

        {extraInfo && (
            <>
                {data.coinsReceived > 0 && <p>
                    <span>Received {data.coinsReceived} coins</span>
                </p>}

                {data.difficulty.data && <p>
                    Difficulty <span>{data.difficulty.data.attributes.title} </span>
                </p>}

                <span className='type'>{gameType}</span>
            </>
        )}

        {link && (
            notRegistered ? (
                    <Link to={`/register`}>Register to see your answers</Link>
                ) : (
                    <Link to={`/played-games/${playedGameId}`}>See Your answers</Link>
                )
        )}
    </div>
  )
}

export default PlayedQuizInfo