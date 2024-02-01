import React from 'react'
import TextBlock from '../TextBlock/TextBlock'

const PlayedGameStatistic = ({quizStatistic}) => {
    if (!quizStatistic) {
        return ''
    }

    const {games, averageScore, averageTime} =  quizStatistic
    const averageTimeElement = averageTime && <TextBlock title={'average time'} text={averageTime} unit='s' />

  return (
    <div className='quiz-statistic-wrapper'>
        <h2>Quiz statistic</h2>
        <div className='quiz-statistic'>
            <TextBlock title={'games'} text={games}/>
            <TextBlock title={'average score'} text={averageScore} unit='%' />
            {averageTimeElement}
        </div>
    </div>
  )
}

export default PlayedGameStatistic