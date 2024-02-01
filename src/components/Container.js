import React from 'react'

const Container = (props) => {
    if (!props.children) {
        return
    }
    
  return (
    <div className='container'>{props.children}</div>
  )
}

export default Container