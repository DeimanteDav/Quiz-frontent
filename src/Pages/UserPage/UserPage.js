import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '../../components/Container'
import  './UserPage.scss'
import axios from 'axios'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'
import PlayedGameItem from '../../components/Played/PlayedGameItem'
import getGroups from '../../services/groups/getGroups'
import FriendshipButton from '../../components/Friends/FriendshipButton'
import { Button } from '@mui/material'

const UserPage = () => {
  let {userId} = useParams()
  const [userData, setUserData] = useState([])
  const [bestGames, setBestGames] = useState([])
  const [quizzes, setQuizzes] = useState([])

  

  const ctx = useContext(BasicContext)
  const {jwt, user} = ctx.userData

  useEffect(() => {
    const headers = {Authorization: `Bearer ${jwt}`}
    axios(`${API_URL}/users/${userId}`, {headers})
      .then(res => setUserData(res.data))

    axios(`${API_URL}/played-games?filters[user][id][$eq]=${userId}&populate[quiz][populate]=*`, {headers})
      .then(res => {
        let bestPlayedGames = res.data.data.filter(game => {
          const gameData = game.attributes
          const questionsAmount = gameData.quiz.data.attributes.questionsAmount ? gameData.quiz.data.attributes.questionsAmount : gameData.quiz.data.attributes.questions.data.length

          const passed = gameData.passed
          const passedPercentage = gameData.passedPercentage ? gameData.passedPercentage : Math.round((gameData.correctAnswers/questionsAmount)*100)

          if (!passed || passedPercentage < 70) {
            return false
          }

          return game
        })
        setBestGames(bestPlayedGames)
        setQuizzes(bestPlayedGames.map(game => game.attributes.quiz.data))
      })

  }, [jwt, userId])



  if (user.length === 0) {
    return ''
  }

  return (
    <Container>
      <div className='user-page'>
        <h1>{userData.username}</h1>

        <div className='info'>
          <span>Email</span>
          <span>{userData.email}</span>
        </div>

        {/* {user.id !== Number(userId) && (
          <div>
             {userFriendId ? (
              <Button variant='contained' onClick={() => setDialogOpen(true)} startIcon={<PeopleAltIcon />}>
                Friends
              </Button>
            ) : (
              <>
                {sendingRequestId ? (
                  <Button variant='contained' disabled={buttonInactive} onClick={cancelFriendHandler} startIcon={<HighlightOffIcon />} size='small'>
                    Cancel Request
                  </Button>
                ) : (
                  receivingRequestId ? (
                    <Button variant='contained' disabled={buttonInactive}  onClick={acceptFriendHandler} startIcon={<PersonAddAlt1Icon />} size='small'>
                      Accept
                    </Button>
                  ) : (
                    <Button variant='contained' disabled={buttonInactive}  onClick={addFriendHandler} startIcon={<PersonAddAlt1Icon />} size='small'>
                      Add Friend
                    </Button>
                  )
                )}
              </>
            )} 
         

            {createdGroups.length > 0 && (
              <Button onClick={() => setClickedAddToGroup(true)}>Add to Group</Button>
            )}
          </div>
        )} */}

        <FriendshipButton
          id={userId} 
        />

        {bestGames.length > 0 && (
          <div className='best-games-wrapper'>
            <h2>Best played games</h2>
            <div className='best-games'>
              {bestGames.map(game => (
                <PlayedGameItem key={game.id} game={game} quizzes={quizzes}/>
              ))}
            </div>
          </div>
        )}
      </div>
      
    </Container>
  )
}

export default UserPage