import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './QuestionTypes.scss'
import Container from '../components/Container';
import { API_URL } from '../config';

const QuestionTypes = () => {
    const [types, setTypes] = useState([])
    const [text, setText] = useState('')

    useEffect(() => {
        axios.get(`${API_URL}/question-types?fields=type`)
            .then(res => setTypes(res.data.data))

        axios.get(`${API_URL}/question-types-page?fields=text`)
            .then(res => setText(res.data.data.attributes.text))  
    }, [])


  return (
    <Container>
        <div className='question-types'>
            <h1>{text}</h1>
            <ul>
                {types.map(type => (
                    <li style={{marginBottom: '10px'}} key={type.id}><Link to={`/question-types/${type.id}`}>{type.attributes.type}</Link></li>
                ))}
            </ul>
        </div>
    </Container>
  )
}

export default QuestionTypes