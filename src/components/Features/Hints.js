import React, { useContext, useEffect, useState } from 'react'
import { API_URL } from '../../config'
import getHintsAmount from '../../services/getHintsAmount'
import { BasicContext } from '../../context/BasicContext'
import axios from 'axios'

const Hints = ({showHint, setShowHint, currentQuestion}) => {
  const [amount, setAmount] = useState(null)
  const [id, setId] = useState(null)

  const {userData} = useContext(BasicContext)
  const {jwt} = userData

  useEffect(() => {
    async function getAmount() {
      const data = await getHintsAmount()
      setAmount(data.amount)
      setId(data.id)
    }
    getAmount()
  }, [])

  const handleClick = () => {
    const headers = {Authorization: `Bearer ${jwt}`}

    axios.put(`${API_URL}/power-ups/${id}?populate=*`, {
      data: {
        hints: {
          amount: amount - 1,
        }
      }
    }, {headers})
      .then(res => {
        console.log(res);
        if (res.statusText === 'OK') {
          setShowHint(prevState => [...prevState, currentQuestion.id])
          setAmount(prevState => prevState - 1)
        }
      })
      .catch(err => console.log(err))
  }
  return (
    <div>
      {!showHint.includes(currentQuestion.id) && currentQuestion.attributes.hint ? (
        <div className='hints'>
          <button
            disabled={amount === 0}
            onClick={handleClick}
          >Hint</button>
          <span>{amount}</span>
        </div>
      ) : (
        <span>{currentQuestion.attributes.hint}</span>
      )}
    </div>
  )
}

export default Hints