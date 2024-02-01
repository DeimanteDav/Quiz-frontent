import { Card, CardContent, CardHeader, Typography } from '@mui/material'
import React from 'react'
import { getFullDate } from '../../services/dateFunctions'
import { Link } from 'react-router-dom'

const GroupActivityItem = ({ activity }) => {
  const userData = activity.attributes.user.data
  const username = userData.attributes.username
  const userId = userData.id

  let outputText = ''
  switch (activity.attributes.type) {
    case 'group created':
      outputText = (
        <>
          <Link to={`/users/${userId}`}>{username}</Link> created a group
        </>
      )
      break
    case 'new user':
      outputText = (
        <>
          <Link to={`/users/${userId}`}>{username}</Link> is a new member
        </>
      )
      break
    case 'declined invitation':
      outputText = (
        <>
          <Link to={`/users/${userId}`}>{username}</Link> declined group invitation
        </>
      )
      break
    case 'user left':
      outputText = (
        <>
          <Link to={`/users/${userId}`}>{username}</Link> left the group
        </>
      )
      break
    case 'user removed':
      outputText = (
        <>
          <Link to={`/users/${userId}`}>{username}</Link> was removed
        </>
      )
      break

    default:
      break
  }


  return (
    <Card key={activity.id}>
      <CardHeader title={outputText} />
      <CardContent>
        <Typography variant="body2">
          {getFullDate(activity.attributes.createdAt)}
        </Typography>
      </CardContent>
    </Card>
  )
}

export default GroupActivityItem