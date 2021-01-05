import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { getUpdateMockString } from '../../store/home/action'
import { RootState } from '../../store/types'
import { Button } from 'antd'
import 'antd/dist/antd.css'
import { PATHS } from '../Routes'
import { SearchOutlined } from '@ant-design/icons'
import AnnouncementCarousel from '../../components/Mobile/AnnouncementCarousel'
import HexagonNavigation from './components/HexagonNavigation'
import SocialSection from './components/SocialSection'
import BottomNavBar from '../../components/Mobile/BottomNavBar'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`
const Navigations = styled.div`
  padding-left: 23px;
`

const TopBar = styled.div`
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  width: 100%;
  height: 50px;
  background-color: #de5f4c;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 0px 0px 10px 10px;
  z-index: 999;
`

const Greetings = styled.text`
  font-size: 17px;
  color: #fff;
  font-weight: 100;
`

const TemporaryRoutes = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { sampleStateText } = useSelector((state: RootState) => state.home)

  const onButtonClick = () => {
    dispatch(getUpdateMockString())
  }

  return (
    <Navigations>
      <Button onClick={onButtonClick}>Add an n! {sampleStateText}</Button>
      <br />
      <h3>Authentication Pages</h3>
      <Button
        onClick={() => {
          history.push(PATHS.LOGIN_PAGE)
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.PROFILE_PAGE)
        }}
      >
        Profile
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.CHANGE_PASSWORD_PAGE)
        }}
      >
        Change Password
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.SIGNUP_PAGE)
        }}
      >
        Sign Up
      </Button>

      <h3>Scheduling</h3>
      <Button
        onClick={() => {
          history.push(PATHS.SCHEDULE_PAGE)
        }}
      >
        Schedule
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.SHARE_TIMETABLE_PAGE)
        }}
      >
        Share Timetable
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.EVENT_LIST_PAGE)
        }}
      >
        Event List
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.CREATE_EVENT)
        }}
      >
        Create Event
      </Button>

      <h3>Facility</h3>
      <Button
        onClick={() => {
          history.push(PATHS.FACILITY_BOOKING_MAIN)
        }}
      >
        Select Facility
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.VIEW_FACILITY)
        }}
      >
        View Facility
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.VIEW_FACILITY_BOOKING)
        }}
      >
        View one booking
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.VIEW_MY_BOOKINGS)
        }}
      >
        View all your Bookings
      </Button>
      <Button
        onClick={() => {
          history.push(PATHS.CREATE_FACILITY_BOOKING)
        }}
      >
        Create Booking
      </Button>
      <br />
      <div style={{ height: 100 }} />
    </Navigations>
  )
}

export default function Home() {
  const history = useHistory()

  const hours = new Date(Date.now()).getHours()
  const partOfTheDay = hours < 12 ? 'Morning' : hours < 18 ? 'Afternoon' : 'Evening'

  return (
    <MainContainer>
      <TopBar>
        <Greetings>{`Good ${partOfTheDay} Mao Mao,`}</Greetings>
        <SearchOutlined onClick={() => history.push(PATHS.SEARCH_PAGE)} style={{ fontSize: 25, color: '#fff' }} />
      </TopBar>
      <AnnouncementCarousel />
      <HexagonNavigation />
      <SocialSection />
      <h1>Temporary Routes</h1>
      <TemporaryRoutes />
      <BottomNavBar />
    </MainContainer>
  )
}
