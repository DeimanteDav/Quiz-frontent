import React, { useContext, useEffect, useState } from 'react'
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { BasicContext } from '../../../context/BasicContext';
import axios from 'axios';
import { API_URL } from '../../../config';
import CategoryFilter from './CategoryFilter';
import DifficultyFilter from './DifficultyFilter';
import './QuizFilters.scss'
import QuestionsLengthFilter from './QuestionsLengthFilter';


const QuizFilters = ({byCategory, byDifficulty, byQuestionsAmount, filteredQuizzes}) => {
    const [categories, setCategories] = useState([])

    const [disabledCategories, setDisabledCategories] = useState([])

    const {selectedCategories, setSelectedCategories} = byCategory
    const {selectedDifficulty, setSelectedDifficulty} = byDifficulty
    const {questionsRange, setQuestionsRange, setRangeChanged} = byQuestionsAmount

    const {userData} = useContext(BasicContext)

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${userData.jwt}`
        }

        
        axios.get(`${API_URL}/categories`, {headers})
            .then(res => {
                setCategories(res.data.data)
            })        
    }, [userData])


    useEffect(() => {
        if (selectedCategories.length > 0) {
        filteredQuizzes.forEach(quiz => {
            let quizCategories = quiz.attributes.categories.data
                let quizCategoriesNew = new Set(quizCategories.map(quizCategory => quizCategory.id))
    
                let disabledC = categories.filter(category => {
                    return !quizCategoriesNew.has(category.id)
                })
                setDisabledCategories(disabledC)
            });
        } else {
            let disabledC = categories.filter(category => (
                filteredQuizzes.every(quiz => {
                    let quizCategories = quiz.attributes.categories.data
                    return quizCategories.every(quizCategory => (
                        quizCategory.id !== category.id
                    ))
                })
            ))
            setDisabledCategories(disabledC)
        }
    }, [filteredQuizzes, categories, selectedCategories])  


    const handleCategoryChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedCategories(prevState => {
                return [...prevState, Number(value)]
            });
        }
        else {
            setSelectedCategories(prevState => {
                let newState = [...prevState]
                return newState.filter((e) => e !== Number(value))
            });
        }
    }

    const deleteFilters = () => {
        setSelectedCategories([])
        setSelectedDifficulty(null)
        setRangeChanged(null)
    }

  return (
        <div className='quiz-filter-wrapper'>
            <h2>Filter</h2>
            <CategoryFilter
                categories={categories}
                selected={selectedCategories}
                handleChange={handleCategoryChange}
                disabled={disabledCategories}
            />
            <DifficultyFilter 
                selected={selectedDifficulty}
                setSelected={setSelectedDifficulty}
            />

            <QuestionsLengthFilter
                range={questionsRange}
                setRange={setQuestionsRange}
                setRangeChanged={setRangeChanged}
            />
           
            <div className='remove-filters' onClick={deleteFilters}>
                <HighlightOffIcon  />
                <span>Remove Filters</span>
            </div>
        </div>

  )
}

export default QuizFilters