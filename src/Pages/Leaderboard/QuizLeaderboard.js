import { Container } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'
import Leaderboard from '../../components/Leaderboard/Leaderboard'
import isUserLoggedIn from '../../services/isUserLoggedIn'

const QuizLeaderboard = () => {
    isUserLoggedIn()
    const {quizId} = useParams()
    const [data, setData] = useState([])
    const [quizTitle, setQuizTitle] = useState('')
    const {userData} = useContext(BasicContext)
    const {jwt} = userData

    useEffect(() => {
        let headers = {Authorization: `Bearer ${jwt}`}
        axios(`${API_URL}/played-games?filters[quiz][id][$eq]=${quizId}&populate=*`, {headers})
            .then(res => {
                setQuizTitle(res.data.data[0].attributes.quiz.data.attributes.title)
                console.log(res.data.data);

                let readyData = res.data.data.map(quiz => {
                    const playedGame = quiz.attributes
                    
                    console.log(playedGame.user.data.attributes.username, playedGame.title);

                    return {
                        id: playedGame.quiz.data.id,
                        title: playedGame.title,
                        gameType: playedGame.gameType.data,
                        result: playedGame.correctAnswers,
                        user: playedGame.user.data
                    }
                }).sort((a, b) => b.result - a.result)

                const filteredData = readyData.filter((value, index, self) => (
                    index === self.findIndex((t) => (
                        t.user.id === value.user.id
                    ))
                ))

                console.log(filteredData);
                setData(filteredData)
            })
    }, [jwt, quizId])
    

    const headData = ['', 'User', 'Game Type', 'Result']
  return (
    <Container>
        <div className='leaderboard-wrapper'>
            <h1>{quizTitle}</h1>
            <Leaderboard headData={headData} bodyData={data} />
        </div>
    </Container>
  )
}

export default QuizLeaderboard