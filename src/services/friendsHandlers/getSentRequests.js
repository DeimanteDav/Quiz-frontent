import axios from "axios"
import { API_URL } from "../../config"

export default async function getSentRequests() {
    const {jwt, user}= JSON.parse(localStorage.getItem('user-data'))
    const headers = {Authorization: `Bearer ${jwt}` }

    const sentRequestsRes = await axios(`${API_URL}/friendships?filters[$and][0][sender][id][$eq]=${user.id}&filters[$and][1][status][$eq]=pending&populate=receiver&filters[$and][2][blocked][$eq]=false`, {headers})
    const sentRequests = sentRequestsRes.data.data

    const sentRequestsReady = sentRequests.map(user => (
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

    return sentRequestsReady
}