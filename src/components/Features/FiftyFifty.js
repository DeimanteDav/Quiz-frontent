import React, { useContext, useEffect, useState } from 'react'
import getFiftyFiftyAmount from '../../services/getFiftyFiftyAmount'
import { BasicContext } from '../../context/BasicContext'
import axios from 'axios'
import { API_URL, QUESTION_TYPES } from '../../config'

const FiftyFifty = ({showHalf, setShowHalf, currentQuestion, questionType}) => {
    const [amount, setAmount] = useState(null)
    const [id, setId] = useState(null)

    const {userData} = useContext(BasicContext)
    const {jwt} = userData
  
    useEffect(() => {
      async function getAmount() {
        const data = await getFiftyFiftyAmount()
        setAmount(data.amount)
        setId(data.id)
      }
      getAmount()
    }, [])


    const handleClick = () => {
      const headers = {Authorization: `Bearer ${jwt}`}
      axios.put(`${API_URL}/power-ups/${id}?populate=*`, {
        data: {
          fiftyFifty: {
            amount: amount - 1,
          }
        }
      }, {headers})
        .then(res => {
          console.log(res);
          if (res.statusText === 'OK') {
            setShowHalf(prevState => [...prevState, currentQuestion.id])
            setAmount(prevState => prevState - 1)
          }
        })
        .catch(err => console.log(err))
    }

    // TODO: dinamiskiau padaryti
  if (questionType !== QUESTION_TYPES.multipleChoice.title || currentQuestion.attributes.answers.data.length > 1) {
    return 
  }

  return (
    <div className='fiftyFifty'>
      <button
        disabled={amount === 0 || showHalf.includes(currentQuestion.id)}
        onClick={handleClick}
      >50/50</button>
      <span>{amount}</span>
    </div>
  )
}

export default FiftyFifty