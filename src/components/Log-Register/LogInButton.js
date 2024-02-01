import React, { useContext } from 'react'
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import './LogButtons.scss'
import { BasicContext } from '../../context/BasicContext';

const LogInButton = () => {
  const navigate = useNavigate()

  const {isLoggedIn} = useContext(BasicContext)

  if (isLoggedIn) {
    return ''
  }

  return (
    <div className='log-button' onClick={() => navigate('/log-in')}>
      <LoginIcon />
      <span>Log In</span>
    </div>
  )
}

export default LogInButton