import axios from "axios"
import { API_URL } from "../../config"

export default async function getBlockedUsers() {
    const {jwt, user}= JSON.parse(localStorage.getItem('user-data'))
    const headers = {Authorization: `Bearer ${jwt}` }

    const blockedUsersRes = await axios(`${API_URL}/blocked-users?filters[user][id][$eq]=${user.id}&populate[friendship][populate]=*`, {headers})

    const blockedUsersReady = blockedUsersRes.data.data.map(data => {
        const friendshipData = data.attributes.friendship.data.attributes
        const friendshipId =  data.attributes.friendship.data.id
        const receiverData = friendshipData.receiver.data
        const senderData = friendshipData.sender.data

        return {user: receiverData.id === user.id ? senderData : receiverData, id: data.id, friendshipId }
    })

    return blockedUsersReady
}