import axios from "axios"
import { API_URL } from "../../config"

export default async function friendRequestHandler(id, action) {
    const headers = {Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`}

    const response = await axios.put(`${API_URL}/friendships/${id}`, {
        data: {
            status: action
        }
    }, {headers})

    return response    
}