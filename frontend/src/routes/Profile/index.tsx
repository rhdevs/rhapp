import React, { useState } from 'react'
import styled from 'styled-components'
import { Tabs } from 'antd'
import 'antd/dist/antd.css'
import ActivitiesCard from './Components/ActivitiesCard'
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

const CustomTabs = styled(Tabs)`
  .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
    color: #363636 !important;
    font-weight: 500;
  }
  .ant-tabs-ink-bar {
    border-bottom: 2px solid #de5f4c;
  }
`

export default function Profile() {
  const [isOwnProfile, setIsOwnProfile] = useState(true)

  const handleClick = () => {
    setIsOwnProfile(!isOwnProfile)
  }

  const { TabPane } = Tabs

  function callback(key: string) {
    console.log(key)
  }

  const CardTabs = () => (
    <CustomTabs defaultActiveKey="1" centered onChange={callback}>
      <TabPane tab="Activities" key="1">
        <ActivitiesCard />
      </TabPane>
      <TabPane tab="Details" key="2">
        <DetailsCard />
      </TabPane>
    </CustomTabs>
  )

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
            <CardTabs />
          </CardContainer>
        </ProfileComponent>
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
