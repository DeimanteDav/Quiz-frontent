import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { API_URL, IMG_URL } from '../config'
import { BasicContext } from '../context/BasicContext'
import './Coins.scss'
import { Skeleton } from '@mui/material'

const Coins = ({displayTitle = false, loader = false, amount = false, justIcon = false}) => {
  const [title, setTitle] = useState(null)
  const [icon, setIcon] = useState(null)

  const {userData, userCoins} = useContext(BasicContext)

  useEffect(() => {
    if (userData?.jwt) {
      const headers = {
        Authorization: `Bearer ${userData.jwt}`
      }
  
      axios.get(`${API_URL}/coins-info?populate=*`, {headers})
        .then(res => {
          setTitle(res.data.data.attributes.title)
          setIcon(res.data.data.attributes.icon.data.attributes.url)
        })
    }
  }, [userData])

  if (!userData) {
    return ''
  }

  if (userCoins === null || !title || !icon) {
    if (loader) {
      return <Skeleton variant='text' sx={{ fontSize: '2rem' }} width={100}/>
    } else {
      return ''
    }
  }

  if (justIcon && amount) {
    return (
      <div className='coins-wrapper'>
        <span>{amount < 0 ? -amount : amount}</span>
        <img alt='coins-icon' src={`${IMG_URL}${icon}`}></img>
      </div>
    )
  }
 
  return (
    <div className='coins-wrapper'>
      {displayTitle && <span>{title}</span>}
      <span>{userCoins}</span>
      <img alt='coins-icon' src={`${IMG_URL}${icon}`}></img>
    </div>
  )
}

export default Coins