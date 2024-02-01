import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Container from '../../components/Container'
import getGameTypes from '../../services/getGameTypes'
import './QuizTypePage.scss'
import LockIcon from '@mui/icons-material/Lock';
import Tooltip from '@mui/material/Tooltip';
import axios from 'axios'
import { API_URL, GAME_TYPES } from '../../config'
import { BasicContext } from '../../context/BasicContext'
import { Skeleton, Stack } from '@mui/material'
import BuyGame from '../../components/Quiz/BuyGame'

const QuizTypePage = () => {
    const {quizId}  = useParams()
    const [types, setTypes] = useState([])

    const [typeClicked, setTypeClicked] = useState(false)
    const [typeData, setTypeData] = useState(null)
    const [unlockedGames, setUnlockedGames] = useState(null)
    const [unlockedTypes, setUnlockedTypes] = useState(null)

    const [boughtGame, setBougthGame] = useState(null)

    const navigate = useNavigate()

    const {userData} = useContext(BasicContext)
    const {jwt} = userData

    useEffect(() => {
        const headers = {
            Authorization: `Bearer ${userData.jwt}`
        }
        async function getData() {
            setTypes(await getGameTypes())
        }
        getData()

        axios.get(`${API_URL}/unlocked-games?filters[user][id][$eq]=${userData.user.id}&populate=*`, {headers})
            .then(res => {
                if (res.status === 200) {
                    let arr = res.data.data
                    let filteredArr = arr.filter(game => {
                        let gameObj = game.attributes
                        return gameObj.quiz.data.id === Number(quizId)
                    })
                    setUnlockedGames(filteredArr)
                }
            })
        
        if (!typeClicked) {
            setTypeData(null)
        }
    }, [typeClicked, userData, quizId])


    useEffect(() => {
        if (unlockedGames) {
            let filter = types.filter(type => (
                unlockedGames.some(unlockedGame => (
                    unlockedGame.attributes.gameType.data.id === type.id
                ))
            ))
            setUnlockedTypes(filter)
        }
    }, [types, unlockedGames])


    let typesArray = Object.keys(GAME_TYPES)
    if (!unlockedTypes) {
        return (
            <Container>
                <Stack spacing={1} className='skeleton' sx={{ marginTop: '20px' }}>
                    <Skeleton variant='text' sx={{ fontSize: '3rem' }} width={200}/>

                    <Stack spacing={0} sx={{ paddingLeft: '20px' }}>
                        {typesArray.map(type => (
                            <Skeleton key={type} variant='text' sx={{ fontSize: '2rem' }} width={150} height={70}/>
                        ))}
                    </Stack>
                </Stack>
            </Container>
        )
    }

    const handleClick = (data) => {
        if (unlockedTypes.includes(data) || data.id === GAME_TYPES.standard) {
            return
        }
        setTypeClicked(true)
        setTypeData(data)
    }
 
    const unlockGames = () => {
        const headers = {Authorization: `Bearer ${jwt}`}
        axios.post(`${API_URL}/unlocked-games`, {
            data: {
                quiz: {
                    connect: [quizId]
                },
                gameType: {
                    connect: [typeData.id]
                },
                user: {
                    connect: [userData.user.id]
                }
            }
        }, {headers})
        .then(res => {
            console.log(res);
            if (res.status === 200) {
                
                setBougthGame(true)
            }
        })
        .catch(err => console.log(err))
    }
  

    const startGameHandler = () => {
        setTypeClicked(false)
        setTypeData(null)
        navigate(typeData.id === 3 ? `/quizzes/timed/${quizId}?type=${typeData.id}` : `/quizzes/${quizId}?type=${typeData.id}`)
    }


  return (
    <Container>
        <div className='quiz-type-page'>
       
            <div className='quiz-types-wrapper'>
                <h1>Type of Quiz</h1>
                <ul className='quiz-types'>
                    {types.map(type => (
                        <li 
                            className={`quiz-type`}
                            key={type.id}
                            onClick={() => handleClick(type)}
                        >
                            {(type.id === GAME_TYPES.standard || unlockedTypes.includes(type)) ? (
                                <Link
                                    className='text'
                                    to={type.id === 3 ? `/quizzes/timed/${quizId}?type=${type.id}` : `/quizzes/${quizId}?type=${type.id}`}
                                >{type.attributes.type}</Link>
                            ) : (
                                <>
                                    <div className='text'>{type.attributes.type}</div>
                                    <Tooltip placement='right' title='You do not have acces to this type'>
                                        <LockIcon className='lock-icon'/>
                                    </Tooltip>
                                </>
                            )}
                        </li>
                    ))}
                </ul>
            </div>


           <BuyGame
                clicked={typeClicked}
                setClicked={setTypeClicked}
                boughtGame={boughtGame}
                typeData={typeData}
                onStartGame={startGameHandler}
                buyItem={unlockGames}
            />
           
        </div>

    </Container>
  )
}

export default QuizTypePage