import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import dummyAvatar from '../../../assets/dummyAvatar.svg'
import { useHistory } from 'react-router-dom'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import NoFriends from './NoFriends'
import 'antd/dist/antd.css'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../store/types'
import { fetchUserFriends } from '../../../store/profile/action'
import { useParams } from 'react-router-dom'
import { PATHS } from '../../Routes'

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
  const history = useHistory()
  const [hasFriends, setHasFriends] = useState(true)
  const dispatch = useDispatch()
  const { friends } = useSelector((state: RootState) => state.profile)

  const params = useParams<{ userId: string }>()
  const userIdFromPath = params.userId

  useEffect(() => {
    localStorage.setItem('userID', 'A1234567B')
    console.log(localStorage.getItem('userID'))
    dispatch(fetchUserFriends(localStorage.getItem('userID')))
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
              <FriendCard
                key={friend.userID}
                onClick={() => {
                  history.push(PATHS.PROFILE_PAGE + '/' + friend.userID)
                }}
              >
                {friend.profilePictureUrl ? (
                  <FriendAvatar
                    onClick={() => {
                      history.push(PATHS.PROFILE_PAGE + `${friend.userID}`)
                    }}
                    style={{ width: 85, borderRadius: 100 / 2 }}
                    src={friend.profilePictureUrl}
                  />
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
