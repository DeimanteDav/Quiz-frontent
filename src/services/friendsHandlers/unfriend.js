import axios from "axios"
import { API_URL } from "../../config"
  
export default async function unfriend(id) {
  const headers = {Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`}

  const response = await axios.delete(`${API_URL}/friendships/${id}`, {headers})

  return response
}