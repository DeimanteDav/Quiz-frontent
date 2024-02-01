import { Button, ListItem, ListItemText } from '@mui/material'
import React, { useContext, useState } from 'react'
import addFriend from '../../services/friendsHandlers/addFriend'
import axios from 'axios'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'

const FindFriendsItem = ({user, setRequestIsSent, groupData}) => {
    const [isClicked, setIsClicked] = useState(false)
    const {userData} = useContext(BasicContext)


    const clickHandler = async () => {
        let headers = {Authorization: `Bearer ${userData.jwt}`}
        if (groupData) {
            const {groupId, setMembers} = groupData
            axios.post(`${API_URL}/group-members?populate=*`, {
                data: {
                    user: {
                        connect: [user.id]
                    },
                    group: {
                        connect: [groupId]
                    }
                }
            }, {headers})
                .then(res => {
                    const newMemberData = res.data.data
                    console.log(newMemberData);
                    setMembers(prevState => [...prevState, newMemberData])
                })

        } else {
            addFriend(user.id, setRequestIsSent)
            const response = await addFriend(user.id)
            if (response.statusText === 'OK') {
                setRequestIsSent(true)
            }
        }
        setIsClicked(true)
    }

  return (
    <ListItem key={user.id} className='list-item'>
        <ListItemText primary={user.username} />

        {isClicked ? (
            <Button disabled variant='contained' size='small'>{groupData ? 'invited' : 'Added'}</Button>
        ) : (
            <Button variant='contained' onClick={clickHandler} size='small'>{groupData ? 'invite' : 'Add'}</Button>
        )}
    </ListItem>
  )
}

export default FindFriendsItem