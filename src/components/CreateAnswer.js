import { TextField } from '@mui/material'
import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import CreatableSelect from 'react-select/creatable';
import { API_URL } from '../config';
import { BasicContext } from '../context/BasicContext';


const CreateAnswer = () => {
    const [answerTypeOptions, setAnswerTypeOptions] = useState([])
    const [answerType, setAnswerType] = useState(null)
    const [answerOptions, setAnswerOptions] = useState([])
    const [answers, setAnswers] = useState(null)
    
    const ctx = useContext(BasicContext)
    const {userData} = ctx

    useEffect(() => {
        axios.get(`${API_URL}/answer-types`, {
            headers: {
                Authorization: `Bearer ${userData.jwt}`
            }
        })
            .then(res => setAnswerTypeOptions(res.data.data))
    }, [])

    useEffect(() => {
        if (answerType) {
            axios.get(`${API_URL}/answers?filters[answerType][id][$eq]=${answerType.value}`, {
                headers: {
                    Authorization: `Bearer ${userData.jwt}`
                }
            })
                .then(res => {
                    setAnswerOptions(res.data.data)
                })
        } 
    }, [answerType, userData])

    const createOption = (label, value) => ({
        label,
        value,
    });

    const createAnswer = () => {
        answers.map(answer => {
            if (answer['__isNew__']) {
                axios.post(`${API_URL}/answers`, {
                    data: {
                        name: answer.label,
                        answerType: {
                            connect: [answerType.value]
                        }
                    }
                }, {
                    headers: {
                        Authorization: `Bearer ${userData.jwt}`
                    }
                })
                    .then(res => {
                        if (res.status === 200) {
                            setAnswerType(null)
                            setAnswers(null)
                        }
                    })
                    .catch(error => console.log(error))
            }
        })
    }

    const createAnswerHandler = (e) => {
        e.preventDefault()

        if (answerType['__isNew__'] === true) {
            axios.post(`${API_URL}/answer-types`, {
                data: {
                    type: answerType.label
                }
            }, {
                headers: {
                    Authorization: `Bearer ${userData.jwt}`
                }
            })
                .then(res => {
                   setAnswerType(prevState => ({...prevState, value: res.data.data.id})) 
                   createAnswer()
                })
        } else {
            createAnswer()
        }

    }


    return (
      <div>
          <h1>Create an Answer</h1>
  
          <form onSubmit={createAnswerHandler}>
                <CreatableSelect
                    isClearable
                    options={answerTypeOptions.map(answerType => createOption(answerType.attributes.type, answerType.id))}
                    placeholder='Answer Type'
                    onChange={(e) => setAnswerType(e)}
                    value={answerType}
                />
                {answerType && (
                    <CreatableSelect
                        isMulti
                        options={answerOptions.map(answer => createOption(answer.attributes.name, answer.id))}
                        placeholder='Answer'
                        value={answers}
                        onChange={(e) => setAnswers(e)}
                    />
                )}
                <button type='submit'> submit</button>
          </form>
      </div>
    )
}

export default CreateAnswer