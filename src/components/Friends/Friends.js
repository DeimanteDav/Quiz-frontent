import React, { useState } from 'react'
import unfriend from '../../services/friendsHandlers/unfriend'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Avatar, IconButton, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import { Link } from 'react-router-dom';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import postBlockedUsers from '../../services/friendsHandlers/postBlockedUsers';
import FriendSettings from './FriendSettings';

const Friends = ({friends, setFriends}) => {
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedFriendshipId, setSelectedFriendshipId] = useState('')
    const [selectedFriendName, setSelectedFriendName] = useState('')

    const unfriendHandler = () => {
        setFriends(prevState => {
            let newState = [...prevState]
            return newState.filter(user => user.id !== selectedFriendshipId)
        })
        unfriend(selectedFriendshipId)
        toast.info('Friend Removed')
        setDialogOpen(false)
    }

    const blockHandler = async () => {
        setFriends(prevState => {
            let newState = [...prevState]
            return newState.filter(user => user.id !== selectedFriendshipId)
        })

        const response = await postBlockedUsers(selectedFriendshipId)
        if (response.statusText === 'OK') {
            setFriends(prevState => {
                let newState = [...prevState]
                return newState.filter(user => user.id !== selectedFriendshipId)
            })
            setDialogOpen(false)
        }
    }

    const openDialogHandler = (id, username) => {
        setSelectedFriendName(username)
        setSelectedFriendshipId(id)
        setDialogOpen(true)
    }

    function handleClose() {
        setDialogOpen(false)
    }
    const friendsAmount = (
        <h3>{friends.length === 1 ? `${friends.length} friend` : `${friends.length} friends`}</h3>
    )

  return (
    <div className='friends'>
        <h2>Your Friends</h2>
        {friendsAmount}
        <List>
            {friends.map(friend => (
                <ListItem key={friend.id}>
                    <ListItemButton component={Link} to={`/users/${friend.user.id}`}>
                        <ListItemAvatar>
                            <Avatar />
                        </ListItemAvatar>
                        <ListItemText>{friend.user.attributes.username}</ListItemText>
                    </ListItemButton>
                    <IconButton onClick={() => openDialogHandler(friend.id, friend.user.attributes.username)}>
                        <MoreHorizIcon />
                    </IconButton>
                </ListItem>
            ))}
        </List>

        <FriendSettings 
            open={dialogOpen}
            handleClose={handleClose}
            name={selectedFriendName}
            unfriendHandler={unfriendHandler}
            blockHandler={blockHandler}
        />
    </div>
  )
}

export default Friends