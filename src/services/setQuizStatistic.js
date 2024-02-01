import axios from "axios";
import getQuizData from "./getQuizData";
import { API_URL, GAME_TYPES, QUIZ_TIME } from "../config";

export default async function setQuizStatistic({quizId, gameType, score, passed, num}) {
    let quizData = (await getQuizData(quizId)).attributes
    const headers = {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('user-data')).jwt}`
    }
    console.log(quizData);
    let time = QUIZ_TIME - num
   

    if (!quizData.statistic) {
        quizData.statistic = {
            totalGames: 1,
            totalPassed: passed ? 1 : 0,
            totalFailed: !passed ? 1 : 0,
            standard: {
                games: 0,
                score: 0,
                averageScore: 0
            },
            timed: {
                games: 0,
                totalTime: 0,
                averageTime: 0,
                score: 0,
                averageScore: 0
            },
            speedGame: {
                games: 0,
                score: 0,
                averageScore: 0
            },
            difficulty: {
                connect: [1]
            }
        }

        let {statistic} = quizData 
        let {standard, timed, speedGame} = statistic
        switch (gameType) {
            case GAME_TYPES.standard:
                standard.games = 1
                standard.score = score
                standard.averageScore = score
                break;
                
            case GAME_TYPES.timed:
                timed.games = 1
                timed.totalTime = time
                timed.averageTime = time
                timed.score = score
                timed.averageScore = score
                break;
                    
            case GAME_TYPES.speedGame:
                speedGame.games = 1
                speedGame.score = score
                speedGame.averageScore = score
                break;

            default:
                break;
        }

        axios.put(`${API_URL}/quizzes/${quizId}`, {
            data: quizData
        }, {headers})
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))

    } else {
        console.log(passed);
        let {statistic} = quizData 
        let {standard, timed, speedGame} = statistic

        statistic.totalGames = statistic.totalGames + 1
        statistic.totalPassed = passed ? statistic.totalPassed + 1 : statistic.totalPassed
        statistic.totalFailed = !passed ? statistic.totalFailed + 1 : statistic.totalFailed

        let totalPassedPercentage = (statistic.totalPassed/statistic.totalGames)*100

        if (totalPassedPercentage >= 80) {
            quizData.difficulty = {connect: [1]}
        }
        if (totalPassedPercentage >= 50 && totalPassedPercentage < 80) {
            quizData.difficulty = {connect: [2]}
        } else {
            quizData.difficulty = {connect: [3]}
        }

        switch (gameType) {
            case GAME_TYPES.standard:
                standard.games = standard.games + 1
                standard.score = standard.score + score 
                standard.averageScore = Math.round(standard.score/standard.games)
                break;
                
            case GAME_TYPES.timed:
                timed.games = timed.games + 1
                timed.totalTime = timed.totalTime + time
                timed.averageTime = Math.round(timed.totalTime/timed.games)
                timed.score = timed.score + score
                timed.averageScore = Math.round(timed.score/timed.games)
                break;
                    
            case GAME_TYPES.speedGame:
                speedGame.games = speedGame.games + 1
                speedGame.score = speedGame.score + score
                speedGame.averageScore = Math.round(speedGame.score/speedGame.games)
                break;

            default:
                break;
        }

        axios.put(`${API_URL}/quizzes/${quizId}`, {
            data: quizData
        }, {headers})
            .then(res => {
                console.log(res);
            })
            .catch(err => console.log(err))
    }
}