import axios from "axios"
import { API_URL, GAME_TYPES } from "../config"

export default async function setPlayedGamesStatistic({totalStatistic, gameType, num, passed, score, showHint}) {
    if (totalStatistic) {
        const headers = {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`
        } 

        const {totalGames, totalScore, totalPassed, totalFailed, hintsUsed, standard, timed, speedGame} = totalStatistic
        
        
        let timedGames = timed.timedGames
        let totalTime = timed.totalTime
        let averageTime = timed.averageTime
        let timedScore = timed.score
        let timedAvgScore = timed.averageScore
        
        let speedGames = speedGame.games
        let speedScore = speedGame.score
        let speedAvgScore = speedGame.averageScore
        
        let standardGames = standard.games
        let standardScore = standard.score
        let standardAvgScore = standard.averageScore

        switch (gameType) {
            case GAME_TYPES.timed:
                timedGames = timed.games + 1
                totalTime = timed.totalTime + num
                averageTime = Math.round((timed.totalTime + num)/timed.games)
                timedScore = timed.score + score
                timedAvgScore = Math.round((timed.score + num)/timed.games)
                break;
            
            case GAME_TYPES.speedGame:
                speedGames = speedGame.games + 1
                speedScore = speedGame.score + score
                speedAvgScore = Math.round((speedGame.score + num)/speedGame.games)
                break;

            case GAME_TYPES.standard:
                standardGames = standard.games + 1
                standardScore = standard.score + score
                standardAvgScore = Math.round((standard.score + num)/standard.games)
                break;

            default:
                break;
        }

        const data = {
            totalGames: totalGames + 1,
            totalScore: Number(totalScore) + score,
            totalPassed: passed ? totalPassed + 1 : totalPassed,
            totalFailed: !passed ? totalFailed + 1 : totalFailed,
            hintsUsed: hintsUsed + showHint.length,
            timed: {
                games: timedGames,
                totalTime,
                averageTime,
                score: timedScore,
                averageScore: timedAvgScore
            },
            speedGame: {
                games: speedGames,
                score: speedScore,
                averageScore: speedAvgScore
            },
            standard: {
                games: standardGames,
                score: standardScore,
                averageScore: standardAvgScore
            }
        }
        
        
        axios.put(`${API_URL}/played-games-statistic`, {data}, {headers})
            .then(res => {
                console.log(res)
            })
                .catch(err => {
                    console.error(err.config.data)
                    console.error(err)
                })
    }
}