import React, { useState } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import dummyAvatar from '../../../assets/dummyAvatar.svg'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import NoFriends from './NoFriends'
import 'antd/dist/antd.css'

const MainContainer = styled.div`
  width: 100vw;
  height: 95vh;
  background-color: #fafaf4;
  align-items: center;
`
const FriendCard = styled.div`
  cursor: pointer;
  background-color: #ffffff;
  margin: 23px;
  min-height: 70px;
  border-radius: 20px;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  display: flex;
`

const FriendAvatar = styled.img`
  padding: 20px;
`

const FriendHeader = styled.p`
  font-style: normal;
  font-weight: 600;
  font-size: 17px;
  line-height: 5px;
  color: #000000;
`

const FriendSubHeader = styled.p`
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 0px;
  color: #000000;
`

const FriendLabels = styled.div`
  align-self: center;
`

interface FriendInfo {
  friendId: number
  name: string
  telegram: string
}

const friendList: FriendInfo[] = [
  {
    friendId: 1,
    name: 'Zhou Maomao',
    telegram: '@zhoumm',
  },
  {
    friendId: 2,
    name: 'Zhou Gougou',
    telegram: '@woofwoof',
  },
]

export default function FriendList() {
  const [hasFriends, setHasFriends] = useState(false)

  const handleSearch = () => {
    setHasFriends(!hasFriends)
  }

  return (
    <>
      <MainContainer>
        <TopNavBar title="Friends" />
        {friendList.map((friend) => {
          return (
            <FriendCard key={friend.friendId}>
              <FriendAvatar src={dummyAvatar} />
              <FriendLabels>
                <FriendHeader>{friend.name}</FriendHeader>
                <FriendSubHeader>{friend.telegram}</FriendSubHeader>
              </FriendLabels>
            </FriendCard>
          )
        })}
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
