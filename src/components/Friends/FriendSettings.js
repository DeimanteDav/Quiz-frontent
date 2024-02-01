import React, { useContext, useEffect, useState } from 'react'
import { Dialog, DialogTitle, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import PersonRemoveAlt1Icon from '@mui/icons-material/PersonRemoveAlt1';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import getGroups from '../../services/groups/getGroups';
import GroupsIcon from '@mui/icons-material/Groups';
import { BasicContext } from '../../context/BasicContext';
import axios from 'axios';
import { API_URL } from '../../config';

const FriendSettings = ({open, handleClose, name, handler, text, blockHandler, userId}) => {
    const [createdGroups, setCreatedGroups] = useState([])
    const [clickedAddToGroup, setClickedAddToGroup] = useState(false)

    const {userData} = useContext(BasicContext)
    const {jwt, user} = userData

    useEffect(() => {
        const getGroupsData = async () => {
            const {data} = await getGroups()
            const createdGroupsData = data.data.filter(group => group.attributes.creator.data.id === user.id)
            const filteredGroups = createdGroupsData.filter(group => {
                const groupMembers = group.attributes.groupMembers.data

                return groupMembers.every(member => (
                    member.attributes.user.data.id !== Number(userId)
                ))
            })
            setCreatedGroups(filteredGroups)
        }
        getGroupsData()
    }, [user.id, clickedAddToGroup, userId])

    const addToGroupHandler = groupId => {
        const headers = {Authorization: `Bearer ${jwt}`}
        axios.post(`${API_URL}/group-members?populate=*`, {
            data: {
                user: {
                    connect: [userId]
                },
                group: {
                    connect: [groupId]
                }
            }
        }, {headers})
            .then(res => {
                if (res.statusText === 'OK') {
                    setClickedAddToGroup(false)
                }
            })

    }

    const handleGroupClick = () => {
        handleClose()
        setClickedAddToGroup(true)
    }

  return (
    <>
    <Dialog open={open} onClose={handleClose}>
        {name && <DialogTitle>{name}</DialogTitle>}
        <List>
            <ListItem>
                <ListItemButton onClick={handler}>
                    <ListItemIcon>
                        <PersonRemoveAlt1Icon />
                    </ListItemIcon>
                    <ListItemText>{text}</ListItemText>
                </ListItemButton>
            </ListItem>
            {createdGroups.length > 0 && (
                <ListItem>
                    <ListItemButton onClick={handleGroupClick}>
                        <ListItemIcon>
                            <GroupsIcon />
                        </ListItemIcon>
                        <ListItemText>Add to group</ListItemText>
                    </ListItemButton>
                </ListItem>
            )}
            <ListItem>
                <ListItemButton onClick={blockHandler}>
                    <ListItemIcon>
                        <LockPersonIcon />
                    </ListItemIcon>
                    <ListItemText>Block</ListItemText>
                </ListItemButton>
            </ListItem>
        </List>
    </Dialog>
    
    <Dialog onClose={() => setClickedAddToGroup(false)} open={clickedAddToGroup}>
        <DialogTitle>Select a Group</DialogTitle>
        <List>
            {createdGroups.map(group => (
                <ListItem key={group.id}>
                    <ListItemButton onClick={() => addToGroupHandler(group.id)}>
                        <ListItemText primary={group.attributes.title} />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Dialog>
    </>
  )
}

export default FriendSettings