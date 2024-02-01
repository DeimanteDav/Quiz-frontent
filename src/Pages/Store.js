import { Container } from '@mui/material'
import React, { useContext, useEffect, useState } from 'react'
import getHintsAmount from '../services/getHintsAmount'
import axios from 'axios'
import { API_URL, PRICES } from '../config'
import { BasicContext } from '../context/BasicContext'
import './Store.scss'
import BuyConfirmation from '../components/Buy/BuyConfirmation'

const Store = () => {
  const [hints, setHints] = useState(null) 
  const [clickedBuy, setClickedBuy] = useState(false)
  const [clickedSell, setClickedSell] = useState(false)
  const ctx = useContext(BasicContext)
  const {userData} = ctx
  const {jwt, user} = userData

  useEffect(() => {
    async function getHints() {
      setHints(await getHintsAmount())
    }
    getHints()
  }, [])
 

  if (!hints) {
    return ''
  }

  const handleClickBuy = () => {
    setClickedBuy(prevState => !prevState)
  }
  const handleClickSell = () => {
    setClickedSell(prevState => !prevState)
  }

  const buyHintHandler = () => {
    const headers = {Authorization: `Bearer ${jwt}`}
    const newHintsAmount = hints.amount + (clickedBuy ? 1 : -1)
    axios.put(`${API_URL}/power-ups/${hints.id}`, {
      data: {
        hints: {
          amount: newHintsAmount
        },
        user: {
          connect: [user.id]
        }
      }
    }, {headers})
      .then(res => {
        console.log(res);
        if (res.status === 200) {
          setHints(prevState => {
            let newState = {...prevState}
            return {id: newState.id, amount: newHintsAmount}
          })
          setClickedBuy(false)
          setClickedSell(false)
        }
      })
      .catch(err => console.log(err))
  }


  return (
    <Container>
      <h1>Store</h1>

      <div className='hints-wrapper'>
        <h2>Hints</h2>
        <span>You have {hints.amount} Hints</span>

        <BuyConfirmation 
          clicked={clickedBuy}
          handleClick={handleClickBuy}
          text={'Buy'}
          textConfirmation={'Buy Hint'}
          amount={PRICES.buy.hint}
          buyHandler={buyHintHandler}
        />
        <BuyConfirmation 
          clicked={clickedSell}
          handleClick={handleClickSell}
          text={'Sell'}
          textConfirmation={'Sell Hint'}
          amount={-PRICES.sell.hint}
          buyHandler={buyHintHandler}
        />
      </div>

      <div>
        <h2>50/50</h2>

      </div>
    </Container>
  )
}

export default Store