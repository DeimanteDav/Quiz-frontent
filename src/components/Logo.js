import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { API_URL, IMG_URL } from '../config'

const Logo = () => {
  const [logo, setLogo] = useState(null)
  const [title, setTitle] = useState(null)

  useEffect(() => {
    axios.get(`${API_URL}/page-setting?populate=*`)
      .then(res => {
        setLogo(res.data.data.attributes.logo.data.attributes.url)
        setTitle(res.data.data.attributes.pageTitle)
      })
  }, [])

  
  if (!logo && !title) {
    return ''
  }
 
  return (
    <div className='logo-wrapper'>
      <Link to={`/`}>
        {logo ? (
          <img alt='logo' src={`${IMG_URL}${logo}`}></img>
        ) : (
          <span>{title}</span>
        )}
      </Link>
    </div>
  )
}

export default Logo