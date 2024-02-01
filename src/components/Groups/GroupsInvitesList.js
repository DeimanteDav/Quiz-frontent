import { Button } from '@mui/material'
import React from 'react'

const GroupsInvitesList = ({invites, handler}) => {
    if (invites.length < 0) {
        return ''
    } 

  return (
    <ul className='invites-list'>
        {invites.map(invite => {
            return (
                <li key={invite.id}>
                    <span>{invite.attributes.title}</span>
                    <Button variant='contained' size='samll' onClick={() => handler(invite, 'accepted')}>Accept</Button>
                    <Button variant='contained' size='samll' onClick={() => handler(invite, 'declined')}>Decline</Button>
                </li>
            )
        })}
    </ul>
  )
}

export default GroupsInvitesList