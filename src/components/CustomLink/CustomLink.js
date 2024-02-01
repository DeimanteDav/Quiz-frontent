import React from 'react'
import { IMG_URL } from '../../config'
import { Link } from 'react-router-dom'
import { ListItem, ListItemIcon, ListItemText } from '@mui/material'
import './CustomLink.scss'

const CustomLink = ({link, click = false}) => {
  function linkWithContent(link) {
    if (link.target === '_blank') {
      return (
        <a arealabel={link.content} key={link.id} href={link.url} target={link.target}>
          {link.content}
        </a>
      )
    }
  
    return (
      <Link key={link.id} to={link.url}>
        {link.content}
      </Link>
    )
  }
  
  function linkWithImage(link) {
    if (link.target === '_blank') {
      return (
        <a arealabel={link.content} key={link.id} href={link.url} target={link.target}>
          <img className='custom-link-img' alt={link.image.data.attributes.alternativeText} src={`${IMG_URL}${link.image.data.attributes.formats.small.url}`} />
        </a>
      )
    }
  
    return (
      <Link key={link.id} to={link.url}>
        <img className='custom-link-img' alt={link.image.data.attributes.alternativeText} src={`${IMG_URL}${link.image.data.attributes.formats.small.url}`} />
      </Link>
    )
  }
  
  function linkwithImageContent(link) {
    if (link.target === '_blank') {
      return (
        <a arealabel={link.content} key={link.id} href={link.url} target={link.target}>
          <img className='custom-link-img' alt={link.image.data.attributes.alternativeText} src={`${IMG_URL}${link.image.data.attributes.formats.small.url}`} />
          {link.content}
        </a>
      )
    }

    return (
      <ListItem>
        <ListItemIcon>
          <img className='custom-link-img' alt={link.image.data.attributes.alternativeText} src={`${IMG_URL}${link.image.data.attributes.formats.small.url}`} />
        </ListItemIcon>
        <Link to={link.url} onClick={click && click}>
          <ListItemText primary={link.content} />
        </Link>
      </ListItem>
    )
  }

  if (link.content && link.image.data) {
    return linkwithImageContent(link)
  }

  if (link.content) {
    return linkWithContent(link)
  }

  if (link.image.data) {
    return linkWithImage(link)
  }
}

export default CustomLink

