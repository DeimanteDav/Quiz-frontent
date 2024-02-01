import React, { useContext, useState } from 'react'
import { TextField } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { API_URL, IMG_URL } from '../../config';
import { BasicContext } from '../../context/BasicContext';

const RegistrationForm = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordError, setPasswordError] = useState(null)
    const [identifierError, setIdentifierError] = useState(null)
    let navigate = useNavigate()

    const ctx = useContext(BasicContext)
    
  const {setIsLoggedIn, setUserData, userData} = ctx


    const postPlayedGame = (gameData) => {
        axios.post(`${API_URL}/played-games`, {data: gameData}, {
            headers: {
              Authorization: `Bearer ${userData.jwt}`
            }
        })
            .then(res => {
                localStorage.removeItem('unregistered-game')
            })
            .catch(err => console.log(err))
    }
    
    const registerHandler = (e) => {
        e.preventDefault()
        setPasswordError(null)
        
        if (password !== confirmPassword) {
            setPasswordError(true)
            return
        }
        // TODO: email username alr taken error pasidaryti kitaip
        axios.post(`${API_URL}/auth/local/register`, {
            username,
            email,
            password
        })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setUsername('')
                    setEmail('')
                    setPassword('')
                    localStorage.setItem('qp-jwt', res.data.jwt)

                    localStorage.setItem('is-logged-in', JSON.stringify(true))
                    localStorage.setItem('user-id', res.data.user.id)
                    localStorage.setItem('user-data', JSON.stringify(res.data))

                    setIsLoggedIn(true)
                    setUserData(res.data)

                    navigate('/')
                    console.log(res);

                    if (localStorage.getItem('unregistered-game')) {
                        const unregisteredPlayedGame = JSON.parse(localStorage.getItem('unregistered-game'))
                        unregisteredPlayedGame.user.connect = [res.data.user.id]
                        postPlayedGame(unregisteredPlayedGame)
                    }
                }
            })
            .catch(error => {
                console.log(error);
                if (error?.response?.status === 500) {
                    console.log(error.config.data);
                    setIdentifierError(true)
                }
            })
    }

    

  return (
    <form onSubmit={registerHandler}>
        <TextField
            error={identifierError}
            label='Username'
            size='small'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
            error={identifierError}
            label='Email'
            size='small'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            helperText={identifierError && 'Username or Email taken'}
        />
        <TextField
            label='Password'
            size='small'
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

        <TextField
            error={passwordError}
            label='Confirm Password'
            size='small'
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            helperText={passwordError && 'Passwords do not match'}
        />
        
        <button type='submit' className='form-btn'>register</button>
    </form>
  )
}

export default RegistrationForm