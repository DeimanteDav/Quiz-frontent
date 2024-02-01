import React, { useContext, useEffect, useRef, useState } from 'react'
import './QuizPage.scss'
import axios from 'axios'
import { API_URL, DIFFICULTIES, QUESTION_TYPES, QUIZ_TIME } from '../../config'
import QuizResult from '../../components/Quiz/QuizResult'
import QuizQuestion from '../../components/Quiz/QuizQuestion'
import { useParams, useSearchParams } from 'react-router-dom'
import QuizNavButtons from '../../components/Quiz/QuizNavButtons'
import getQuizData from '../../services/getQuizData'
import getPlayedGamesStatistic from '../../services/getPlayedGamesStatistic'
import getUserGamesStatisc from '../../services/getUserGamesStatistic'
import setPlayedGamesStatistic from '../../services/setPlayedGamesStatistic'
import setUserGamesStatistic from '../../services/setUserGamesStatistic'
import questionAnswerSection from '../../services/questionAnswerSection'
import { BasicContext } from '../../context/BasicContext'
import getCoins from '../../services/getCoins'
import setQuizStatistic from '../../services/setQuizStatistic'
import quizStatsForPlayedGame from '../../services/quizStatsForPlayedGame'
import getGeneratedQuiz from '../../services/getGeneratedQuiz'
import Features from '../../components/Features/Features'


const QuizPage = () => {
  let {quizId} = useParams()
  // TODO: uselocalstorage vietoj usestate
  const [done, setDone] = useState(false)

  // FIXME: kai useLocalStorage setQuizData nepasikeicia
  const [quizData, setQuizData] = useState(null)
  const [generatedQuiz, setGeneratedQuiz] = useState(null)
  const [questions, setQuestions] = useState([])

  const [questionIndex, setQuestionIndex] = useState(0)
  const [playerAnswers, setPlayerAnswers] = useState([])
  const [playedGameId, setPlayedGameId] = useState(null)
  const correctAnswers = useRef(3)
  const [title, setTile] = useState('')
  const [passingPercentage, setPassingPercentage] = useState(70)

  const [notRegistered, setNotRegistered] = useState(null) 
  const [showHint, setShowHint] = useState([])
  const [showHalf, setShowHalf] = useState([])

  const [searchParams] = useSearchParams()
  const isTimed = searchParams.get('type') === '2' && true
  const gameType = Number(searchParams.get('type'))

  const [num, setNum] = useState(QUIZ_TIME);

  const [coins, setCoins] = useState(null)
  const [userCoinsId, setUserCoinsId] = useState(null)

  const ctx = useContext(BasicContext)
  const {userData, isLoggedIn} = ctx

  // useEffect(() => {
  //   let timer
  //   if (num > 0 && !done) {
  //     timer = setInterval(() => setNum(prev => prev - 1), 1000)
  //   } else {
  //     timer = num
  //     // quizFinishHandler()
  //   }

  //   return () => clearInterval(timer);
  // }, [num, done])

 
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
 

  const score = Math.round(correctAnswers.current/questions.length*100)
  const passed = Number(passingPercentage) <= score ? true : false


  useEffect(() => {
    async function getPrevCoins() {
      let prevCoins = await getCoins()
      setCoins(prevCoins.attributes.total)
      setUserCoinsId(prevCoins.id)
    }
    getPrevCoins()
  }, [])

  const statisticsUpdate = async () => {
    let playedGameResult = await getPlayedGamesStatistic()
    setPlayedGamesStatistic({playedGameResult, gameType, num, passed, score, showHint})

    let userGamesResult = await getUserGamesStatisc()
    setUserGamesStatistic({userGamesResult, gameType, num, passed, score, showHint})
  }

  function quizFinishHandler() {
    questions && questions.forEach((question, i) => {
      let answers = question.attributes.answers.data
      let correctLength = answers.filter(answer => (
        playerAnswers[i].some(playerAnswer => answer.attributes.name === playerAnswer)
      )).length

      if (correctLength === answers.length) {
        correctAnswers.current = correctAnswers.current + correctLength
      }
    })

    let quizDifficulty = quizData.attributes.difficulty.data
    let receivedCoins = quizDifficulty ? DIFFICULTIES.find(difficulty => difficulty.id === quizDifficulty.id).reward : 10

    const headers = {
      Authorization: `Bearer ${userData.jwt}`
    }

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
      time: QUIZ_TIME - num,
      coinsReceived: correctAnswers.current === questions.length ? receivedCoins : 0,
      quizStatistic: quizStatsForPlayedGame({quizData, gameType, score, num}),
      difficulty: {
        connect: [quizDifficulty ? quizDifficulty.id : 1]
      },
      generatedQuiz: {
        connect: [generatedQuiz.id]
      }
    }

    // TODO: PABANDYTI VELIAU
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
            // update o ne set
            let passedGame = res.data.data.attributes.passed
            console.log(passedGame);
            setQuizStatistic({quizId, gameType, score, passed: passedGame, num})
          }
        })
        .catch(err => {
          console.log(err);
        })
    } else {
      localStorage.setItem('unregistered-game', JSON.stringify(data))
      setNotRegistered(true)
      setDone(true)
    }

  }

  const questionIndexHandler = num => setQuestionIndex(prevState => prevState + num)
  
  const answerHandler = (answer, checked) => {
    console.log(playerAnswers);
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

  const navigationKeysHandler = e => {
    if (e.key === 'Enter') {
      if (questionIndex < questionsLength - 1) {
        setQuestionIndex(prevState => prevState + 1)
      } else {
        quizFinishHandler()
      }
    }
  }

  if (questions.length === 0) {
    return ''
  }


  const currentQuestion = questions[questionIndex]
  const questionType = currentQuestion.attributes.questionType.data.attributes.type

  const questionContent = currentQuestion.attributes.content
  const questionsLength = questions.length

  const currentAnswer = playerAnswers[questionIndex]




    // readyQuestions = [{kl: 'klausimas1'}, {kl2: 'klausimas2'}]
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
          <div className='quiz-form' onKeyDown={navigationKeysHandler}>
            <QuizQuestion 
              question={questionContent} 
              questionIndex={questionIndex} 
              questionsLength={questionsLength} 
              isTimed={isTimed}
              num={num}
            />

            {questionAnswerSection({questionType, answerHandler, currentAnswer, currentQuestion, showHalf, readyQuestion})}

            <QuizNavButtons
              length={questionsLength}
              questionIndex={questionIndex}
              onQuestionChange={questionIndexHandler}
              onQuizFinish={quizFinishHandler}
            /> 
            
            <Features
              hints={{showHint, setShowHint}}
              fiftyFifty={{showHalf, setShowHalf, questionType}}
              currentQuestion={currentQuestion}
            />

          </div>
        ) : (
          <QuizResult
            notRegistered={notRegistered}
            questions={questions}
            correctAnswers={correctAnswers}
            playedGameId={playedGameId}
            passingPercentage={passingPercentage}
            hintsUsed={showHint.length}
          />
        )}
      </div>
    </div>
  )
}

export default QuizPage