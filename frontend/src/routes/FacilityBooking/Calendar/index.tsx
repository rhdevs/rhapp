import React from 'react'
import styled from 'styled-components'
import ButtonComponent from '../../../components/Button'
import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import { redirect } from '../../../store/route/action'
import VIEW_MY_BOOKINGS from '../../Routes'
import { useDispatch } from 'react-redux'

const TopContainer = styled.div`
  height: 10vh;
`

export default function Calendar() {
  const dispatch = useDispatch()
  return (
    <>
      <TopContainer>
        <TopNavBar title={'Calendar'} />
        <ButtonComponent
          state={'primary'}
          text={'Bookings'}
          onClick={(function (): void {
            dispatch(redirect(VIEW_MY_BOOKINGS))
          })}
        >
          Booking
        </ButtonComponent>
      </TopContainer>
      <BottomNavBar />
    </>
  )
}
