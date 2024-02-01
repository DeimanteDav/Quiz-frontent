import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'
import { Box, IconButton, List, TextField  } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear';
import CircularProgress from '@mui/material/CircularProgress';
import FindFriendsItem from './FindFriendsItem'


const FindFriends = ({title, friendships, setRequestIsSent, groupData}) => {
    const [searchResult, setSearchResult] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(null)

    const {userData} = useContext(BasicContext)
    const {jwt, user} = userData

    useEffect(() => {
        if (input) {
            setIsLoading(true)
            const delayDebounceFn = setTimeout(() => {
              const headers = {Authorization: `Bearer ${jwt}` }

                const url = `${API_URL}/users?filters[$or][0][username][$containsi]=${input}&filters[$or][1][email][$containsi]=${input}&filters[$and][2][id][$nei]=${user.id}${groupData ? `&populate=groupMembers.group` : ''}`

                axios(url, {headers})
                    .then(res => {
                        setIsLoading(false)
                        const searchResult = res.data
                        console.log(res);

                        if (groupData) {
                            const filteredUsers = searchResult.filter(user => (
                                user.groupMembers.every(memberData => {
                                    console.log(memberData);
                                    return memberData.group.id !== Number(groupData.groupId)
                        })
                            ))
                            setSearchResult(filteredUsers.length > 0 ? filteredUsers : null)
                        } else {
                            const filteredUsers = searchResult.filter(user => (
                                friendships.every(friend => (
                                    user.id !== friend.user.id
                                ))
                            ))
    
    
                       
                            setSearchResult(filteredUsers.length > 0 ? filteredUsers : null)
                            setRequestIsSent(false)
                        }

                    })
            }, (2000))
        
            return () => clearTimeout(delayDebounceFn)
        } else {
            setSearchResult([])
        }
    }, [input, jwt, user.id])


  return (
    <div className='find-friends'>
       <h2>{title ? title : 'Find Friends'}</h2>
        <TextField
            className='input'
            size='small'
            label='Type in username or email'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            InputProps={{
                endAdornment: (
                    <IconButton onClick={() => setInput('')}>
                        <ClearIcon />
                    </IconButton>
                ),
            }}
        />

        {isLoading ? (
            <Box sx={{ display: 'flex', minHeight: '200px', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        ) : (
            <>
            {searchResult ? (
                <List className='list'>
                    {searchResult.map(user => (
                        <FindFriendsItem user={user} setRequestIsSent={setRequestIsSent} groupData={groupData} />
                    ))}
                </List>
            ) : (
                <span>Nothing matches your search</span>
            )}
            </>
        )}
    </div>
  )
}

export default FindFriends