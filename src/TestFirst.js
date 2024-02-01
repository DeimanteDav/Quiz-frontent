import React, { useState } from 'react'

const TestFirst = () => {
  const [changed, setChanged] = useState(false)

  const changeText = () => {
    setChanged(true)
  }

  return (
    <div>
      {/* <h2>{changed ? 'changed' : 'Hello world!'}</h2> */}
      {changed && <h2>changed</h2>}
      {!changed && <h2>Hello world</h2>}
      <button onClick={changeText}>Change text</button>
    </div>
  )
}

export default TestFirst