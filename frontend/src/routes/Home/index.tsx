import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import TopNavBar from '../../components/Mobile/TopNavBar'
import { getUpdateMockString } from '../../store/home/action'
import { RootState } from '../../store/types'
import BottomNavBar from '../../components/Mobile/BottomNavBar'
import { Button } from 'antd'
import 'antd/dist/antd.css'
import { PATHS } from '../Routes'
import SocialPostCard from '../../components/Mobile/SocialPostCard'
import HexagonNavigation from './HexagonNavigation'

const MainContainer = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fafaf4;
`
const Navigations = styled.div`
  padding-left: 23px;
`

export default function Home() {
  const dispatch = useDispatch()
  const { sampleStateText } = useSelector((state: RootState) => state.home)
  const history = useHistory()

  useEffect(() => {
    //do smth @ the start
  }, [dispatch])

  const onButtonClick = () => {
    dispatch(getUpdateMockString())
  }

  return (
    <>
      <TopNavBar title={'RHapp'} leftIcon />
      <MainContainer>
        <HexagonNavigation />
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
        </Navigations>
        <SocialPostCard
          title={'Hello'}
          dateTime={'Zhou Gou Gou, 8h ago'}
          description={
            'Hi I’m a RHapper! I like to eat cheese and fish. My favourite colour is black and blue. Please be my friend thank you!!!'
          }
        />
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
