import { Button, ListItem } from '@mui/material'
import React, { useContext } from 'react'
import { BasicContext } from '../../context/BasicContext'
import checkIfCreator from '../../services/groups/checkIfCreator'
import { Link } from 'react-router-dom'

const GroupUserItem = ({member, creatorId, removeHandler, buttonText}) => {
    const ctx = useContext(BasicContext)
    const {user} = ctx.userData
    const userData = member.attributes.user.data

  return (
    <ListItem
        key={member.id}>
        <Link to={`/users/${userData.id}`}>
            {userData.attributes.username}
        </Link>
            {userData.id === creatorId && ' - creator'}

            {(checkIfCreator(creatorId) && userData.id !== user.id) && (
                <Button onClick={() => removeHandler(member.id, userData.id)}>{buttonText}</Button>
            )}
    </ListItem>
  )
}

export default GroupUserItem