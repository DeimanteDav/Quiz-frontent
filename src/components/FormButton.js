import React from 'react'
import './FormButton.scss'

const FormButton = ({buttonText}) => {
  return (
    <button type='submit' className='submit-form-button'>{buttonText}</button>
  )
}

export default FormButton