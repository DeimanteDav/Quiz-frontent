import { List } from '@mui/material'
import GroupItem from './GroupItem'
import './GroupsList.scss'

const GroupsList = ({groups}) => {
  if (groups.lenth < 0) {
    return <span>You aren't a part of any group</span>
  }

  return (
    <List className='groups-list'>
      {groups.map(group => (
        <GroupItem key={group.id} group={group} />
      ))}
    </List>
  )
}

export default GroupsList