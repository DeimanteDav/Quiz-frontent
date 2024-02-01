import React, { useContext } from 'react'
import './Leaderboard.scss'
import { Link } from 'react-router-dom'
import { Paper, Skeleton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { BasicContext } from '../../context/BasicContext'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Leaderboard = ({headData, bodyData, displayQuiz = false}) => {
    const {userData} = useContext(BasicContext)
    const {user} = userData

    if (bodyData.length === 0) {
        return (
            <Stack className='leaderboard-wrapper' maxWidth={550}>
                <Skeleton variant='text' sx={{ margin: '30px 0'}} height={45} width={250}/>
                <Skeleton variant='rectangular' width={'100%'} height={300}/>
            </Stack>
        )
    }
 
  return (
    <div className='leaderboard-wrapper'>
        <Stack className='title' direction='row' alignItems='center' spacing={2}>
            <EmojiEventsIcon />
            <h2>Leaderboard</h2>
            <EmojiEventsIcon />
        </Stack>
        <TableContainer component={Paper} className='leaderboard-table'>
            <Table>
                <TableHead>
                    <TableRow className='head'>
                        {headData.map((data, i) => <TableCell key={i}>{data}</TableCell>)}
                    </TableRow>
                </TableHead>
                <TableBody className='body'>
                    {bodyData.map((quiz, i) => (
                        <TableRow key={i} className={`item ${user.id === quiz.user.id ? 'user': ''}`}>
                            <TableCell className='rank'>{i + 1}</TableCell>
                            <TableCell>
                                <Link to={`/users/${quiz.user.id}`}>{quiz.user.attributes.username}</Link>
                            </TableCell>
                            {displayQuiz && (
                                <TableCell>
                                    <Link to={`/leaderboard/${quiz.id}`}>{quiz.title}</Link>
                                </TableCell>
                            )}
                            <TableCell>
                                <span>{quiz.gameType.attributes.type}</span>
                            </TableCell>
                            <TableCell>
                                <span>{quiz.result}</span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    </div>
  )
}

export default Leaderboard