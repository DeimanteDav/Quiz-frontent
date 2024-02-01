import { TabPanel } from '@mui/lab'
import React, { useContext, useEffect, useState } from 'react'
import { BasicContext } from '../../context/BasicContext'
import getPlayedGamesStatistic from '../../services/getPlayedGamesStatistic'
import getUserGamesStatisc from '../../services/getUserGamesStatistic'
import { Skeleton, Stack } from '@mui/material'
import TextBlock from '../TextBlock/TextBlock'
 
const PlayedGamesStatistics = ({gameTypes, tabValue, setNoGamesPlayed}) => {
    const [totalStatistic, setTotalStatistic] = useState(null)
    const [userStatistic, setUserStatistic] = useState(null)

    const ctx = useContext(BasicContext)
    const {userData} = ctx

    useEffect(() => {
        async function getStatistics() {
          let playedGameResult = await getPlayedGamesStatistic()
          setTotalStatistic(playedGameResult)
    
          let userGamesResult = (await getUserGamesStatisc())
          if (userGamesResult.length === 0) {
            setNoGamesPlayed(true)
            setUserStatistic(userGamesResult)
          } else {
            setUserStatistic(userGamesResult[0].attributes)
          }
        }
        getStatistics()
    }, [userData, setNoGamesPlayed])

    
    if (!userStatistic) {
        return (
            <Stack spacing={1}>
                <Skeleton variant='text' sx={{ fontSize: '2rem' }} width={150}/>
                <Skeleton variant='rectangular' height={300}/>
            </Stack>
        )
    }

    let tabPanels = gameTypes.map(gameType => {
        if (tabValue !== `${gameType.id}`) {
            return ''
        }
        
        let statistic = Object.entries(userStatistic).find(key => key[0] === gameType.attributes.type)[1]

        let el = Object.entries(statistic).map(([key, value]) => {
        const result = key.replace(/([A-Z])/g, " $1");
        const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
        return (
            (key !== 'id' && key !== 'score') && (
            <div key={key}>
                <span>{finalResult}</span>
                <span>{value}</span>
            </div>
            )
        )
        })
    
        return (
        <TabPanel value={`${gameType.id}`} key={gameType.id}>
            <div className='statistics'>{el}</div>
        </TabPanel>
        )
    })

    const {totalGames, totalPassed, totalFailed, totalScore} = userStatistic

  return (
    <div className='statistics-wrapper'>
        <h2>Statistics</h2>
        <TabPanel value= '0'>
        <div className='statistics'>
            <TextBlock title='Games Played' text={totalGames} />
            <TextBlock title='Passed' text={totalPassed} />
            <TextBlock title='Failed' text={totalFailed} />
            <TextBlock title='Winning Percentage' text={`${Math.round(totalPassed/totalGames*100)}%`} />
            <TextBlock title='Your Average Score' text={`${Math.round(totalScore/totalGames)}%`} />
            <TextBlock title='Global Average Score' text={`${Math.round(totalStatistic.totalScore/totalStatistic.totalGames)}%`} />
        </div>
        </TabPanel>
        {tabPanels}
    </div>
  )
}

export default PlayedGamesStatistics