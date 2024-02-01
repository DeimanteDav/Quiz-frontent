import React, { useContext, useEffect, useState } from 'react'
import Container from '../../components/Container.js'
import './PlayedGames.scss'
import { Link } from 'react-router-dom'
import { Tab } from '@mui/material'
import getGameTypes from '../../services/getGameTypes.js'
import { BasicContext } from '../../context/BasicContext.js'
import PlayedGamesData from '../../components/Played/PlayedGamesData.js'
import isUserLoggedIn from '../../services/isUserLoggedIn.js'


const PlayedGames = () => {
  isUserLoggedIn()
  const [noGamesPlayed, setNoGamesPlayed] = useState(false)
  const [gameTypes, setGameTypes] = useState([])
  
  // TODO: useriai find findone ijungta 
  let ctx = useContext(BasicContext)
  const {userData} = ctx

  useEffect(() => {
    if (userData) {
      async function getTypes() {
        setGameTypes(await getGameTypes())
      }
      getTypes()
    }
  }, [userData])
  

  let tabs = gameTypes.map(gameType => (
    <Tab key={gameType.id} label={gameType.attributes.type} value={`${gameType.id}`}/>
  ))


  if (!userData) {
    return (
      <Container>
        <span>You need to register</span>
        <Link to={`/register`}>Register</Link>
      </Container>
    )
  }

  return (
    <Container>
      {noGamesPlayed ? (
        <div className='no-games-played'>
          
          <span>You haven't done a quiz</span>
          <Link to={'/quizzes'}>Click Here to play</Link>
        </div>
      ) : (
        <PlayedGamesData setNoGamesPlayed={setNoGamesPlayed} gameTypes={gameTypes} tabs={tabs}/>
      )}
    </Container>
  )
}

export default PlayedGames