import React, { useContext, useEffect, useState } from 'react'
import Container from '../../components/Container'
import './FriendsPage.scss'
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { API_URL } from '../../config';
import { BasicContext } from '../../context/BasicContext';
import FindFriends from '../../components/Friends/FindFriends';
import SentRequests from '../../components/Friends/SentRequests';
import FriendRequests from '../../components/Friends/FriendRequests';
import Friends from '../../components/Friends/Friends';
import getFriends from '../../services/friendsHandlers/getFriends';
import getSentRequests from '../../services/friendsHandlers/getSentRequests';
import getFriendRequests from '../../services/friendsHandlers/getFriendRequests';
import isUserLoggedIn from '../../services/isUserLoggedIn';

const FriendsPage = () => {
    isUserLoggedIn()
    const [friends, setFriends] = useState([])
    const [sentRequests, setSentRequests] = useState([])
    const [friendRequests, setFriendRequests] = useState([])

    const [combinedFriends, setCombinedFriends] = useState([])
    const [requestIsSent, setRequestIsSent] = useState(null)

    const {userData} = useContext(BasicContext)
    const {jwt, user} = userData


    useEffect(() => {
        // TODO: is userData paimt o ne uzklausa siust
        const getFriendsData = async () => {
            const mergedFriends = await getFriends()
            setFriends(mergedFriends)
            
            const friendRequestsData = await getFriendRequests()
            setFriendRequests(friendRequestsData);

    
        }
        getFriendsData()
    }, [jwt, user.id])

    
    useEffect(() => {
        const getSentRequestsData = async () => {
            const sentRequestsData = await getSentRequests()
            setSentRequests(sentRequestsData);
            setRequestIsSent(false)
        }
        getSentRequestsData()
    }, [requestIsSent, jwt, user.id])


    useEffect(() => {
        setCombinedFriends([...friends, ...friendRequests, ...sentRequests])
    }, [friends, friendRequests, sentRequests])


    const confirmFriendHandler = async (id) => {
        const headers = {Authorization: `Bearer ${jwt}` }

        const {data} = await axios.put(`${API_URL}/friendships/${id}?populate=sender`, {
            data: {
                status: 'accepted'
            }
        }
        , {headers})
        
        setFriendRequests(prevState => {
            let newState = [...prevState]
            return newState.filter(request => request.id !== id)
        })

        setFriends(prevState => (
            [...prevState, data.data].map(user => (
                {user: user.attributes?.receiver?.data || user.attributes?.sender?.data || user.user, id: user.id}
            )).sort((a, b) => {
                const nameA = a.user.attributes.username.toUpperCase()
                const nameB = b.user.attributes.username.toUpperCase()
    
                if (nameA < nameB) {
                    return -1;
                }
                if (nameA > nameB) {
                    return 1;
                }
                
                return 0;
            })
        ))
    }
 
  return (
    <Container>
        <div className='friends-page'>
            <FindFriends
                setRequestIsSent={setRequestIsSent}
                friendships={combinedFriends}
            />

            <SentRequests
                sentRequests={sentRequests}
                setSentRequests={setSentRequests}
            />

            <FriendRequests
                friendRequests={friendRequests}
                confirmHandler={confirmFriendHandler}
                setFriendRequests={setFriendRequests}
            />

            <Friends
                friends={friends}
                setFriends={setFriends}
            /> 
        </div>
    </Container>
  )
}

export default FriendsPage