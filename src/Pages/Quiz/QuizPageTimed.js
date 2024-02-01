import React, { useContext, useEffect, useRef, useState } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import getQuizData from '../../services/getQuizData'
import QuizQuestion from '../../components/Quiz/QuizQuestion'
import axios from 'axios'
import { API_URL, DIFFICULTIES } from '../../config'
import QuizResult from '../../components/Quiz/QuizResult'
import getPlayedGamesStatistic from '../../services/getPlayedGamesStatistic'
import getUserGamesStatisc from '../../services/getUserGamesStatistic'
import setPlayedGamesStatistic from '../../services/setPlayedGamesStatistic'
import setUserGamesStatistic from '../../services/setUserGamesStatistic'
import questionAnswerSection from '../../services/questionAnswerSection'
import { BasicContext } from '../../context/BasicContext'
import setQuizStatistic from '../../services/setQuizStatistic'
import getCoins from '../../services/getCoins'
import quizStatsForPlayedGame from '../../services/quizStatsForPlayedGame'
import getGeneratedQuiz from '../../services/getGeneratedQuiz'
import Features from '../../components/Features/Features'


const QuizPageTimed = () => {
  let {quizId} = useParams()
  const [done, setDone] = useState(false)

  const [quizData, setQuizData] = useState(null)
  const [generatedQuiz, setGeneratedQuiz] = useState(null)
  const [questions, setQuestions] = useState([])

  const [title, setTile] = useState('')
  const [passingPercentage, setPassingPercentage] = useState(70)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [playerAnswers, setPlayerAnswers] = useState([])
  const [playedGameId, setPlayedGameId] = useState(null)
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(null)
  const correctAnswers = useRef(0)
  const [correct, setCorrect] = useState([])

  const [notRegistered, setNotRegistered] = useState(null) 
  const [showHint, setShowHint] = useState([])
  const [showHalf, setShowHalf] = useState([])

  const [searchParams] = useSearchParams()
  const gameType = Number(searchParams.get('type'))

  const [num, setNum] = useState(5);
  const currentAnswer = playerAnswers[questionIndex]

  const [coins, setCoins] = useState(null)
  const [userCoinsId, setUserCoinsId] = useState(null)

  const ctx = useContext(BasicContext)
  const {userData, isLoggedIn} = ctx
  // TODO: PO klausimo ismestu teisinga ats is karto


  useEffect(() => {
    let timer
    if (num > 0 && !done) {
      timer = setInterval(() => setNum(prev => prev - 1), 1000)
    }
    return () => clearInterval(timer);
  }, [num, done])


  useEffect(() => {
    const fetchData = async () => {
      let quizResult = await getQuizData(quizId)
      setQuizData(quizResult)

      let generated = await getGeneratedQuiz(quizId, isLoggedIn)
      setGeneratedQuiz(generated)
    }
    fetchData()
  }, [quizId, isLoggedIn])

  useEffect(() => {
    async function getPrevCoins() {
      let prevCoins = await getCoins()
      console.log(prevCoins);
      setCoins(prevCoins.attributes.total)
      setUserCoinsId(prevCoins.id)
    }
  
    getPrevCoins()
  }, [])

  useEffect(() => {
    if (quizData && generatedQuiz) {
      if (quizId) {
        const quizTitle = generatedQuiz.attributes.title
        const quizQuestions = generatedQuiz.attributes.questions.data
        const quizPercentage = quizData.attributes.passingPercentage

        setTile(quizTitle)
        setQuestions(quizQuestions)
        setPlayerAnswers(quizQuestions.map(_ => []))
        setPassingPercentage(quizPercentage)
      } else {
        setQuestions(quizData)
        setPlayerAnswers(quizData.map(_ => []))
      }
    }
  }, [quizData, quizId, generatedQuiz])
    
  useEffect(() => {
    if (num === 0 && !showCorrectAnswer) {
      setCorrect(() => {
        let correct = currentAnswer.map(playerAnswer => (
          currentQuestion.attributes.answers.data.filter(answer => answer.attributes.name === playerAnswer)[0]
        ))
        if (correct.length > 1) {
          correctAnswers.current = correctAnswers.current + 1
        }
        return correct

      })
      setShowCorrectAnswer(true)
    }
  }, [num, questionIndex, questions, showCorrectAnswer, currentAnswer, correctAnswers])

 

  const answerHandler = (answer, checked) => {
    setPlayerAnswers(prevState => {
      const newState = [...prevState]
      let el = [...newState[questionIndex]]

      if (currentQuestion.attributes.answers.data.length > 1) {
        if (checked) {
          el.push(answer)
        } else {
          el = [...newState[questionIndex]].filter(answ => answ !== answer)
        }
      } else {
        el = [answer]
      }
      newState[questionIndex] = el
      return newState
    })
  }

  const score = Math.round(correctAnswers.current/questions.length*100)
  const passed = passingPercentage <= score ? true : false

  const statisticsUpdate = async () => {
    let playedGameResult = await getPlayedGamesStatistic()
    setPlayedGamesStatistic({playedGameResult, gameType, num, passed, score, showHint})

    let userGamesResult = await getUserGamesStatisc()
    setUserGamesStatistic({userGamesResult, gameType, num, passed, score, showHint})
  }
 

  function quizFinishHandler() {
    setShowCorrectAnswer(null)
    let quizDifficulty = quizData.attributes.difficulty.data
    let receivedCoins = quizDifficulty ? DIFFICULTIES.find(difficulty => difficulty.id === quizDifficulty.id).reward : 10

    const headers =  {Authorization: `Bearer ${userData.jwt}`}
    const data = {
      title,
      passed: passingPercentage <= (correctAnswers.current/questions.length*100) ? true : false,
      playerAnswers: 
        playerAnswers.map((answers, i) => (
          {
            answers: answers.length > 0 ? answers.map(answ => ({answer: answ})) : [{answer: ''}],
            question: {
              connect: [questions[i].id]
            }
          }
      )),
      correctAnswers: correctAnswers.current,
      // TODO: palvoti kaip identifikuoti kad cia butent sito userio
      user: {
        connect: [userData.user.id]
      },
      quiz: {
        connect: [quizId]
      },
      hintsUsed: showHint.length,
      gameType: {
        connect: [gameType]
      },
      coinsReceived: correctAnswers.current === questions.length ? receivedCoins : 0,
      quizStatistic: quizStatsForPlayedGame({quizData, gameType, score}),
      difficulty: {
        connect: [quizDifficulty ? quizDifficulty.id : 1]
      },
      generatedQuiz: {
        connect: [generatedQuiz.id]
      }
    } 
    
    if (isLoggedIn) {
      if (correctAnswers.current === questions.length) {
        let totalCoins = coins + receivedCoins
        axios.put(`${API_URL}/coins/${userCoinsId}`, {
          data: {
            total: totalCoins,
            user: {
              connect: [Number(userData.user.id)]
            }
          }
        }, {headers})
          .then(res => console.log(res))
          .catch(err => {
            console.log(err);
          })
      }
  
      axios.post(`${API_URL}/played-games`, {data}, {headers})
        .then(res => {
          console.log(res);
          if (res.statusText === 'OK') {
            setDone(true)
            statisticsUpdate()
            setPlayedGameId(res.data.data.id)
            let passedGame = res.data.data.attributes.passed
            setQuizStatistic({quizId, gameType, score, passed: passedGame})
          }
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      setNotRegistered(true)
      setDone(true)
      localStorage.setItem('unregistered-game', JSON.stringify(data))
    }
  }

  const nextQuestionHandler = () => {
    setQuestionIndex(prevState => prevState + 1)
    setNum(5)
    setShowCorrectAnswer(null)
  }


  if (questions.length === 0) {
      return ''
  }

  const currentQuestion = questions[questionIndex]
  const questionType = currentQuestion.attributes.questionType.data.attributes.type
  const questionContent = currentQuestion.attributes.content

  let readyQuestions = questions.map(question => {
    let data = question.attributes
    let wrongAnswersArr = data.wrongAnswers.data

    const correctAnswers = data.answers.data.map(answer => ({id: answer.id , answer: answer.attributes.name}))
    const wrongAnswers = wrongAnswersArr.map(answer => ({id: answer.id, answer: answer.attributes.name})).sort(() => 0.5 - Math.random())

    if (wrongAnswers.length > 3 || correctAnswers.length > 1) {
      wrongAnswers.splice((4 - correctAnswers.length), correctAnswers.length)
    }
    
    for (let i = 0; i < 2; i++) {
      const randomIndex = Math.floor(Math.random()*wrongAnswers.length)
      wrongAnswers[randomIndex] = {...wrongAnswers[randomIndex], disabled: true}
    }

    return {
      allAnswers: ([...correctAnswers, ...wrongAnswers]).sort(() => 0.5 - Math.random()),
      correctAnswers,
      wrongAnswers
    }
  })

  let readyQuestion = readyQuestions[questionIndex]

  return (
    <div className='quiz-container'>
        <div className='quiz'>
        {(currentQuestion && !done) ? (
            !showCorrectAnswer ? (
              <div className='quiz-form'>
                <QuizQuestion
                  question={questionContent}
                  questionIndex={questionIndex}
                  questionsLength={questions.length}
                  isTimed={true}
                  num={num}
                />

                {questionAnswerSection({questionType, answerHandler, currentAnswer, currentQuestion, showHalf, readyQuestion})}

                <Features
                  hints={{showHint, setShowHint}}
                  fiftyFifty={{showHalf, setShowHalf}}
                  currentQuestion={currentQuestion}
                />
              </div>
            ) : (
              <div className='correct-answer-wrapper'>
                <div>
                  <h1>Correct Answer</h1>
                  {currentQuestion.attributes.answers.data.map(answer => {
                    let answersMatch = correct.length > 0 && correct.some(correctAnswer => (
                      correctAnswer && correctAnswer.id === answer.id
                    ))
                    return (
                      <span
                        className={answersMatch ? 'green' : 'red'}
                        key={answer.id}
                      >{answer.attributes.name}</span>
                    )
                  })}
                </div>
                {questionIndex === questions.length - 1 ? (
                  <button onClick={quizFinishHandler}>Finish</button>
                ) : (
                  <button onClick={(nextQuestionHandler)}>Next Question</button>
                )}
              </div>
            )
        ) : (
            <QuizResult
                notRegistered={notRegistered}
                questions={questions}
                correctAnswers={correctAnswers}
                playedGameId={playedGameId}
                passingPercentage={passingPercentage}
                usedHints={showHint.length}
            />
        )}
        </div>
    </div>
  )
}

export default QuizPageTimed