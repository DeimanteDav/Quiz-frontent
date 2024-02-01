import React from 'react'
import Container from '../components/Container'
import { Link } from 'react-router-dom'

const PageNotFound = () => {
  return (
    <Container>
        <div>PageNotFound</div>
        <Link to={'/'}>Home Page</Link>
    </Container>
  )
}

export default PageNotFound