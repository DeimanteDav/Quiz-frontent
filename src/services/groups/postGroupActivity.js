import axios from "axios"
import { API_URL } from "../../config"

export default async function postGroupActivity(groupId, userId, type) {
    const {jwt} = JSON.parse(localStorage.getItem('user-data'))
    let headers = {Authorization: `Bearer ${jwt}`}

    axios.post(`${API_URL}/group-activities`, {
        data: {
            group: {
                connect: [groupId]
            },
            user: {
                connect: [userId]
            },
            type
        }
    }, {headers})
        .then(res => console.log(res))
}