import React, { useEffect, useRef } from 'react'
import BuyButton from '../Buy/BuyButton'
import { PRICES } from '../../config'

const BuyGame = ({clicked, setClicked, boughtGame, typeData, onStartGame, buyItem}) => {

  const menuRef = useRef(null)
  useEffect(() => {
    if (clicked) {
      let handler = (e) => {
        if (e.target.contains(menuRef.current)) {
          setClicked(false)
        }
      }
      
      document.addEventListener('mousedown', handler)

      return () => document.removeEventListener('mousedown', handler)
    }
  }, [clicked, setClicked, menuRef]) 


  if (!clicked) {
    return ''
  }

  let typeName = typeData.attributes.type
  
  return (
    <div className='buy-type-wrapper' id='buy-type' ref={menuRef}>
        <div className='content'>
            <h1>{typeName}</h1>

            {boughtGame ? (
                <div className='info'>
                    <span>Game bought successfully</span>
                    <button onClick={onStartGame}>START the game</button>
                </div>
            ) : (
                <div className='info'>
                    <BuyButton amount={PRICES.buy.gameType} buyItem={buyItem}/>
                </div>
            )}
        </div>
    </div>
  )
}

export default BuyGame