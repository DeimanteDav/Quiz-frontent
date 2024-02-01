import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '../components/Container';
import { API_URL } from '../config';

const QuestionType = () => {
    let {questionTypeId} = useParams()
    const [questionType, setQuestionType] = useState('')
    const [questions, setQuestions] = useState([])

    useEffect(() => {
        axios.get(`${API_URL}/question-types/${questionTypeId}?fields=type`)
            .then(res => setQuestionType(res.data.data.attributes.type))

        axios.get(`${API_URL}/questions?filters[question_type][id][$eq]=${questionTypeId}`)
            .then(res => setQuestions(res.data.data))
    }, [questionTypeId])
    

  return (
    <Container>

        <div>
            <h1>{questionType && (questionType[0].toUpperCase() + questionType.slice(1))}</h1>

            {questions.length > 0 ? (
                <ul>
                    {questions.map(question => (
                        <li style={{marginBottom: '10px'}} key={question.id}>{question.attributes.content}</li>
                    ))}
                </ul>
                ) : (
                    <span>No questions</span>
                    )}
        </div>
    </Container>
  )
}

export default QuestionType