import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Container from '../components/Container';
import { API_URL } from '../config';
import { BasicContext } from '../context/BasicContext';

const Question = () => {
  let {questionId} = useParams()
  const [question, setQuestion] = useState(null)

  const ctx = useContext(BasicContext)
  const {userData} = ctx

  useEffect(() => {
    axios.get(`${API_URL}/questions/${questionId}?fields=content`, {
      headers: {
        Authorization: `Bearer ${userData.jwt}`
      }
    })
      .then(res => setQuestion(res.data.data))
  }, [])


  return (
    <Container>
        <div>{question && question.attributes.content}</div>
    </Container>
  )
}

export default Question