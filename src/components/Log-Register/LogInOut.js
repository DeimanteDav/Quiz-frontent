import React, { useContext, useEffect, useRef, useState } from 'react'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Divider, IconButton, List, ListItem } from '@mui/material'
import LogOutButton from './LogOutButton'
import LogInButton from './LogInButton'
import { BasicContext } from '../../context/BasicContext';
import getNavLinks from '../../services/getNavLinks';
import CustomLink from '../CustomLink/CustomLink';

const LogInOut = () => {
  const [userLinks, setUserLinks] = useState([])
 
  const ctx = useContext(BasicContext)
  const {isLoggedIn, setIsLoggedIn, userData} = ctx

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  let menuRef = useRef()

  useEffect(() => {
    if (isLoggedIn) {
      async function getNav() {
        setUserLinks(await getNavLinks('userLinks'))
      }
      getNav()
    } else {
      setUserLinks([])
    }
  }, [isLoggedIn])

  useEffect(() => {
    if (userLinks.length > 0) {
      // FIXME: pakeist
      let handler = (e) => {
        if (!menuRef.current.contains(e.target)) {
          setIsMenuOpen(false)
        }
      }
  
      document.addEventListener('mousedown', handler)

      return () => document.removeEventListener('mousedown', handler)
    }
  }, [userLinks]) 


  return (
    <div className={`nav-user ${!isLoggedIn && 'log-in-btn-wrapper'}`}>
      {(userLinks.length !== 0 && isLoggedIn) && (
        <>
          <div className='nav-user-info'>
            <span>Hello, {userData && userData.user.username}</span>
            <IconButton onClick={() => setIsMenuOpen(true)} size='large'>
              <AccountCircleIcon fontSize='inherit' />
            </IconButton>
          </div>

          <div ref={menuRef} className={`dropdown-menu ${isMenuOpen ? 'active' : 'inactive'}`} >
            <List>
              {userLinks.map(link => (
                <CustomLink key={link.id} click={() => setIsMenuOpen(false)} link={link} />
              ))}
            </List>
              <Divider />
              <List>
                <ListItem>
                  <LogOutButton setIsLoggedIn={setIsLoggedIn} />
                </ListItem>
              </List>
          </div>
        </>
      )}
      <LogInButton />
    </div>
  )
}

export default LogInOut