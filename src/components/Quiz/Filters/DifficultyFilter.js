import React, { useState } from 'react'
import { DIFFICULTIES } from '../../../config'

const DifficultyFilter = ({selected, setSelected}) => {
    const [hover, setHover] = useState(null);

  return (
    <fieldset className='filter'>
        <legend className='title'>Difficulty</legend>
        {DIFFICULTIES.map((difficulty) => (
            <>
                <input
                    type="radio"
                    name="rating"
                    className='radio-input'
                    value={difficulty.level}
                    onChange={() => {
                        console.log(difficulty.level);
                        setSelected(difficulty.level)
                    }}
                    id={`star-input-${difficulty.level}`}
                    checked={selected === difficulty.id}
                />
                <label key={difficulty.level} htmlFor={`star-input-${difficulty.level}`}>
                    <span
                        className={`star ${ difficulty.level <= (hover || selected) ? 'active' : ''}`}
                        onMouseEnter={() => setHover(difficulty.level)}
                        onMouseLeave={() => setHover(null)}
                    >
                        &#9733;
                    </span>
                </label>
            </>
        ))}
    </fieldset>
  )
}

export default DifficultyFilter