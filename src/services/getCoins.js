import axios from "axios";
import { API_URL } from "../config";

export default async function getCoins() {
    const {user, jwt} = JSON.parse(localStorage.getItem('user-data'))
    const headers = {
        Authorization: `Bearer ${jwt}`
    }
    const {data} = await axios.get(`${API_URL}/coins?filters[user][id][$eq]=${user.id}`, {headers})

    if (data.data.length === 0) {
        let {data} = await axios.post(`${API_URL}/coins`, {
            data: {
                total: 0,
                user: {
                    connect: [user.id]
                }
            }
        }, {headers})

        return data.data
    }
    return data.data[0]
}