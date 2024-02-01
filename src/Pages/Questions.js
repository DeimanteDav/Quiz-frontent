import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Container from '../components/Container';
import './Questions.scss'
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_URL } from '../config';
import { BasicContext } from '../context/BasicContext';


const Questions = () => {
    const [questions, setQuestions] = useState([])
    const [pageData, setPageData] = useState(null)

    const [questionInput, setQuestionInput] = useState('')
    const [answerInput, setAnswerInput] = useState('')

    const ctx = useContext(BasicContext)
    const {userData} = ctx

    useEffect(() => {
        axios.get(`${API_URL}/questions?fields=content`, {
            headers: {
                Authorization: `Bearer ${userData.jwt}`
            }
        })
            .then(res => setQuestions(res.data.data))

        axios.get(`${API_URL}/questions-page`)
            .then(res => setPageData(res.data.data.attributes))
    }, [])

    const recQuestionHandler = (e) => {
        e.preventDefault()
        axios.post(`${API_URL}/recommended-questions`, {
            data : {
                question: questionInput,
                answer: answerInput
            }
        })
            .then(res => {
                if (res.statusText === 'OK') {
                    setQuestionInput('')
                    setAnswerInput('')
                    toast.success('Question submitted')
                }
            })
    }


    if (!pageData) {
        return ''
    }

  return (
    <Container>
        <div className='questions-page'>
            <div className='content'>
                <h1>{pageData.title}</h1>
                <ul>
                    {questions.map(question => (
                        <li  style={{marginBottom: '10px'}}  key={question.id}>
                            <Link to={`/questions/${question.id}`}>{question.attributes.content}</Link>
                        </li>
                    ))}
                </ul>
            </div>

            <form onSubmit={recQuestionHandler} className='rec-questions'>
                <span className='text'>{pageData.recommend}</span>
                <TextField
                    label={pageData.questionInput}
                    className='input'
                    size='small'
                    variant='outlined' 
                    value={questionInput}
                    onChange={(e) => setQuestionInput(e.target.value)}
                />
                <TextField
                    label={pageData.answerInput}
                    className='input'
                    size='small'
                    variant='outlined' 
                    value={answerInput}
                    onChange={(e) => setAnswerInput(e.target.value)}
                />
                <Button
                    className='button'
                    size='small'
                    variant="contained"
                    type='submit'
                    disabled={(!questionInput || !answerInput) && true}
                >
                    {pageData.buttonText}
                </Button>
            </form>
        </div>
    </Container>
  )
}

export default Questions