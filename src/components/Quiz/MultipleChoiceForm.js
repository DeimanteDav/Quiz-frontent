import React, { useEffect, useState } from 'react'

// TODO: multiple choice ir response viena forma
const MultipleChoiceForm = ({onAnswer, enteredAnswer, currentQuestion, wrongAnswers, showHalf, readyQuestion}) => {
    const [allOtherChoices, setAllOtherChoices] = useState([])
    const [possibleAnswers, setPossibleAnswers] = useState([])
    const [correctAnswers, setCorretAnswers] = useState([])

    const [shuffledChoices, setShuffledChoices] = useState([])
    const [otherChoices, setOtherChoices] = useState([])

// TODO: keisti neteisingus atsakymus auksciau
// Perduoti cia
    // useEffect(() => {
    //     setAllOtherChoices(wrongAnswers)
    //     setCorretAnswers(currentQuestion.attributes.answers.data)
    // }, [currentQuestion, wrongAnswers, allOtherChoices])
    
    // useEffect(() => {
    //     if (allOtherChoices.length > 0) {
    //         let shuffled = allOtherChoices.sort(() => 0.5 - Math.random())
    //         setShuffledChoices(shuffled)
    //     }
    // }, [allOtherChoices, correctAnswers])


    // useEffect(() => {
    //     if (shuffledChoices.length > 0) {
    //         if (shuffledChoices.length > 3) {
    //             let other = shuffledChoices.slice(0, (4 - correctAnswers.length))
    //             setOtherChoices(other)
    //         } else {
    //             setOtherChoices(shuffledChoices)
    //         }
    //     }
    // }, [shuffledChoices, correctAnswers])


    // useEffect(() => {
    //   if (otherChoices.length > 0) {
    //     correctAnswers.forEach(answer => {
    //         let answers = [...otherChoices, answer]
    //         setPossibleAnswers(answers.sort(() => 0.5 - Math.random()))
    //     })
    //   }
    // }, [otherChoices, correctAnswers])


    // useEffect(() => {
    //     if (otherChoices.length > 0 && showHalf.includes(currentQuestion.id)) {
    //         setOtherChoices(prevState => {
    //             let newState = [...prevState]
    //             for (let i = 0; i < 2; i++) {
    //                 const randomIndex = Math.floor(Math.random()*newState.length)
    //                 newState[randomIndex] = {...newState[randomIndex], disabled: true}
    //                 console.log(newState[randomIndex]);
    //             }
    //             console.log(newState);
    //             return newState
    //         })
    //     }
    // }, [otherChoices.length, showHalf, currentQuestion])



console.log(readyQuestion);
    return (
    <div className='multiple-choice-buttons'>
        {correctAnswers.length > 1 ? (
            <span>Select more than one answer</span>
        ) : (
            <span>Select one answer</span>
        )}
         {readyQuestion.allAnswers.map((answer, i) => (
            <div key={answer.id} className={answer.disabled ? 'disabled' : ''}>
                {correctAnswers.length > 1 ? (
                    <input
                        type='checkbox'
                        value={answer.answer}
                        id={answer.id}
                        onChange={(e) => onAnswer(e.target.value, e.target.checked)}
                        // checked={enteredAnswer.includes()}
                        disabled={answer.disabled}
                    />
                ) : (
                    <input
                        type='radio'
                        name='multiple-choice'
                        value={answer.answer}
                        id={answer.id}
                        onChange={(e) => onAnswer(e.target.value, e.target.checked)}
                        checked={enteredAnswer[0] === answer.answer && true}
                        disabled={answer.disabled}
                    />
                )}
 
                <label htmlFor={answer.id}>{answer.answer}</label>
            </div> 
        ))}
    </div>
  )
}

export default MultipleChoiceForm

        