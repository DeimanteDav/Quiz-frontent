import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '../../components/Container'
import './PlayedGames.scss'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'
import PlayedGameStatistic from '../../components/Played/PlayedGameStatistic'
import PlayedQuizInfo from '../../components/Quiz/PlayedQuizInfo'
import Leaderboard from '../../components/Leaderboard/Leaderboard'
import isUserLoggedIn from '../../services/isUserLoggedIn'

const PlayedGame = () => {
    isUserLoggedIn()
    let {playedGameId} = useParams()
    const [data, setData] = useState(null)
    const [quiz, setQuiz] = useState(null)

    const [leaderboadData, setLeaderboardData] = useState([])

    const {userData} = useContext(BasicContext)
    const {jwt}  = userData


    useEffect(() => {
        let headers = {Authorization: `Bearer ${jwt}`}

        axios.get(`${API_URL}/played-games/${playedGameId}?populate[playerAnswers][populate]=*&populate[quiz][populate]=*&populate[quizStatistic][populate]=*&populate[gameType][populate]=*&populate[difficulty][populate]=*`, {headers})
            .then(res => setData(res.data.data.attributes))
    }, [playedGameId, jwt])


    useEffect(() => {
        if (data) {
            axios.get(`${API_URL}/quizzes/${data.quiz.data.id}?populate[questions][populate]=answers`, {
                headers: {
                    Authorization: `Bearer ${userData.jwt}`
                }})
                .then(res => setQuiz(res.data.data))
        }

    }, [data, userData])

    useEffect(() => {
        if (quiz) {
            let headers = {Authorization: `Bearer ${jwt}`}

            axios(`${API_URL}/played-games?filters[quiz][id][$eq]=${quiz.id}&populate=*`, {headers})
            .then(res => {
                let readyData = res.data.data.map(quiz => {
                    const playedGame = quiz.attributes
            
                    return {
                        id: playedGame.quiz.data.id,
                        title: playedGame.title,
                        gameType: playedGame.gameType.data,
                        result: playedGame.correctAnswers,
                        user: playedGame.user.data
                    }
                }).sort((a, b) => b.result - a.result)
            
                const filteredData = readyData.filter((value, index, self) =>
                    index === self.findIndex((t) => (
                        t.user.id === value.user.id && t.title === value.title
                    ))
                )

                setLeaderboardData(filteredData)
            })
        }
    }, [jwt, quiz])
        
    if (!data || !quiz) {
        return ''
    }

    const questions = quiz.attributes.questions.data
    const gameType = data.gameType.data.attributes.type


    const headData = ['', 'User', 'Game Type', 'Result']

  return (
    <Container>
        <div className='played-game'>
            <div className='wrapper'>
                <PlayedQuizInfo
                    className='played-game-info'
                    title='Played Game'
                    data={data}
                    questionsLength={questions.length}
                    extraInfo
                    gameType={gameType}
                />

                <Leaderboard headData={headData} bodyData={leaderboadData} />
            </div>

            <PlayedGameStatistic quizStatistic={data.quizStatistic} />

            {quiz.attributes.questions.data.map((question, i) => {
                let correctAnswers = question.attributes.answers.data

                let correctAnswersElement = correctAnswers.map(answer => (
                    <span key={answer.id} className='correct-answer'>{answer.attributes.name}</span>
                ))


                let playerAnsw = correctAnswers.map((correctAnswer, index) => {
                    const playerAnswer = data.playerAnswers[i].answers[index]
               
                    if (!playerAnswer) {
                        return  <span key={correctAnswer.id}  className='player-answer'></span>
                    }

                    if (correctAnswer.attributes.name === playerAnswer.answer) {
                        return <span key={correctAnswer.id} className='correct-answer'>{playerAnswer.answer}</span>
                    } 

                    return <span key={correctAnswer.id}  className='player-answer'>{ playerAnswer.answer}</span>
                })

                return (
                    <div className='quiz' key={question.id}>
                        <h1 className='question'>{question.attributes.content}</h1>
                        <div className='answers'>
                            <div className='correct-answers'>
                                {correctAnswersElement}
                            </div>
                            <div className='player-answers'>
                                {playerAnsw}
                            </div>
                        </div>
                    </div>
                )
            })}
        </div>
    </Container>
  )
}

export default PlayedGame