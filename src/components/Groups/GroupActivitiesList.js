import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { API_URL } from '../../config'
import { BasicContext } from '../../context/BasicContext'
import './GroupActivity.scss'
import GroupActivityItem from './GroupActivityItem'
 

const GroupActivitiesList = ({id}) => {
    const [data, setData] = useState(null)

    const {userData} = useContext(BasicContext)
    const {jwt} = userData

    useEffect(() => {
        let headers = {Authorization: `Bearer ${jwt}`}
        axios(`${API_URL}/group-activities?filters[group][id][$eq]=${id}&populate=user&sort=createdAt:desc`, {headers})
            .then(res => {
                setData(res.data.data)
            })

    }, [id, jwt])

    if (!data) {
        return ''
    }

  return (
    <div className='group-activity'>
        {data.map(activity => <GroupActivityItem key={activity.id} activity={activity} />)}
    </div>
  )
}

export default GroupActivitiesList