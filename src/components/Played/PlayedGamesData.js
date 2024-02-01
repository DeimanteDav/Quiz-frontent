import React, { useState } from 'react'
import PlayedGamesStatistics from './PlayedGamesStatistics'
import Coins from '../Coins'
import PlayedGamesList from './PlayedGamesList'
import { Box, Tab } from '@mui/material'
import { TabContext, TabList } from '@mui/lab'

const PlayedGamesData = ({setNoGamesPlayed, gameTypes, tabs}) => {
  const [tabValue, setTabValue] = useState('0')

  return (
    <div className='played-games-page'>
     <TabContext value={tabValue}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', maxWidth: 460 }} className='tabs-wrapper'>
          <TabList onChange={(e, value) => setTabValue(value)} centered>
            <Tab label='all' value='0' className='tab'/>
            {tabs}
          </TabList>
        </Box>

        <Coins displayTitle loader />
      
        <PlayedGamesStatistics gameTypes={gameTypes} tabValue={tabValue} setNoGamesPlayed={setNoGamesPlayed} />
      </TabContext>

      <PlayedGamesList tabValue={tabValue}/>
    </div>
  )
}

export default PlayedGamesData