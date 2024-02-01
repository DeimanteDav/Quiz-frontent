import { Avatar, Button, List, ListItem, ListItemAvatar, ListItemButton, ListItemText } from '@mui/material'
import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';
import { API_URL } from '../../config';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BasicContext } from '../../context/BasicContext';


const BlockedUsers = ({data, setData}) => {
    const {userData} = useContext(BasicContext)
    const {jwt} = userData

    const unblockUserHandler = (id, name, friendshipId) => {
        const headers = {Authorization: `Bearer ${jwt}` }

        axios.delete(`${API_URL}/blocked-users/${id}`, {headers})
        
        axios.put(`${API_URL}/friendships/${friendshipId}`, {
            data: {
                blocked: false
            }
        }, {headers})

        setData(prevState => {
            let newState = [...prevState]
            return newState.filter(data => data.id !== id)
        })
        toast.info(`${name} Unblocked`)
    }

  return (
    <div className='blocked-users'>
        <h2>Blocked</h2>
        <List>
            {data.map(blocked => (
                <ListItem key={blocked.id}>
                    <ListItemButton component={Link} to={`/users/${blocked.id}`}>
                        <ListItemAvatar>
                            <Avatar />
                        </ListItemAvatar>
                        <ListItemText primary={blocked.user.attributes.username} />
                    </ListItemButton>
                    
                    <Button variant='contained' color='grey' size='small' onClick={() => unblockUserHandler(blocked.id, blocked.user.attributes.username, blocked.friendshipId)}>Unblock</Button>
                </ListItem>
            ))}
        </List>
    </div>
  )
}

export default BlockedUsers