import React from 'react'
import RegistrationForm from '../../components/Log-Register/RegistrationForm'
import { Link } from 'react-router-dom'
import './LogInRegister.scss'

const RegisterPage = () => {
  return (
    <div className='register-wrapper'>
      <RegistrationForm />
      <span>
        Already have an account? 
        <Link to={'/log-in'}>Log In</Link>
      </span>
    </div>
  )
}

export default RegisterPage