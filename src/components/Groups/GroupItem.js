import React, { useState } from 'react'
import { Avatar, Collapse, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { Link } from 'react-router-dom';
import './GroupItem.scss'

const GroupItem = ({group}) => {
    const [open, setOpen] = useState(false)

    const handleClick = () => {
        setOpen(!open);
    };

  return (
    <>
        <ListItem key={group.id} className='group-item'>
            <Link to={`/groups/${group.id}`} >
                <ListItemText className='group-title' primary={group.attributes.title}/>
            </Link>
            
            {open ? <ExpandLess onClick={handleClick} /> : <ExpandMore onClick={handleClick} />}
        </ListItem>
        <Collapse in={open} timeout='auto' unmountOnExit>
            <List>
                {group.attributes.groupMembers.data.map(member => (
                    member.attributes.status === 'accepted' && (
                        <ListItem className='group-member' key={member.id} sx={{ pl: 4 }}>
                            <Link to={`/users/${member.attributes.user.data.id}`}>
                                <ListItemAvatar>
                                    <Avatar />
                                </ListItemAvatar>
                                <ListItemText primary={member.attributes.user.data.attributes.username}/>
                            </Link>
                        </ListItem>
                    )
                ))}
            </List>
        </Collapse>
    </>
    )
}

export default GroupItem