import { API_URL } from "../config"

export default async function getUserGamesStatisc() {
    const {jwt, user} = JSON.parse(localStorage.getItem('user-data'))

    const headers = {Authorization: `Bearer ${jwt}`}
 
    const response = await fetch(`${API_URL}/user-games-statistics?filters[user][id][$eq]=${user.id}&populate=*`, {headers})
    const statistic = await response.json()

    return statistic.data
}