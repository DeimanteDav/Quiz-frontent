import React, { useContext, useState } from 'react'
import { FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, TextField } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { API_URL } from '../../config';
import { BasicContext } from '../../context/BasicContext';

const LogInForm = () => {
    const ctx = useContext(BasicContext)
    const {setIsLoggedIn, setUserData} = ctx
    
    const [identifier, setIdentifier] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    let navigate = useNavigate()

    const [showPassword, setShowPassword] = useState(false);
    const handleClickShowPassword = () => setShowPassword(!showPassword);
    const handleMouseDownPassword = () => setShowPassword(!showPassword);

    
    const logInHandler = (e) => {
        e.preventDefault()
        axios.post(`${API_URL}/auth/local`, {
            identifier,
            password
        })
            .then(res => {
                console.log(res);
                if (res.status === 200) {
                    setIdentifier('')
                    setPassword('')
                    localStorage.setItem('qp-jwt', res.data.jwt)
                    
                    localStorage.setItem('is-logged-in', JSON.stringify(true))
                    localStorage.setItem('user-id', res.data.user.id)
                    localStorage.setItem('user-data', JSON.stringify(res.data))

                    setIsLoggedIn(true)
                    setUserData(res.data)

                    setError(null)
                    navigate('/')
                }
            })
            .catch(error => {
                console.log(error);
                if (error.response.status === 500) {
                    setError(true)
                }
            })
    }

  return (
    <form onSubmit={logInHandler}>
        <TextField
            label='Email or Username'
            size='small'
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
        />
        <FormControl size='small' variant="outlined">
            <InputLabel htmlFor="password-input">Password</InputLabel>
            <OutlinedInput
                label='Password'
                id="password-input"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endAdornment= {
                    <InputAdornment
                    position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                        >
                            {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>

        <button type='submit' className='form-btn'>log in</button>
        {error && <span className='error'>Incorrect Email/Username or Password</span>}
    </form>
  )
}

export default LogInForm