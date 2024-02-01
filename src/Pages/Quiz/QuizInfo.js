import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Container from '../../components/Container'
import getQuizData from '../../services/getQuizData'
import TextBlock from '../../components/TextBlock/TextBlock'
import { DEFAULT_NUM_OF_QUESTIONS } from '../../config'

const QuizInfo = () => {
    const {quizId}  = useParams()
    const [quizData, setQuizData] = useState([])
    
    useEffect(() => {
        async function getQuizInfo() {
            setQuizData((await getQuizData(quizId)).attributes)
        }   
        getQuizInfo()
    }, [quizId])
    console.log(quizData);

    if (quizData.length === 0) {
        return ''
    }
    console.log(quizData);
    
    const {title, difficulty, passingPercentage, statistic} = quizData


    let statisticElement = ''
    if (statistic) {
        const {totalGames, totalFailed, totalPassed, standard, speedGame, timed} = statistic
        statisticElement = (
            <div className='statistic-wrapper'>
                <h2>Statistic</h2>

                <div className='statistic'>
                    <TextBlock title={'Total Games'} text={totalGames} />
                    <TextBlock title={'total passed'} text={totalPassed} />
                    <TextBlock title={'total failed'} text={totalFailed} />

                    <div className='standard'>
                        <h3>Standard game type</h3>
                        <TextBlock title={'average score'} text={standard.averageScore} unit={'%'} />
                        <TextBlock title={'played games'} text={standard.games} />
                    </div>
                </div>

            </div>
        )
    }

    // TODO: visu gametypes statistikas

  return (
    <Container>
        <div className='quiz-info-page'>
            <h1>{title}</h1>
            
            <TextBlock title={'Difficulty'} text={difficulty.data.attributes.title} />
            <TextBlock title={'Passing Percentage'} text={passingPercentage} unit={'%'} />
            <TextBlock title={'Questions Amount'} text={quizData.questionsAmount ? quizData.questionsAmount : DEFAULT_NUM_OF_QUESTIONS} />

            {statisticElement}

            <Link to={`/quiz-type-page/${quizId}`}>Start Game</Link>
        </div>  
    </Container>
  )
}

export default QuizInfo