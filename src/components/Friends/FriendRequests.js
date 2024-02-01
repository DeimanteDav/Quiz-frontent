import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText, Stack } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import declineFriendRequest from '../../services/friendsHandlers/declineFriendRequest';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FriendRequests = ({friendRequests, confirmHandler, setFriendRequests}) => {
    const declineRequestHandler = (id) => {
        declineFriendRequest(id)

        setFriendRequests(prevState => {
            let newState = [...prevState]
            return newState.filter(request => request.id !== id)
        })
        toast.info('Friend Request Canceled')
    }
    
  return (
    <div className='friend-requests'>
        <h2>Friend Requests</h2>
        <List>
            {friendRequests.map(request => (
                <ListItem key={request.id} className='friend-request'>
                    <ListItemButton component={Link} to={`/users/${request.user.id}`}>
                        <ListItemAvatar>
                            <Avatar src={<AccountCircleIcon />} />
                        </ListItemAvatar>
                        <ListItemText primary={request.user.attributes.username} />
                    </ListItemButton>

                    <Stack direction='row' spacing={2}>
                        <Button variant='contained' size='small' onClick={() => confirmHandler(request.id)}>Confirm</Button>
                        
                        <Button variant='contained' color='grey' size='small' onClick={() => declineRequestHandler(request.id)}>Remove</Button>

                    </Stack>

                </ListItem>
            ))}
        </List>
    </div>
  )
}

export default FriendRequests