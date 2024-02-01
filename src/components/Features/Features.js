import React from 'react'
import Hints from './Hints'
import FiftyFifty from './FiftyFifty'

const Features = ({hints, fiftyFifty, currentQuestion}) => {
    const {showHint, setShowHint} = hints
    const {showHalf, setShowHalf, questionType} = fiftyFifty

  return (
    <div>
      <FiftyFifty
        showHalf={showHalf}
        setShowHalf={setShowHalf}
        currentQuestion={currentQuestion}
        questionType={questionType}
      />
      

      <Hints
        showHint={showHint}
        setShowHint={setShowHint}
        currentQuestion={currentQuestion}
      />
    </div>

  )
}

export default Features