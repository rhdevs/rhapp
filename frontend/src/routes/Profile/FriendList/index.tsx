import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import dummyAvatar from '../../../assets/dummyAvatar.svg'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import NoFriends from './NoFriends'
import 'antd/dist/antd.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import { fetchUserFriends } from '../../../store/profile/action'

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

export default function FriendList() {
  const [hasFriends, setHasFriends] = useState(true)
  const dispatch = useDispatch()
  const { user, friends } = useSelector((state: RootState) => state.profile)

  useEffect(() => {
    dispatch(fetchUserFriends(user.userID))
  }, [dispatch])

  const handleSearch = () => {
    setHasFriends(!hasFriends)
  }

  return (
    <>
      <MainContainer>
        <TopNavBar title={'Friends'} />
        {friends.length !== 0 ? (
          friends.map((friend) => {
            return (
              <FriendCard key={friend.userID}>
                {friend.profilePictureUrl ? (
                  <FriendAvatar style={{ width: 85, borderRadius: 100 / 2 }} src={friend.profilePictureUrl} />
                ) : (
                  <FriendAvatar src={dummyAvatar} />
                )}
                <FriendLabels>
                  <FriendHeader>{friend.displayName}</FriendHeader>
                  <FriendSubHeader>{friend.telegramHandle}</FriendSubHeader>
                </FriendLabels>
              </FriendCard>
            )
          })
        ) : (
          <NoFriends handleSearch={handleSearch} />
        )}
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
