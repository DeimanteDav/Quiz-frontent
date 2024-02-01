import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import unfriend from '../../services/friendsHandlers/unfriend';

const SentRequests = ({sentRequests, setSentRequests}) => {
    const cancelFriendHandler = (id, userId) => {
        unfriend(id)
        setSentRequests(prevState => {
            let newState = [...prevState]
            return newState.filter(request => request.id !== id)
        })
    
        toast.info('Friend Request Canceled')
    }


  return (
    <div className='sent-requests'>
        <h2>Sent requests</h2>
        <List>
            {sentRequests.map(request => (
                <ListItem key={request.id}>
                    <ListItemButton component={Link} to={`/users/${request.user.id}`}>
                        <ListItemAvatar>
                            <Avatar/>
                        </ListItemAvatar>
                        <ListItemText primary={request.user.attributes.username} />
                    </ListItemButton>
                    
                    <Button variant='contained' color='grey' size='small' onClick={() => cancelFriendHandler(request.id, request.user.id)}>Cancel</Button>
                </ListItem>
            ))}
        </List>
    </div>
  )
}

export default SentRequests