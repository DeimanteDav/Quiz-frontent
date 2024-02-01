import axios from "axios"
import { API_URL } from "../../config"

export default async function getFriends() {
    const {jwt, user}= JSON.parse(localStorage.getItem('user-data'))
    const headers = {Authorization: `Bearer ${jwt}` }

    const friendsSentRes = await axios(`${API_URL}/friendships?filters[$and][0][sender][id][$eq]=${user.id}&filters[$and][1][status][$eq]=accepted&populate=receiver&filters[$and][2][blocked][$eq]=false`, {headers})
    const friendsSent = friendsSentRes.data.data
    
    const friendsReceivedRes = await axios(`${API_URL}/friendships?filters[$and][0][receiver][id][$eq]=${user.id}&filters[$and][1][status][$eq]=accepted&populate=sender&filters[$and][2][blocked][$eq]=false`, {headers})
    const friendsReceived = friendsReceivedRes.data.data

    const mergedFriends = [...friendsSent, ...friendsReceived].map(user => (
        {user: user.attributes.receiver?.data || user.attributes.sender?.data, id: user.id}
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

    return mergedFriends
}