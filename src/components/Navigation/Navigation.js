import React, { useEffect, useState } from 'react'
import './Navigation.scss'
import Container from '../Container'
import getNavLinks from '../../services/getNavLinks'
import MobileNavigation from './MobileNavigation'
import DesktopNavigation from './DesktopNavigation'


const Navigation = () => {
  const [navLinks, setNavLinks] = useState([])
  const [userLinks, setUserLinks] = useState([])
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    async function getNav() {
      setNavLinks(await getNavLinks('navigationLinks'))
      setUserLinks(await getNavLinks('userLinks'))
    }
    getNav()
  }, [])


  const menuHandler = () => {
    setMenuOpen(prevState => !prevState)
  }

  return (
    <nav className='navigation'>
      <Container>
        <DesktopNavigation 
          navLinks={navLinks}
          handler={menuHandler}
        />

        <MobileNavigation
          handler={menuHandler}
          open={menuOpen}
          navLinks={navLinks}
          userLinks={userLinks}
        />
      </Container>
    </nav>
  )
}

export default Navigation