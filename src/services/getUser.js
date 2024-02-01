import axios from "axios";
import { API_URL } from "../config";

export default async function getUser() {
    const isLoggedIn = JSON.parse(localStorage.getItem('is-logged-in'))
    if (!isLoggedIn) {
        return
    }

    const headers = {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`
    }

    const {data} = await axios.get(`${API_URL}/users/me`, {headers})
    
    return data

}