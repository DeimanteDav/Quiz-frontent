import axios from "axios"
import { API_URL } from "../config"

export default async function getGameTypes() {
    const headers = {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`
    }

    const types = await axios.get(`${API_URL}/game-types`, {headers})

    return types.data.data
}