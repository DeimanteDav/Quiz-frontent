import axios from "axios"
import { API_URL } from "../../config"

export default async function getGroups() {
    const {jwt, user} = JSON.parse(localStorage.getItem('user-data'))

    let headers = {Authorization: `Bearer ${jwt}`}
    const response = await axios(`${API_URL}/groups?populate[groupMembers][populate]=*&populate[creator][populate]=*&filters[groupMembers][user][id][$in]=${user.id}&filters[groupMembers][status][$eq]=accepted`, {headers})

    return response
}