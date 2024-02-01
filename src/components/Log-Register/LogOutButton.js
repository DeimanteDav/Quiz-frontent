import React from 'react'
import { useNavigate } from 'react-router-dom'
import LogoutIcon from '@mui/icons-material/Logout';
import './LogButtons.scss'

const LogOutButton = ({setIsLoggedIn = false}) => {
  let navigate = useNavigate()

  const logOutHandler = () => {
    localStorage.setItem('is-logged-in', JSON.stringify(false))
    localStorage.removeItem('qp-jwt')
    localStorage.setItem('user-id', JSON.stringify(null))
    localStorage.removeItem('user-data')
    // navigate('/')
    {setIsLoggedIn ? setIsLoggedIn(false) : window.location.reload()}
  }

  return (
    <div className='log-button' onClick={logOutHandler}>
      <LogoutIcon />
      <span>Log Out</span>
    </div>
  )
}

export default LogOutButton