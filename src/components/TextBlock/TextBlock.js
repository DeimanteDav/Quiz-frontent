import React from 'react'
import './TextBlock.scss'

const TextBlock = ({title, text, unit}) => {
  const unitText = unit ? unit : ''

  return (
    <div className='text-block'>
      <span className='title'>{title}</span>
      <span className='text'>{text + unitText}</span>
    </div>
  )
}

export default TextBlock 