import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Container from '../../components/Container'
import axios from 'axios'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'
import FindFriends from '../../components/Friends/FindFriends'
import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import Confirm from '../../components/Confirm/Confirm'
import './Group.scss'
import postGroupActivity from '../../services/groups/postGroupActivity'
import GroupActivitiesList from '../../components/Groups/GroupActivitiesList'
import isUserLoggedIn from '../../services/isUserLoggedIn'
import GroupUsersList from '../../components/Groups/GroupUsersList'
import checkIfCreator from '../../services/groups/checkIfCreator'

const GroupPage = () => {
    isUserLoggedIn()
    const {groupId} = useParams()
    const [title, setTitle] = useState(null)
    const [creator, setCreator] = useState(null)
    const [members, setMembers] = useState(null)

    const [deleteConfirm, setDeleteConfirm] = useState(null)
    const {userData} = useContext(BasicContext)

    const navigate = useNavigate()
    const {user, jwt} = userData

    useEffect(() => {
        let headers = {Authorization: `Bearer ${jwt}`}
        axios(`${API_URL}/groups/${groupId}?populate[groupMembers][populate]=*&populate[creator][populate]=*`, {headers})
            .then(res => {
                const groupData = res.data.data.attributes
                setTitle(groupData.title)
                setCreator(groupData.creator.data)
                setMembers(groupData.groupMembers.data)
            })
            .catch(error => {
                if (error.response.status === 404) {
                    navigate('/404')
                }
            })
    }, [jwt, groupId, navigate])
    

    if (!title) {
        return ''
    }

    const removeFromGroupHandler = (memberId, userId) => {
        let headers = {Authorization: `Bearer ${jwt}`}

        axios.delete(`${API_URL}/group-members/${memberId}`, {headers})
        .then(res => {
            if (res.statusText === 'OK') {
                setMembers(prevState => prevState.filter(member => member.id !== memberId))

                if (userId) {
                    postGroupActivity(groupId, userId, 'user removed')
                }
            }
        })
    }

    const deleteGroupHandler = (e) => {
        e.preventDefault()
        let headers = {Authorization: `Bearer ${jwt}`}
        axios.delete(`${API_URL}/groups/${groupId}`, {headers})
            .then(res => {
                if (res.statusText === 'OK') {
                    members.forEach(member => {
                        axios.delete(`${API_URL}/group-members/${member.id}`, {headers})
                    })
                    setDeleteConfirm(false)
                    navigate('/groups')
                }
            })
    }

    const leaveGroupHandler = () => {
        const id = members.find(member => member.attributes.user.data.id === user.id).id
        let headers = {Authorization: `Bearer ${jwt}`}

        axios.delete(`${API_URL}/group-members/${id}`, {headers})
        .then(res => {
            if (res.statusText === 'OK') {
                setMembers(prevState => prevState.filter(member => member.id !== id))
                postGroupActivity(groupId, user.id, 'user left')
                navigate('/groups')
            }
        })
    }

  return (
    <Container>
        <div className='group-page'>
            <div className='group-main'>
                <h1>{title}</h1>
                {checkIfCreator(creator.id) && (
                    <FindFriends searchAll={true} groupData={{setMembers, groupId}} title='Find Users' />
                )}

                <div>
                    <span>
                        Creator <Link to={`/users/${creator.id}`}>
                            {creator.attributes.username}
                        </Link>
                    </span>

                    <div className='users-wrapper'>
                        <h2>Members</h2>
                        <GroupUsersList 
                            members={members}
                            creatorId={creator.id}
                            status={'accepted'}
                            buttonText={'remove'}
                            removeHandler={removeFromGroupHandler}
                        />
                    </div>

                    {checkIfCreator(creator.id) && (
                        <div className='users-wrapper'>
                            <h3>Invited</h3>
                            <GroupUsersList 
                                members={members}
                                creatorId={creator.id}
                                status={'pending'}
                                buttonText={'cancel'}
                                removeHandler={removeFromGroupHandler}
                            />
                        </div>
                    )}
                </div>
                <GroupActivitiesList id={groupId} />
            </div>

            <div className='group-bottom'>
                {checkIfCreator(creator.id) ? (
                    <Button
                        color='error'
                        variant='contained'
                        size='small'
                        onClick={() => setDeleteConfirm(true)}
                    >Delete group</Button>
                ) : (
                    <Button
                        color='error'
                        variant='contained'
                        size='small'
                        onClick={leaveGroupHandler}
                    >Leave group</Button>
                )}

                {deleteConfirm && (
                    <Confirm
                        open={deleteConfirm}
                        handleClose={() => setDeleteConfirm(false)}
                        actionHandler={deleteGroupHandler}
                    />
                )}
            </div>
        
        </div>
    </Container>
  )
}

export default GroupPage