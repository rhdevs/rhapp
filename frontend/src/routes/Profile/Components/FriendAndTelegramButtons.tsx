import React, { useState } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import 'antd/dist/antd.css'
import { User } from '../../../store/profile/types'

const AddFriendButtonStyle = {
  size: 'large',
  backgroundColor: '#DE5F4C',
  borderColor: '#DE5F4C',
  width: '35vw',
  left: '5%',
  boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)',
  borderRadius: '8px',
}

const TelegramButtonStyle = {
  size: 'large',
  backgroundColor: '#DE5F4C',
  borderColor: '#DE5F4C',
  width: '35vw',
  left: '15%',
  boxShadow: '0px 2px 0px rgba(0, 0, 0, 0.043)',
  borderRadius: '8px',
}

const ButtonDiv = styled.div`
  position: relative;
  margin-left: 5vw;
  margin-top: 3vh;
  margin-bottom: 6vh;
`

export default function FriendAndTelegramButtons({ user }: { user: User }) {
  const [isFriend, setIsFriend] = useState(false)
  const handleFriendButtonClick = () => {
    setIsFriend(!isFriend)
  }

  return (
    <ButtonDiv>
      <Button type="primary" style={AddFriendButtonStyle} onClick={handleFriendButtonClick}>
        {isFriend ? 'Unfriend' : 'Add Friend'}
      </Button>
      <Button
        type="primary"
        style={TelegramButtonStyle}
        onClick={(e) => {
          e.preventDefault()
          window.location.href = 'https://t.me/' + user.telegramHandle
        }}
      >
        Telegram
      </Button>
    </ButtonDiv>
  )
}
