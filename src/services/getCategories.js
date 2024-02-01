import axios from "axios";
import { API_URL } from "../config";

export default async function getCategories(id) {
    const headers = {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`
    }
    let url = `${API_URL}/categories`
    
    if (id) {
        url += `${id}?populate[questions][populate]=*`
    }

    const {data} = await axios.get(url, {headers})
    
    return data.data
}