import React, { useContext, useState } from 'react'
import Coins from '../Coins'
import { BasicContext } from '../../context/BasicContext'
import axios from 'axios'
import { API_URL } from '../../config'
import getCoins from '../../services/getCoins'

const BuyButton = ({amount, buyItem}) => {
  const [error, setError] = useState(null)
  const {userData, setUserCoins} = useContext(BasicContext)
  const {jwt, user} = userData

  const buyHandler = async () => {
    setError(null)

    let coinsData = await getCoins()
    let {total} = coinsData.attributes
    
    if (total >= amount) {
        const headers = {Authorization: `Bearer ${jwt}`}
        const coinsLeft = total - amount
        
        axios.put(`${API_URL}/coins/${coinsData.id}`, {
            data: {
                total: coinsLeft,
                user: {
                    connect: [user.id]
                }
            }
        }, {headers})
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setUserCoins(coinsLeft)

                    buyItem()
                }
            })
            .catch(err => console.log(err))
    } else {
        setError(true)
    }
  }

    
  return (
    <>
        <button className='buy-btn' onClick={buyHandler}>
            <Coins amount={amount} justIcon/>
        </button> 
        {error && <span>Not enough money</span>}
    </>

  )
}

export default BuyButton