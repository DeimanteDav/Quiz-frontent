import './App.css';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Questions from './Pages/Questions';
import QuestionTypes from './Pages/QuestionTypes';
import QuestionType from './Pages/QuestionType';
import Question from './Pages/Question';
import HomePage from './Pages/Home/HomePage';
import Navigation from './components/Navigation/Navigation';
import Footer from './components/Footer';
import Category from './Pages/Category';
import QuizPage from './Pages/Quiz/QuizPage';
import PlayedGames from './Pages/Played/PlayedGames';
import PlayedGame from './Pages/Played/PlayedGame';
import Quizzes from './Pages/Quiz/Quizzes';
import CreateQuiz from './Pages/Quiz/CreateQuiz';
import CreateQuestionPage from './Pages/CreateQuestionPage';
import CreateAnswerPage from './Pages/CreateAnswerPage';
import LogInPage from './Pages/Account/LogInPage';
import RegisterPage from './Pages/Account/RegisterPage';
import EditUserPage from './Pages/Account/EditUserPage';
import { useEffect, useState } from 'react';
import axios from 'axios';
import QuizTypePage from './Pages/Quiz/QuizTypePage';
import { API_URL, USER_ROLES } from './config';
import QuizPageTimed from './Pages/Quiz/QuizPageTimed';
import { BasicContext } from './context/BasicContext';
import { ToastContainer } from 'react-toastify';
import TestPage from './Pages/TestPage';
import Store from './Pages/Store';
import getCoins from './services/getCoins';
import LeaderboardPage from './Pages/Leaderboard/LeaderboardPage';
import UserPage from './Pages/UserPage/UserPage';
import QuizInfo from './Pages/Quiz/QuizInfo';
import FriendsPage from './Pages/FriendsPage/FriendsPage';
import QuizLeaderboard from './Pages/Leaderboard/QuizLeaderboard';
import Groups from './Pages/Groups/Groups';
import GroupPage from './Pages/Groups/GroupPage';
import BlockedUsersPage from './Pages/BlockedUsersPage/BlockedUsersPage';
import PageNotFound from './Pages/PageNotFound';


function App() {
  const {pathname} = useLocation()
  const [role, setRole] = useState(null)
  const navigate = useNavigate()

  const [fullscreen, setFullscreen] = useState(false)

  const loggedIn = JSON.parse(localStorage.getItem('is-logged-in'))
  const [isLoggedIn, setIsLoggedIn] = useState(loggedIn)
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem('user-data')))
  const [userCoins, setUserCoins] = useState()

  const ctxValue = {
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    userCoins,
    setUserCoins
  }

  async function getCoinsAmount() {
    const coins = await getCoins()
    const amount = coins.attributes.total
    setUserCoins(amount)
    localStorage.setItem('user-coins', amount)
  }


  useEffect(() => {
    if (isLoggedIn) {
      getCoinsAmount()

      axios.get(`${API_URL}/users/me?populate=role`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('qp-jwt')}`
        }
      })
        .then(res => {
          setRole(res.data.role.id)
        })
        .catch(err => {
          if (err.response.status === 401) {
            localStorage.setItem('is-logged-in', JSON.stringify(false))
            localStorage.removeItem('qp-jwt')
            localStorage.removeItem('user-data')
            navigate('/')
            window.location.reload()
          }
        })
    } else {
      setRole(null)
    } 
  }, [isLoggedIn, navigate])


  useEffect(() => {
    setFullscreen(false)

    if (pathname === '/log-in' || pathname === '/register' || (pathname.split('/')[1] === 'quizzes' && pathname.split('/')[2] !== undefined)) {
      setFullscreen(true)
    }
  }, [pathname])

  
  return (
    <BasicContext.Provider value={ctxValue}>
      {!fullscreen && <Navigation />}

      <div className='main'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/questions' element={<Questions/>} />
          <Route path='/categories/:categoryId' element={<Category/>} />
          <Route path='/questions/:questionId' element={<Question/>} />
          <Route path='/question-types' element={<QuestionTypes/>} />
          <Route path='/question-types/:questionTypeId' element={<QuestionType/>} />
          <Route path='/quizzes' element={<Quizzes/>} />
          <Route path='/quizzes/:quizId' element={<QuizPage/>} />
          <Route path='/quiz-page' element={<QuizPage/>} />
          <Route path='/quizzes/timed/:quizId' element={<QuizPageTimed/>} />
          <Route path='/quiz-info/:quizId' element={<QuizInfo/>} />
          <Route path='/quiz-type-page/:quizId' element={<QuizTypePage/>} />
          <Route path='/played-games' element={<PlayedGames/>} />
          <Route path='/played-games/:playedGameId' element={<PlayedGame/>} />
          <Route path='/leaderboard' element={<LeaderboardPage/>} />
          <Route path='/leaderboard/:quizId' element={<QuizLeaderboard/>} />
          <Route path='/users/:userId' element={<UserPage/>} />
          <Route path='/friends' element={<FriendsPage/>} />
          <Route path='/blocked' element={<BlockedUsersPage/>} />
          <Route path='/groups' element={<Groups/>} />
          <Route path='/groups/:groupId' element={<GroupPage/>} />
          <Route path='/404' element={<PageNotFound/>} />

          <Route path='/test' element={<TestPage/>} />
          {role === USER_ROLES.creator && (
            <>
              <Route path='/create-quiz'  element={<CreateQuiz />} />
              <Route path='/create-question'  element={<CreateQuestionPage />} />
              <Route path='/create-answer'  element={<CreateAnswerPage />} />
            </>
          )}

          <Route path='/log-in'  element={<LogInPage />} />
          <Route path='/register'  element={<RegisterPage />} />
          <Route path='/edit-user'  element={<EditUserPage />} />
          <Route path='/store'  element={<Store />} />
          <Route path='/blocked'  element={<BlockedUsersPage />} />
        </Routes>
      </div>

      {!fullscreen && <Footer />}
      
      <ToastContainer
        position="bottom-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable={false}
        pauseOnHover={false}
        theme="light"
      />
    </BasicContext.Provider>

  );
}

export default App;
