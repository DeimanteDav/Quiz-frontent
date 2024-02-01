import { TextField } from '@mui/material'
import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import './CreateQuestion.scss'
import FormButton from './FormButton'
import CreatableSelect from 'react-select/creatable';
import Select from 'react-select';
import { API_URL } from '../config'
import getCategories from '../services/getCategories'
import getQuestionTypes from '../services/getQuestionTypes'
import { BasicContext } from '../context/BasicContext'

const CreateQuestion = () => {
  const [categoryOptions, setCategoryOptions] = useState([])
  const [category, setCategory] = useState(null)
  const [questionTypeOptions, setQuestionTypeOptions] = useState([])
  const [questionType, setQuestionType] = useState(null)
  const [question, setQuestion] = useState('')
  const [hint, setHint] = useState('')
  
  const [headers, setHeaders] = useState({})

  const ctx = useContext(BasicContext)
  const {userData} = ctx

  useEffect(() => {
    async function getData() {
      setCategoryOptions(await getCategories())
      setQuestionTypeOptions(await getQuestionTypes())
    }
    getData()

    setHeaders({Authorization: `Bearer ${userData.jwt}`})    
  }, [userData])
  
  const createOption = (label, value) => ({
    label,
    value,
  });

  const createQuestionHandler = (e) => {
    e.preventDefault()
    axios.post(`${API_URL}/questions`, {
      data: {
        content: question,
        hint
      }
    }, {headers})
      .then(res => {
        setQuestion('')
        categoryHandler(res.data.data.id)
        questionTypeHandler(res.data.data.id)
      })
      .catch(err => console.log(err))
  }

  
  const categoryHandler = (questionId) => {
    if (category['__isNew__'] === true) {
      axios.post(`${API_URL}/categories`, {
        data: {
          name: category.label,
          questions: {
            connect: [questionId]
          }
        }
      }, {headers})
        .then(res =>  setCategory(null))
        .catch(err => console.log(err))
    } else {
      axios.put(`${API_URL}/categories/${category.value}`, {
        data: {
          questions: {
            connect: [questionId]
          }
        }
      }, {headers})
        .then(res => setCategory(null))
        .catch(err => console.log(err))
    }
  }

  const questionTypeHandler = (questionId) => {
    if (questionType['__isNew__'] === true) {
      axios.post(`${API_URL}/question-types`, {
        data: {
          type: questionType.label,
          questions: {
            connect: [questionId]
          }
        }
      }, {headers})
        .then(res =>  setQuestionType(null))
        .catch(err => console.log(err))
    } else {
      axios.put(`${API_URL}/question-types/${questionType.value}`, {
        data: {
          questions: {
            connect: [questionId]
          }
        }
      }, {headers})
        .then(res => setQuestionType(null))
        .catch(err => console.log(err))
    }
  }

  return (
    <div className='create-question-wrapper'>
      <h1>Create a Question</h1>

      <form className='create-question-form' onSubmit={createQuestionHandler}>
        <CreatableSelect
          isClearable
          options={categoryOptions.map(category => createOption(category.attributes.name, category.id))}
          placeholder='Category'
          onChange={(e) => setCategory(e)}
          value={category}
        />
        <Select
          // isClearable
          options={questionTypeOptions.map(quesitonType => createOption(quesitonType.attributes.type, quesitonType.id))}
          placeholder='Question Type'
          onChange={(e) => setQuestionType(e)}
          value={questionType}
        />
        <TextField
          size='small'
          label='Type in your Question'
          onChange={(e) => setQuestion(e.target.value)}
          value={question}
        />
        <TextField
          size='small'
          label='Hint'
          onChange={(e) => setHint(e.target.value)}
          value={hint}
        />


        <FormButton buttonText='Save Question' />
      </form>
    </div>
  )
}

export default CreateQuestion