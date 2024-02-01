import { API_URL } from "../config"

export default async function getPlayedGamesStatistic() {
    const headers = {Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`}
 
    const response = await fetch(`${API_URL}/played-games-statistic?populate=*`, {headers})
    const statistic = await response.json()
    
    statistic.data.attributes.totalScore = Number(statistic.data.attributes.totalScore)
    statistic.data.attributes.totalTime = Number(statistic.data.attributes.totalTime)
    
    return statistic.data.attributes
}