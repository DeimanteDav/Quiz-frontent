import React from 'react'
import Container from '../../components/Container';
import './HomePage.scss'
import DynamicZones from '../../components/DynamicZones';


const HomePage = () => {
  return (
    <Container>
        <div className='home-page'>
          <DynamicZones />
        </div>
    </Container>
  )
}

export default HomePage