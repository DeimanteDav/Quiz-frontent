import React, { useEffect, useState } from 'react'
import Container from '../../components/Container'
import getBlockedUsers from '../../services/friendsHandlers/getBlockedUsers'
import BlockedUsers from '../../components/BlockedUsers/BlockedUsers'

const BlockedUsersPage = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    const getBlockedData = async () => {
      const blockedUsersData = await getBlockedUsers()
      setData(blockedUsersData)
    } 
    getBlockedData()
  }, [])

  return (
    <Container>
        <div className='blocked-users-page'>
          <BlockedUsers
            data={data}
            setData={setData}
          />
        </div>
    </Container>
  )
}

export default BlockedUsersPage