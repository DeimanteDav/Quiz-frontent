import { List } from '@mui/material'
import React from 'react'
import GroupUserItem from './GroupUserItem'

const GroupUsersList = ({members, creatorId, status, buttonText, removeHandler}) => {
   

  return (
    <List sx={{maxWidth: '300px'}}>
      {members.map(member => {
        const memberData = member.attributes
        
        if (memberData.status !== status) {
            return ''
        }

        return (
          <GroupUserItem
            key={member.id}
            member={member}
            creatorId={creatorId}
            removeHandler={removeHandler}
            buttonText={buttonText}
          />
        ) 
      })}
    </List>
  )
}

export default GroupUsersList