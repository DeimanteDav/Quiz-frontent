import React, { useEffect, useState } from 'react'
import Container from './Container'
import './Footer.scss'
import axios from 'axios'
import { Link } from 'react-router-dom'
import CustomLink from './CustomLink/CustomLink'
import { API_URL } from '../config'

const Footer = () => {
    const [data, setData] = useState(null)

    useEffect(() => {
        axios.get(`${API_URL}/footer?populate[links][populate]=*`)
            .then(res => setData(res.data.data.attributes))
    }, [])

    if (!data) {
        return ''
    }
 
  return (
    <div className='footer'>
        <Container>
            <div className='footer-content-wrapper'>
                <div className='info'>
                    <Link to={`/`}><span>{data.text1}</span></Link>
                    <Link to={`/`}><span>{data.text2}</span></Link>
                </div>

                <div className='icons'>
                    {data.links && data.links.map(link => (
                        <CustomLink key={link.id} link={link} />
                    ))}
                </div>
            </div>
        </Container>
        
    </div>
  )
}

export default Footer