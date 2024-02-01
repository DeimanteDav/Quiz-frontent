import axios from "axios";
import { API_URL } from "../../config";

export default async function postBlockedUsers(selectedFriendshipId) {
    const {jwt, user}= JSON.parse(localStorage.getItem('user-data'))
    const headers = {Authorization: `Bearer ${jwt}` }

    const response = await axios.post(`${API_URL}/blocked-users?&populate[friendship][populate]=*&populate[user][populate]=*`, {
        data: {
            user: {
                connect: [user.id]
            },
            friendship: {
                connect: [selectedFriendshipId]
            }
        }
    }, {headers})
    
    if (response.statusText === 'OK') {
        axios.put(`${API_URL}/friendships/${selectedFriendshipId}`, {
            data: {
                blocked: true
            }
        }, {headers})
    }
    return response
}