import React, { useEffect, useState } from 'react'
import './Timer.scss'

const Timer = ({num}) => {
    const [minutes, setMinutes] = useState(Math.floor(num/60))
    const [seconds, setSeconds] = useState(num - minutes * 60)

    useEffect(() => {
        setMinutes(Math.floor(num/60))
        setSeconds((num - minutes * 60) === -1 ? 59 : num - minutes*60)
    }, [num, minutes])
   

  return (
    <div className='timer-wrapper'>

        <span className={`timer ${num < 21 && 'warning-1'} ${num < 11 && 'warning-2'}`}>{`${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`}</span>
    </div>
  )
}

export default Timer