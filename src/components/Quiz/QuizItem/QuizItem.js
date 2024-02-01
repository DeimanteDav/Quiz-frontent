import React from 'react'
import { Link } from 'react-router-dom'
import './QuizItem.scss'
import TextBlock from '../../TextBlock/TextBlock'
import { DEFAULT_NUM_OF_QUESTIONS } from '../../../config'

const QuizItem = ({quizzes}) => {
  return (
    quizzes.length > 0 ? (
        quizzes.map(quiz => {
            const difficultyObj = quiz.attributes.difficulty.data
            const questionsLength = quiz.attributes.questionsAmount ? quiz.attributes.questionsAmount : DEFAULT_NUM_OF_QUESTIONS
 
            return (
                <div className='quiz-item' style={{marginBottom: '10px'}}  key={quiz.id}>
                    <Link to={`/quiz-info/${quiz.id}`}>
                        <h4>{quiz.attributes.title}</h4>
                        
                        <div className='description'>
                            <TextBlock title={'questions'} text={questionsLength} />
                            {difficultyObj && (
                                <TextBlock title={'difficulty'} text={difficultyObj.attributes.title}/>
                            )}
                        </div>


                    </Link>
                    
                </div>
            )
        })
    ) : <span>No quizzes were found that matches these filters</span>
  )
}

export default QuizItem