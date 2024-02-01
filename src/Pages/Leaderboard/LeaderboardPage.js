import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'
import './LeaderboardPage.scss'
import Container from '../../components/Container'
import Leaderboard from '../../components/Leaderboard/Leaderboard'
import { Box, Tab, Tabs } from '@mui/material'
import getFriends from '../../services/friendsHandlers/getFriends'
import isUserLoggedIn from '../../services/isUserLoggedIn'

const LeaderboardPage = () => {
    isUserLoggedIn()

    const [data, setData] = useState([])
    const [tabValue, setTabValue] = useState(0)
    const [allPlayedGames, setAllPlayedGames] = useState([])
    const [friends, setFriends] = useState([])
    const {userData} = useContext(BasicContext)
    const {jwt, user} = userData ? userData : []


    useEffect(() => {
        if (userData) {
            let headers = {Authorization: `Bearer ${jwt}`}
            axios(`${API_URL}/played-games?populate=*`, {headers})
                .then(res => {
                    console.log(res.data.data);
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
                    
                    const filteredData = readyData.filter((value, index, self) => {
                        return index === self.findIndex((t) => (
                            t.user.id === value.user.id && t.title === value.title
                        ))
                    })     

                    setAllPlayedGames(filteredData)
                })
    
            const getFriendsData = async () => {
                setFriends(await getFriends())
            }
            getFriendsData()
        }
    }, [jwt, userData])

    useEffect(() => {
        if (allPlayedGames.length > 0 && userData) {
            switch (tabValue) {
                case 0:
                    setData(allPlayedGames)
                    break;
            
                case 1:
                    const filteredFriends = allPlayedGames.filter(game => {
                        console.log(game);
                        return friends.some(friend => {
                            console.log(friend);
                            return game.user.id === friend.user.id || game.user.id === user.id
                        })
                    })
                    setData(filteredFriends)
                    break;
                default:
            }
        }
    }, [tabValue, allPlayedGames, friends, userData, user.id])

    const headData = ['', 'user', 'quiz title', 'game type', 'result']
    console.log(data);
  return (
    <Container>
        <div className='leaderboard-page'>
            <Box sx={{ borderColor: 'divider', margin: 1 }} className='tabs'>
                <Tabs value={tabValue} onChange={(e, value) => setTabValue(value)} centered>
                    <Tab label='Global' />
                    <Tab label='Friends' />
                </Tabs>
            </Box>

            {(friends.length === 0 && tabValue === 1) ? (
                <span>You have no Friends</span>
            ) : (
                <Leaderboard headData={headData} bodyData={data} displayQuiz={true}/>
            )}

        </div>
    </Container>
  )
}

export default LeaderboardPage