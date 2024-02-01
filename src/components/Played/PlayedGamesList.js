import React, { useContext, useEffect, useState } from 'react'
import { BasicContext } from '../../context/BasicContext'
import axios from 'axios'
import { API_URL } from '../../config'
import { Skeleton, Stack } from '@mui/material'
import PlayedGameItem from './PlayedGameItem'

const PlayedGamesList = ({tabValue}) => {
    const [playedGames, setPlayedGames] = useState(null)
    const [quizzes, setQuizzes] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    const {userData} = useContext(BasicContext)
    
    useEffect(() => {
        setIsLoading(true)
        async function getAllPlayedGames() {
            let headers = {
            Authorization: `Bearer ${userData.jwt}`
            }
    
            let {data} = await axios.get(`${API_URL}/played-games?populate=*&filters[user][id][$eq]=${userData.user.id}`,  {headers})

            let playedGamesData = data.data
            if (tabValue !== '0') {
                playedGamesData = data.data.filter(game => {
                    let gameTypeId = game.attributes.gameType.data.id
                    return gameTypeId === Number(tabValue)
                })
            }

            setPlayedGames(playedGamesData)
        }
        getAllPlayedGames()
    }, [userData, tabValue])


       
    useEffect(() => {
        if (playedGames) {
            axios.get(`${API_URL}/quizzes?populate[questions][populate]=answers`, {
                headers: {
                Authorization: `Bearer ${userData.jwt}`
                }})
                .then(res => {
                    setIsLoading(false)
                    setQuizzes(res.data.data)
                })
        }
    }, [playedGames, userData])
    
    
    if (isLoading) {
        return (
            <Stack spacing={1}>
                <Skeleton variant='text' sx={{ fontSize: '2rem' }} width={150}/>
                <Skeleton variant='rectangular' width='45%' height={300}/>
            </Stack>
        )
      }

    let playedGamesEl = playedGames.length > 0 ? (
        playedGames.map(game => (
            <PlayedGameItem key={game.id} game={game} quizzes={quizzes} />
        ))
    ) : (
        <span>You haven't played games in this game type</span>
    )



  return (
    <div className='played-games-wrapper'>
    <h2>Played Games</h2>
    {playedGames.length > 0 && <span>Click on the game to view your results</span>}

    <div className='played-games'>
        {playedGamesEl}
    </div>
  </div>
  )
}

export default PlayedGamesList