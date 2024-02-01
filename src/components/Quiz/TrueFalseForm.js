import React from 'react'

const TrueFalseForm = ({ onAnswer, enteredAnswer }) => {
    return (
        <div className='true-false-buttons'>
            <div className='true-input-wrapper'>
                <input type='radio' name='true-false' value='Tiesa' id='input-true' onChange={(e) => onAnswer(e.target.value)} checked={enteredAnswer === 'Tiesa'} />
                <label htmlFor='input-true'>Tiesa</label>
            </div>

            <div className='false-input-wrapper'>
                <input type='radio' name='true-false' value='Netiesa' id='input-false' onChange={(e) => onAnswer(e.target.value)} checked={enteredAnswer === 'Netiesa'} />
                <label htmlFor='input-false'>Netiesa</label>
            </div>
        </div>
    )
}

export default TrueFalseForm