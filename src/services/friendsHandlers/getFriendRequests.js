import axios from "axios"
import { API_URL } from "../../config"

export default async function getFriendRequests() {
    const {jwt, user}= JSON.parse(localStorage.getItem('user-data'))
    const headers = {Authorization: `Bearer ${jwt}` }

    const friendRequestsRes = await axios(`${API_URL}/friendships?filters[$and][0][receiver][id][$eq]=${user.id}&filters[$and][1][status][$eq]=pending&populate=sender&filters[$and][2][blocked][$eq]=false`, {headers})
    const friendRequests = friendRequestsRes.data.data

    const friendRequestsReady = friendRequests.map(user => (
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

    return friendRequestsReady
}