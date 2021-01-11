import React from 'react'
import styled from 'styled-components'
import 'antd/dist/antd.css'
import EditDetailsCard from './EditDetailsCard'
import EditPersonalInfoContainer from '../Components/EditPersonalInfoContainer'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'

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

export default function EditProfile() {
  return (
    <>
      <MainContainer>
        <TopNavBar title={'Edit Profile'} />
        <ProfileComponent>
          <EditPersonalInfoContainer />
          <CardContainer>
            <EditDetailsCard />
          </CardContainer>
        </ProfileComponent>
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
