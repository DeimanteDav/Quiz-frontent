import React, { useContext, useEffect, useState } from 'react'
import Container from '../../components/Container'
import axios from 'axios'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'
import { Link, useNavigate } from 'react-router-dom'
import { Button, TextField } from '@mui/material'
import BuyConfirmation from '../../components/Buy/BuyConfirmation'
import GroupsList from '../../components/Groups/GroupsList'
import GroupsInvitesList from '../../components/Groups/GroupsInvitesList'
import getGroups from '../../services/groups/getGroups'
import postGroupActivity from '../../services/groups/postGroupActivity'
import isUserLoggedIn from '../../services/isUserLoggedIn'

const Groups = () => {
    isUserLoggedIn()
    const [groups, setGroups] = useState(null)
    const [isCreateClicked, setIsCreateClicked] = useState(null)
    const [clickedBuyGroup, setClickedBuyGroup] = useState(null)
    const [newGroupTitle, setNewGroupTitle] = useState('')
    const [invites, setInvites] = useState([])
    
    const {userData} = useContext(BasicContext)

    useEffect(() => {
        if (userData) {
            getGroupsData()
            
            const {jwt, user} = userData
            let headers = {Authorization: `Bearer ${jwt}`}
            
            axios(`${API_URL}/groups?populate[groupMembers][populate]=*&populate[creator][populate]=*&filters[groupMembers][user][id][$in]=${user.id}&filters[groupMembers][status][$eq]=pending`, {headers})
            .then(res => setInvites(res.data.data))
            isUserLoggedIn()
        }
    }, [userData])
    
    
    const getGroupsData = async () => {
        const response = await getGroups()
        setGroups(response.data.data)
    }

    const navigate = useNavigate()
    const createGroupHandler = async () => {
        const {jwt, user} = userData
        let headers = {Authorization: `Bearer ${jwt}`}
     
        axios.post(`${API_URL}/groups`, {
            data: {
                title: newGroupTitle,
                creator: {
                    connect: [user.id]
                }
            }
        }, {headers})
            .then(res => {
                if (res.statusText === 'OK') {
                    const groupId = res.data.data.id

                    axios.post(`${API_URL}/group-members`, {
                        data: {
                            user: {
                                connect: [user.id]
                            },
                            group: {
                                connect: [groupId]
                            },
                            status: 'accepted' 
                        }
                    }, {headers})
                        .then(res => {
                            console.log(res);
                            if (res.statusText === 'OK') {
                                postGroupActivity(groupId, user.id, 'group created')
                                navigate(`/groups/${groupId}`)
                            }
                        })
                }
            })
    }

    const groupInviteHandler = (invite, status) => {
        const {jwt, user} = userData

        const allGroupMembers = invite.attributes.groupMembers.data
        const invitedMemberId = allGroupMembers.filter(member => member.attributes.user.data.id === user.id)[0].id

        let headers = {Authorization: `Bearer ${jwt}`}
        axios.put(`${API_URL}/group-members/${invitedMemberId}`, {
            data: {
                status,
            }
        }, {headers})
            .then(res => {
                if (res.statusText === 'OK') {
                    setInvites(prevState => {
                        const newState = [...prevState]
                        return newState.filter(data => data.id !== invite.id)
                    })
                    if (status === 'accepted') {
                        postGroupActivity(invite.id, user.id, 'new user')
                        getGroupsData()
                    } else {
                        postGroupActivity(invite.id, user.id, 'declined invitation')
                    }
                    setClickedBuyGroup(null)
                }
            })
    }

    const handleGroupBuyClick = () => {
        setClickedBuyGroup(prevState => !prevState)
    }

    if (!userData) {
        return (
            <Container>
                <span>You need to register</span>
                <Link to={`/register`}>Register</Link>
            </Container>
        )
    }

    if (!groups) {
        return ''
    }
 
  return (
    <Container>
        <div className='groups-page'>
            <div>
                <h1>Groups</h1>
                <GroupsList
                    groups={groups}
                />
            </div>

            <div>
                <h2>Invites</h2>
                <GroupsInvitesList
                    invites={invites}
                    handler={groupInviteHandler}
                />
            </div>

            {isCreateClicked ? (
                <div className='create-group-wrapper'>
                    <TextField label='Group title' size='small' value={newGroupTitle} onChange={(e) => setNewGroupTitle(e.target.value)} />

                    <BuyConfirmation
                        clicked={clickedBuyGroup}
                        handleClick={handleGroupBuyClick}
                        textConfirmation={'Buy Group'}
                        amount={20}
                        buyHandler={createGroupHandler}
                    />
                </div>
            ) : (
                <Button variant='contained' onClick={() => setIsCreateClicked(true)}>Create a Group</Button>
            )}
        </div>
    </Container>
  )
}

export default Groups