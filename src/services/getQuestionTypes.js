import axios from "axios";
import { API_URL } from "../config";

export default async function getQuestionTypes() {
    const headers = {
        Authorization: `Bearer ${localStorage.getItem('user-data').jwt}`
    }

    const {data} = await axios.get(`${API_URL}/question-types`, {headers})
 
    return data.data
}