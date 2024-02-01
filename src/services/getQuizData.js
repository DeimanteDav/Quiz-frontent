import { API_URL } from "../config";

export default async function getQuizData(id) {
    const headers = localStorage.getItem('user-data') ? {Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`} : {}

    if (id) {
        const response = await fetch(`${API_URL}/quizzes/${id}?populate[questions][populate]=*&populate[statistic][populate]=*&populate[difficulty][populate]=*`, {headers})
        const data = await response.json();
        return data.data;

    } else {
        const response = await fetch(`${API_URL}/questions?populate=answers&populate=questionType`, {headers})
        const data = await response.json()
        return data.data
    } 
} 

