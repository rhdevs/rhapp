import React from 'react'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import DetailsCard from './Components/DetailsCard'
import PersonalInfoContainer from './Components/PersonalInfoContainer'
import EditProfileButton from './Components/EditProfileButton'

const MainContainer = styled.div`
  height: 100vh;
  width: 100vw;
  background-color: #fafaf4;
`

const ProfileComponent = styled.div`
  background-color: #fafaf4;
  height: 30vh;
  width: 100vw;
  padding-top: 3vh;
`

const CardContainer = styled.div`
  position: relative;
  width: 80vw;
  margin: 0 auto;
`

const AvatarSpan = styled.span`
  background-color: #f6e6df;
  display: inline-block;
  margin-left: 10vw;
  height: 30vh;
  width: 35vw;
  vertical-align: middle;
`

const PersonalInfoSpan = styled.span`
  display: inline-block;
  height: 30vh;
  width: 45vw;
  vertical-align: middle;
  padding-left: 3vw;
`

export default class Profile extends React.Component {
  render() {
    return (
      <MainContainer>
        <div style={{ marginLeft: '30vw' }}>TOPNAVBAR HERE</div>
        <ProfileComponent>
          <AvatarSpan>
            <p>IMAGE HERE</p>
          </AvatarSpan>
          <PersonalInfoSpan>
            <PersonalInfoContainer />
          </PersonalInfoSpan>
          <EditProfileButton />
          <CardContainer>
            <DetailsCard />
          </CardContainer>
        </ProfileComponent>
        <BottomNavBar />
      </MainContainer>
    )
  }
}
