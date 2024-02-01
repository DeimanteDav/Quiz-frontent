import React, { useContext, useEffect, useState } from 'react'
import { BasicContext } from '../../context/BasicContext'
import axios from "axios"
import { API_URL } from "../../config"
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { Button, Skeleton, Stack } from '@mui/material';
import addFriend from '../../services/friendsHandlers/addFriend';
import unfriend from '../../services/friendsHandlers/unfriend';
import friendRequestHandler from '../../services/friendsHandlers/friendRequestHandler';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import postBlockedUsers from '../../services/friendsHandlers/postBlockedUsers';
import { useNavigate } from 'react-router-dom';
import FriendSettings from './FriendSettings';


const FriendshipButton = ({id}) => {
    const [friendshipStatus, setFriendshipStatus] = useState(null)
    const [friendshipId, setFriendshipId] = useState(null)
    const [friendshipChanged, setFriendshipChanged] = useState(false)

    const [dialogOpen, setDialogOpen] = useState(false)
    const [buttonElement, setButtonElement] = useState(null)

    const {userData} = useContext(BasicContext)

    
    useEffect(() => {
        async function getStatus() {
            setFriendshipStatus(await checkFriendshipStatus(id, userData, setFriendshipId))
        }
        getStatus()
    }, [id, userData, dialogOpen, friendshipChanged])


    useEffect(() => {
        let buttonEl = ''
    
        switch (friendshipStatus) {
            case 'friends':
                buttonEl = (
                    <Button variant='contained' onClick={() => setDialogOpen(true)} startIcon={<PeopleAltIcon />}>
                    Friends
                    </Button>
                )
                break;
            
            case 'cancel': 
                buttonEl = (
                    <Button variant='contained' onClick={cancelHandler} startIcon={<HighlightOffIcon />} size='small'>
                        Cancel Request
                    </Button>
                )
                break;
    
            case 'accept': 
                buttonEl = (
                    <Stack>
                        <Button variant='contained' onClick={acceptHandler} startIcon={<PersonAddAlt1Icon />} size='small'>
                            Accept
                        </Button>
                        <Button variant='contained' onClick={declineHandler} startIcon={<HighlightOffIcon />} size='small'>
                            Decline
                        </Button>
                    </Stack>
                )
                break;
    
            case 'not friends': 
                buttonEl = (
                    <Button variant='contained' onClick={addHandler} startIcon={<PersonAddAlt1Icon />} size='small'>
                        Add Friend
                    </Button>
                )
                break;
    
            default:
                break;
        }
        setButtonElement(buttonEl)
    }, [friendshipStatus])

    const dialogCloseHanlder = () => {
        setDialogOpen(false)
      }

    const addHandler = async () => {
        setFriendshipStatus(null)
        const response = await addFriend(id)
        if (response.statusText === 'OK') {
            setFriendshipChanged(prevState => !prevState)
        }
    }
    const cancelHandler = async () => { 
        setFriendshipStatus(null)
        const response = await unfriend(friendshipId)
        if (response.statusText === 'OK') {
            setFriendshipChanged(prevState => !prevState)
        }
    }

    const acceptHandler = async () => {
        setFriendshipStatus(null)
        const response = await friendRequestHandler(friendshipId, 'accepted')
        if (response.statusText === 'OK') {
            setFriendshipChanged(prevState => !prevState)
        }
    }
    const declineHandler = async () => {
        setFriendshipStatus(null)
        const response = await friendRequestHandler(friendshipId, 'declined')
        if (response.statusText === 'OK') {
            setFriendshipChanged(prevState => !prevState)
        }
    }

    const unfriendHandler = async () => {
        setFriendshipStatus(null)
        const response = await unfriend(friendshipId)
        if (response.statusText === 'OK') {
          setFriendshipChanged(prevState => !prevState)
        }
      }

    const navigate = useNavigate()
    const blockHandler = async () => {
        const response = await postBlockedUsers(friendshipId)
        if (response.statusText === 'OK') {
            navigate('/friends')
        }
    }
    
    if (!friendshipStatus) {
        return (
            <Skeleton variant='rectangular' width={130} height={30}/>
        )
    }

    return (
        <>
            <Stack direction={'row'} spacing={2}  alignItems={'center'}>
                {buttonElement}
                <MoreHorizIcon onClick={() => setDialogOpen(true)} />
            </Stack>

            <FriendSettings
                userId={id}
                open={dialogOpen}
                handleClose={dialogCloseHanlder}
                blockHandler={blockHandler}
                handler={unfriendHandler}
                text={'Unfriend'}
            />
        </>
    )
}

async function checkFriendshipStatus(id, userData, setFriendshipId) {
    const {jwt, user} = userData
    const headers = {Authorization: `Bearer ${jwt}` }


    const res1 = await axios(`${API_URL}/friendships?filters[sender][id][$eq]=${user.id}&filters[receiver][id][$eq]=${id}`, {headers})
    const res1Data = res1.data.data

    if (res1Data.length > 0) {
        setFriendshipId(res1Data[0].id)
        const res1ReadyData = res1Data[0].attributes
        const status = res1ReadyData.status

        if (status === 'pending') {
            return 'cancel'
        }
        if (status === 'accepted') {
            return 'friends'
        }
    }
 
    const res2 = await axios(`${API_URL}/friendships?filters[sender][id][$eq]=${id}&filters[receiver][id][$eq]=${user.id}`, {headers}) 
    const res2Data = res2.data.data

    if (res2Data.length > 0) {
        setFriendshipId(res2Data[0].id)
        const res2ReadyData = res2Data[0].attributes
        const status = res2ReadyData.status
        if (status === 'pending') {
            return 'accept'
        }
        if (status === 'accepted') {
            return 'friends'
        }
    }

    return 'not friends'
}

export default FriendshipButton