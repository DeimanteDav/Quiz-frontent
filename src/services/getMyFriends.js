import axios from "axios"
import { API_URL } from "../config"

export default async function getMyFriends() {
    const {user, jwt} = JSON.parse(localStorage.getItem('user-data'))
    const headers = {
        Authorization: `Bearer ${jwt}`
    }
    const {data} = await axios(`${API_URL}/friends?populate[friends][populate]=*&filters[user][id][$eq]=${user.id}`, {headers})

    if (data.data.length === 0) {
        const {data} = await axios.post(`${API_URL}/friends?populate[friends][populate]=*`, {
            data: {
                user: {
                    connect: [user.id]
                }
            }
        }, {headers})
        
        return data.data
    }

    return data.data[0]
}