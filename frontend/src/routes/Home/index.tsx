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
        <Navigations>
          <Button onClick={onButtonClick}>Add an n! {sampleStateText}</Button>
          <br />
          <h3>Authentication Pages</h3>
          <Button
            onClick={() => {
              history.push('/login')
            }}
          >
            Login
          </Button>
          <Button
            onClick={() => {
              history.push('/profile')
            }}
          >
            Profile
          </Button>
          <Button
            onClick={() => {
              history.push('/changePassword')
            }}
          >
            Change Password
          </Button>
          <Button
            onClick={() => {
              history.push('/signup')
            }}
          >
            Sign Up
          </Button>

          <h3>Scheduling</h3>
          <Button
            onClick={() => {
              history.push('/schedule')
            }}
          >
            Schedule
          </Button>
          <Button
            onClick={() => {
              history.push('/schedule/share')
            }}
          >
            Share Timetable
          </Button>
          <Button
            onClick={() => {
              history.push('/schedule/events')
            }}
          >
            Event List
          </Button>
          <Button
            onClick={() => {
              history.push('/schedule/events/create')
            }}
          >
            Create Event
          </Button>

          <h3>Facility</h3>
          <Button
            onClick={() => {
              history.push('/facility')
            }}
          >
            Select Facility
          </Button>
          <Button
            onClick={() => {
              history.push('/facility/Upper%20Lounge')
            }}
          >
            View Facility
          </Button>
          <Button
            onClick={() => {
              history.push('/facility/booking/youreventId')
            }}
          >
            View one booking
          </Button>
          <Button
            onClick={() => {
              history.push('/facility/mybooking/youruserid')
            }}
          >
            View all your Bookings
          </Button>
          <Button
            onClick={() => {
              history.push('/facility/create')
            }}
          >
            Create Booking
          </Button>
          <br />
        </Navigations>
        <BottomNavBar />
      </MainContainer>
    </>
  )
}
