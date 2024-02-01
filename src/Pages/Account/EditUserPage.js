import React, { useEffect, useState, useContext } from 'react'
import Container from '../../components/Container'
import './EditUserPage.scss'
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import KeyIcon from '@mui/icons-material/Key';
import LogOutButton from '../../components/Log-Register/LogOutButton';
import axios from 'axios';
import FormButton from '../../components/FormButton';
import { API_URL } from '../../config';
import { BasicContext } from '../../context/BasicContext';
import { TextField } from '@mui/material'
import PasswordInput from '../../components/PasswordInput';
import isUserLoggedIn from '../../services/isUserLoggedIn';

const EditUserPage = () => {
    isUserLoggedIn()
    const [tabValue, setTabValue] = useState(0)

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [deleteAccount, setDeleteAccount] = useState(false)

    const [userUpdated, setUserUpdated] = useState(false)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [passwordUpdated, setPasswordUpdated] = useState(false)
 
    const [errEmptyField, setErrEmptyField] = useState([])
    const [errWrongPassword, setErrWrongPassword] = useState(null)
    const [errPasswordsMatch, setErrPasswordsMatch] = useState(null)
    const [errSamePassword, setErrSamePassword] = useState(null)

    const ctx = useContext(BasicContext)
    const {userData, setUserData} = ctx


    useEffect(() => {
        if (userData) {
            setUsername(userData.user.username)
            setEmail(userData.user.email)
        }
    }, [userData])

    
    const updateUserInfoHandler = (e) => {
        e.preventDefault()

        axios.put(`${API_URL}/users/${userData.user.id}`, {
            username,
            email
        }, {
            headers: {
                Authorization: `Bearer ${userData.jwt}`
              }
        })
            .then(res => {
                if (res.status === 200) {
                    setUserUpdated(true)
                    setUserData(prevState=> {
                        let newState = {...prevState}
                        let {jwt, user} = newState
                        let newUser = {...user, username}
                        
                        let updatedData = {jwt, user: newUser}
                        localStorage.setItem('user-data', JSON.stringify(updatedData))
                        return updatedData
                    })
                }
            })
            .catch(err => console.log(err))
        }

    if (userUpdated) {
        setTimeout(() => {
            setUserUpdated(false)
        }, 5000);
    } 



    const updatePasswordHandler = (e) => {
        e.preventDefault()

        setErrEmptyField([])
        setErrPasswordsMatch(null)
        setErrWrongPassword(null)
        setErrSamePassword(null)
        
        if (!currentPassword) {
            setErrEmptyField(['1'])
        }
        if (!newPassword) {
            setErrEmptyField(prevState => [...prevState, '2'])
        }
        if (!confirmPassword) {
            setErrEmptyField(prevState => [...prevState, '3'])
            return
        }

        if (newPassword !== confirmPassword) {
            setErrPasswordsMatch(true) 
            return
        }
        if (currentPassword === newPassword) {
            setErrSamePassword(true)
            return
        }

        axios.post(`${API_URL}/auth/change-password`, {
            currentPassword,
            password: newPassword,
            passwordConfirmation: confirmPassword           
        }, {
            headers: {
                Authorization: `Bearer ${userData.jwt}`
              }
        })
            .then(res => {
                if (res.status === 200) {
                    setCurrentPassword('')
                    setNewPassword('')
                    setConfirmPassword('')
                    setPasswordUpdated(true)
                }
                console.log(res);
            })
            .catch(err => {
                console.log(err)
                if (err.response.status === 500) {
                    setErrWrongPassword(true)
                }
            })
    }
    
    if (passwordUpdated) {
        setTimeout(() => {
            setPasswordUpdated(false)
        }, 5000);
    }


    let tab = ''
    switch (tabValue) {
        case 0:
            tab = (
                <div className='user-info'>
                    <h1>Account Settings</h1>
                    <form className='user-info-form' onSubmit={updateUserInfoHandler}>
                        <TextField 
                            type='text'
                            size='small'
                            variant='standard'
                            helperText='Username'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <TextField 
                            type='text'
                            // label='email'
                            size='small'
                            variant='standard'
                            helperText='Email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <FormButton buttonText='Update' />
                    </form>
                    {userUpdated && <span>User successfully Updated</span>}
                </div>
            )
            break;
        case 1:
            tab = (
                <div className='change-password' onSubmit={updatePasswordHandler}>
                    <h1>Create a New Password</h1>

                    <form className='change-password-form'>
                        <PasswordInput
                            label='Current Password'
                            value={currentPassword}
                            setValue={setCurrentPassword} 
                            error={errEmptyField.includes('1') || errWrongPassword}
                            errorMsg={errWrongPassword && 'Your current password is incorrect'}
                        />
                        <PasswordInput
                            label='New Password'
                            value={newPassword}
                            setValue={setNewPassword} 
                            error={errEmptyField.includes('2') || errPasswordsMatch}
                        />
                        <PasswordInput
                            label='Confirm Password'
                            value={confirmPassword}
                            setValue={setConfirmPassword} 
                            error={errEmptyField.includes('3') || errPasswordsMatch}
                        />

                        {errEmptyField.length > 0 && <span className='error'>Some of the fields are empty</span>}

                        {errPasswordsMatch && <span className='error'>Passwords do not match</span>}

                        {errSamePassword && <span className='error'>Your new password cannot be the same as your old password</span>}

                        <FormButton buttonText='Update' />
                    </form>
                    {passwordUpdated && <span>Password successfully updated</span>}
                </div>
            )
            break;
        
        default:
            break;
    }


  return (
    <Container>
        <div className='edit-user-wrapper'>
            <form className='edit-user-menu'>
                <ul>
                    <li onClick={() => setTabValue(0)} className={tabValue === 0 ? 'active' : ''}>
                        <AccountBoxIcon/>
                        <span>Account Details</span>
                    </li>
                    <li onClick={() => setTabValue(1)} className={tabValue === 1 ? 'active' : ''}>
                        <KeyIcon/>
                        <span>Change Password</span>
                    </li>

                    <li onClick={() => setTabValue(2)} className={tabValue === 2 ? 'active' : ''}>
                        <LogOutButton/>
                    </li>
                </ul>
            </form>

            {tab}
        </div>
    </Container>
  )
}

export default EditUserPage