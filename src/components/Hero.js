import React from 'react'
import { Link } from 'react-router-dom'

const Hero = ({header, subheader, link}) => {
  return (
    <div className='hero'>
        <h1>{header}</h1>
        <p>{subheader}</p>

        <Link to={link.url} target={link.target}>
          <button>{link.content}</button>
        </Link>
    </div>
  )
}

export default Hero