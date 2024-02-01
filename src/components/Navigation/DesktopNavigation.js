import React from 'react'
import Logo from '../Logo'
import { NavLink } from 'react-router-dom'
import Coins from '../Coins'
import LogInOut from '../Log-Register/LogInOut'
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';

const DesktopNavigation = ({navLinks, handler}) => {
  return (
    <div className='nav-content-wrapper'>
        <Logo />
          <div className='navigation-middle'>
          {navLinks.map(item => (
            <NavLink key={item.id} to={item.url} target={item.target} className={item.content}>
              <span>{item.content}</span>
            </NavLink>
          ))}
        </div>
        <Coins />
        <LogInOut />

        <IconButton className='menu-button' onClick={handler}>
            <MenuIcon />
        </IconButton>
    </div>
  )
}

export default DesktopNavigation