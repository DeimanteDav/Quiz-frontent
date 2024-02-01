import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL, USER_ROLES } from '../../../config'
import axios from 'axios'
import { BasicContext } from '../../../context/BasicContext'
import QuizItem from '../QuizItem/QuizItem'
import './QuizzesList.scss'
import { Skeleton } from '@mui/material'

const QuizzesList = ({quizzes, isLoading}) => {
    const [role, setRole] = useState(null)
    const {userData} = useContext(BasicContext)

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${userData.jwt}`
        }
        axios.get(`${API_URL}/users/me?populate=role`, {headers})
            .then(res => {
                setRole(res.data.role.id)
            })
    }, [userData])
    
  return (
    <div className='quizzes-list-wrapper'>
        <h1>Quizzes</h1>
        <div className='quizzes-list'>
            {isLoading ? (
                Array.from({length: 5}, (_, i) => <Skeleton key={i} variant='rectangular' height={100} width={150} />)
            ) : (
                <QuizItem quizzes={quizzes} />
            )}
        </div>

        {role === USER_ROLES.creator && (
            <Link to='/create-quiz'>Create quiz</Link>
        )}
    </div>
  )
}

export default QuizzesList