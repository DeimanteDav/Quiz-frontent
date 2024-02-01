import { GAME_TYPES, QUIZ_TIME } from "../config"

export default function quizStatsForPlayedGame({quizData, gameType, score, num}) {
    if (!quizData.attributes.statistic) {
        return {}
    }
    let statistic = quizData.attributes.statistic
    let {standard, timed, speedGame} = statistic

    const quizStatistic = {
      games: 0,
      time: 0,
      averageTime: null,
      score: null,
      averageScore: 0
    } 
    
    switch (gameType) {
      case GAME_TYPES.standard:
          quizStatistic.games = standard.games + 1
          quizStatistic.score = standard.score + score
          quizStatistic.averageScore = Math.round((standard.score + score)/(standard.games + 1))
          break;
          
      case GAME_TYPES.timed:
          quizStatistic.games = timed.games + 1
          quizStatistic.totalTime = timed.totalTime + (QUIZ_TIME - num)
          quizStatistic.averageTime = Math.round((timed.totalTime + (QUIZ_TIME - num))/(timed.games + 1))
          quizStatistic.score = timed.score + score
          quizStatistic.averageScore = Math.round((timed.score + score)/(timed.games + 1))
          break;
              
      case GAME_TYPES.speedGame:
          quizStatistic.games = speedGame.games + 1
          quizStatistic.score = speedGame.score + score
          quizStatistic.averageScore = Math.round((speedGame.score + score)/(speedGame.games + 1))
          break;

      default:
          break;
    }
    
    return quizStatistic
}