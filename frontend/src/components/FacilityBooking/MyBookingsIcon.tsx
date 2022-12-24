import React from 'react'
import { useHistory } from 'react-router-dom'
import { FormOutlined } from '@ant-design/icons'
import { PATHS } from '../../routes/Routes'

const MyBookingsIcon = () => {
  const history = useHistory()
  return (
    <FormOutlined
      style={{ color: 'black', fontSize: '150%' }}
      onClick={() => {
        history.push(`${PATHS.VIEW_MY_BOOKINGS}/${localStorage.getItem('userID')}`)
      }}
    />
  )
}

export default MyBookingsIcon
