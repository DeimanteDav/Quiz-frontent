import React from 'react'
import LogInForm from '../../components/Log-Register/LogInForm'
import { Link } from 'react-router-dom'
import './LogInRegister.scss'

const LogIn = () => {
  return (
    <div className='log-in-wrapper'>
      <LogInForm />
      <span>
        Don't have an account? 
        <Link to={'/register'}>Register</Link>
      </span>
    </div>
  )
}

export default LogIn