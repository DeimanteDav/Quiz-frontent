import axios from "axios"
import { API_URL, GAME_TYPES } from "../config"

export default async function setUserGamesStatistic({userStatistic, gameType, num, passed, score, showHint}) {
    if (userStatistic) {
        const headers = {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`
        }

        if (userStatistic.length === 0) {
            let timedGames = 0
            let time = 0
            let timedScore = 0
            
            let speedGames = 0
            let speedScore = 0
            
            let standardGames = 0
            let standardScore = 0

            switch (gameType) {
                case GAME_TYPES.timed:
                    timedGames = 1
                    time = num
                    timedScore = score
                    break;
                
                case GAME_TYPES.speedGame:
                    speedGames = 1
                    speedScore = score
                    break;

                case GAME_TYPES.standard:
                    standardGames = 1
                    standardScore = score
                    break;
                
                default:
                    break;
             }

            axios.post(`${API_URL}/user-games-statistics`, {
                data : {
                    user: {
                        connect: [JSON.parse(localStorage.getItem('user-data')).user.id]
                    },
                    totalGames: 1,
                    totalScore: score,
                    totalPassed: passed ? 1 : 0,
                    totalFailed: !passed ? 1 : 0,
                    hintsUsed: showHint.length,
                    timed: {
                        games: timedGames,
                        totalTime: time,
                        averageTime: time,
                        score: timedScore,
                        averageScore: timedScore

                    },
                    speedGame: {
                        games: speedGames,
                        score: speedScore,
                        averageScore: speedScore
                    },
                    standard: {
                        games: standardGames,
                        score: standardScore,
                        averageScore: standardScore
                    }
                }
            }, {headers})
                .then(res => {
                    console.log(res);
                })
        } else {
            let statistic = userStatistic[0].attributes
            const {totalGames, totalScore, totalPassed, totalFailed, hintsUsed, standard, timed, speedGame} = statistic
            
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
                    timedAvgScore = Math.round((timed.score + score)/timed.games)
                break;
            
                case GAME_TYPES.speedGame:
                    speedGames = speedGame.games + 1
                    speedScore = speedGame.score + score
                    speedAvgScore = Math.round((speedGame.score + score)/speedGame.games)
                    break;

                case GAME_TYPES.standard:
                    standardGames = standard.games + 1
                    standardScore = standard.score + score
                    standardAvgScore = Math.round((standard.score + score)/standard.games)
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
            
            
            axios.put(`${API_URL}/user-games-statistics/${userStatistic[0].id}`, {data}, {headers})
                .then(res => {
                    console.log(res)
                })
                    .catch(err => {
                        console.error(err.config.data)
                        console.error(err)
                    })
        }
    }
}