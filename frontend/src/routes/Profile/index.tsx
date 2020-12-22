import React, { useState } from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import DetailsCard from './Components/DetailsCard'
import PersonalInfoContainer from './Components/PersonalInfoContainer'
import EditProfileButton from './Components/EditProfileButton'
import FriendAndTelegramButtons from './Components/FriendAndTelegramButtons'
import TopNavBar from '../../components/Mobile/TopNavBar'
import BottomNavBar from '../../components/Mobile/BottomNavBar'

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #fafaf4;
`

const ProfileComponent = styled.div`
  background-color: #fafaf4;
  width: 100vw;
`

const CardContainer = styled.div`
  position: relative;
  width: 80vw;
  margin: 0 auto;
`

export default function Profile() {
  const [isOwnProfile, setIsOwnProfile] = useState(true)

  const handleClick = () => {
    setIsOwnProfile(!isOwnProfile)
  }

  return (
    <>
      <MainContainer>
        <TopNavBar title={'Profile'} />
        <ProfileComponent>
          <PersonalInfoContainer />
          {isOwnProfile ? (
            <EditProfileButton handleClick={handleClick} />
          ) : (
            <FriendAndTelegramButtons handleClick={handleClick} />
          )}
          <CardContainer>
            <DetailsCard />
          </CardContainer>
        </ProfileComponent>
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
