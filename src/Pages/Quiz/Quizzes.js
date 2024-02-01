import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { Container } from '@mui/material'
import { API_URL, DEFAULT_NUM_OF_QUESTIONS } from '../../config'
import './Quizzes.scss'
import QuizzesList from '../../components/Quiz/QuizzesList/QuizzesList'
import QuizFilters from '../../components/Quiz/Filters/QuizFilters'
import { BasicContext } from '../../context/BasicContext'
import { Link } from 'react-router-dom'


const Quizzes = () => {
    const [quizzes, setQuizzes] = useState([])
    const [filteredQuizzes, setFilteredQuizzes] = useState([])
    const [finalQuizzes, setFinalQuizzes] = useState([])

    const [selectedCategories, setSelectedCategories] = useState([])
    const [selectedDifficulty, setSelectedDifficulty] = useState(null)
    const [questionsRange, setQuestionsRange] = useState([2, 20])
    const [rangeChanged, setRangeChanged] = useState(false)

    const [questionsAmounts, setQuestionsAmounts]= useState([])

    const [isLoading, setIsloading] = useState(false)
    const {userData} = useContext(BasicContext)

 
 
    useEffect(() => {
        setIsloading(true)
        axios.get(`${API_URL}/quizzes?populate=*`)
            .then(res => {
                setQuizzes(res.data.data)
                setIsloading(false)
            })
    }, [])

    useEffect(() => {
        if (quizzes.length > 0) {
            let filteredByCategory = filterByCategory(quizzes, selectedCategories)
            let filteredByDifficulty = filterByDifficulty(quizzes, selectedDifficulty)
            

            let matchedFilteredQuizzes = filteredByCategory.filter(quiz => (
                filteredByDifficulty.some(quiz2 => quiz.id === quiz2.id)
            ))
            setFilteredQuizzes(matchedFilteredQuizzes)
            setFinalQuizzes(matchedFilteredQuizzes)
        }

    }, [quizzes, selectedCategories, selectedDifficulty])


    useEffect(() => {
        let filteredByQuestions = filterByQuestions(quizzes, questionsRange)
        let matchedFilteredQuizzes = filteredQuizzes.filter(quiz => (
            filteredByQuestions.some(quiz2 => quiz.id === quiz2.id)
        ))
        setFinalQuizzes(matchedFilteredQuizzes)

    }, [rangeChanged])


    useEffect(() => {
        if (finalQuizzes.length > 0) {
            let amounts = finalQuizzes.map(quiz => quiz.attributes.questionsAmount ? quiz.attributes.questionsAmount : DEFAULT_NUM_OF_QUESTIONS)
            setQuestionsAmounts(amounts)
        }

        if (selectedCategories.length === 0 && !selectedDifficulty && rangeChanged === null) {
            setFinalQuizzes(quizzes)
        }
    }, [selectedCategories, selectedDifficulty, finalQuizzes.length, rangeChanged])

    useEffect(() => {
        if (questionsAmounts.length > 0) {
            let min = Math.min(...questionsAmounts)
            let max = Math.max(...questionsAmounts)
            setQuestionsRange([min, max])
        } 
    }, [questionsAmounts])



    if (quizzes.length === 0) {
        return ''
    }
    if (!userData) {
        return (
            <Container>
                <span>You need to register</span>
                <Link to={`/register`}>Register</Link>
            </Container>
        )
    }
    
  return (
    <Container>
        <div className='quizzes-wrapper'>
            <QuizFilters
                byCategory={{selectedCategories, setSelectedCategories}}
                byDifficulty={{selectedDifficulty, setSelectedDifficulty}}
                byQuestionsAmount={{questionsRange, setQuestionsRange, setRangeChanged}}
                filteredQuizzes={finalQuizzes}
            />
            <QuizzesList quizzes={finalQuizzes} isLoading={isLoading} />
        </div>
    </Container>
  )
}

export default Quizzes

const filterByCategory = (quizzes, selectedCategories) => {
    let filteredQuizzes = quizzes.filter(quizData => {
        let quiz = quizData.attributes
        let quizCategories = quiz.categories.data

        return selectedCategories.every(selected => (
            quizCategories.some(category => selected === category.id)
        ))
    })

    return filteredQuizzes
}

const filterByDifficulty = (quizzes, selectedDifficulty) => {
    if (!selectedDifficulty) {
        return quizzes
    }
    let filteredQuizzes = quizzes.filter(quizData => {
        let quiz = quizData.attributes
        let quizDifficulty = quiz.difficulty.data

        if (!quizDifficulty) {
            return false
        }

        return quizDifficulty.id === selectedDifficulty
    })

    return filteredQuizzes
}

const filterByQuestions = (quizzes, questionsRange) => {
    let filteredQuizzes = quizzes.filter(quizData => {
        let quiz = quizData.attributes
        let quizQuestionsAmount = quiz.attributes?.questionsAmount ? quiz.attributes.questionsAmount : DEFAULT_NUM_OF_QUESTIONS

        if (quizQuestionsAmount < questionsRange[0] || quizQuestionsAmount > questionsRange[1]) {
            return false
        }
        return quiz
    })

    return filteredQuizzes
}