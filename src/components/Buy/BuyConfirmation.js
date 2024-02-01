import React from 'react'
import './BuyConfirmation.scss'
import BuyButton from './BuyButton'
import Coins from '../Coins'

const BuyConfirmation = ({clicked, handleClick, text, textConfirmation, amount, buyHandler}) => {
  return (
    <div>
        <div>
          {text && <span>{text}</span>}
          <button onClick={handleClick}>
            <Coins amount={amount} justIcon />
          </button>
        </div>
        {clicked && (
          <div className='confirmation'>
            <div className='content'>
              <div className='top'>
                <h2>Confirm</h2>
                <button onClick={handleClick}>x</button>
              </div>
              <span>{textConfirmation}</span>
  
              <BuyButton amount={amount} buyItem={buyHandler}/>
            </div>
          </div>
        )}
    </div>
  )
}

export default BuyConfirmation