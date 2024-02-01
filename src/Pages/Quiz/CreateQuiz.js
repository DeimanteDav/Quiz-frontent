import React, { useContext, useEffect, useState } from 'react'
import Container from '../../components/Container'
import './CreateQuiz.scss'
import axios from 'axios'
import { FormControl, FormHelperText, InputAdornment, OutlinedInput, TextField } from '@mui/material'
import Select from 'react-select';
import FormButton from '../../components/FormButton'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'

const CreateQuiz = () => {
    const [title, setTitle] = useState('')
    const [passingPercentage, setPassingPercentage] = useState('')
    const [questionTypeOptions, setQuestionTypeOptions] = useState([])
    const [questionType, setQuestionType] = useState(null)
    const [questionOptions, setQuestionOptions] = useState([])
    const [questions, setQuestions] = useState(null)

    const [headers, setHeaders] = useState({})

    const ctx = useContext(BasicContext)
    const {userData} = ctx

    const createOption = (label, value) => ({
        label,
        value,
    });

    useEffect(() => {
        setHeaders({Authorization: `Bearer ${userData.jwt}`}) 

        axios.get(`${API_URL}/question-types`, {headers})
            .then(res => {
                let optionValues = res.data.data.map(type =>  createOption(type.attributes.type, type.id))
                optionValues.unshift({label: 'All', value: 'all'})

                setQuestionTypeOptions(optionValues)

            })
    }, [])

    useEffect(() => {
        if (questionType) {
            let params = questionType.value !== 'all' ? `?filters[questionType][id][$eq]=${questionType.value}` : ''

            axios.get(`${API_URL}/questions${params}`, {headers})
            .then(res => setQuestionOptions(res.data.data)) 
        }
    }, [questionType])


    const createQuizHandler = (e) => {
        e.preventDefault()

        axios.post(`${API_URL}/quizzes`, {
            data: {
                title,
                passingPercentage,
                questions: {
                    connect: questions.map(question => question.value)
                }
            }
        }, {headers})
            .then(res => {
                setTitle('')
                setPassingPercentage('')
                setQuestionType(null)
                setQuestions(null)
            })
    }


  return (
    <Container>
        <div className='create-quiz-wrapper'>
            <h1>Create a Quiz</h1>

            <form onSubmit={createQuizHandler} className='create-quiz-form'>
                <TextField
                    size='small'
                    label='title'
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />

                <FormControl variant="outlined" size='small' sx={{width: '18ch' }} > 
                    <OutlinedInput
                        id="passing-percentage"
                        endAdornment={<InputAdornment position="end">%</InputAdornment>}
                        type='number'
                        aria-describedby="percentage-helper-text"
                        inputProps={{
                            'aria-label': 'Passing Percentage *',
                        }}
                        value={passingPercentage}
                        onChange={(e) => setPassingPercentage(e.target.value)}
                    />
                    <FormHelperText required id="percentage-helper-text">Passing Percentage *</FormHelperText>
                </FormControl>
                    
                                
                <div className='questions-wrapper'>
                    <Select
                        options={questionTypeOptions}
                        value={questionType}
                        onChange={(e) => setQuestionType(e)}
                        placeholder='Question Type'
                    />

                    {questionType && (
                        <Select
                            isMulti
                            options={questionOptions.map(question => createOption(question.attributes.content, question.id))}
                            value={questions}
                            onChange={(e) => setQuestions(e)}
                            placeholder='Questions'
                        />
                    )}
                </div>
                
                <FormButton buttonText={'Save Quiz'} />

            </form>
            
        </div>
    </Container>
  )
}

export default CreateQuiz