import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { RootState } from '../store/types'
import BookingCard from './BookingCard'
import LoadingSpin from './LoadingSpin'
import TopNavBarRevamp from './TopNavBarRevamp'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #ffffff;
  position: fixed;
  top: 70px;
  overflow: scroll;
  padding-bottom: 50px;
`

export default function ViewConflict() {
  const { isLoading, conflictBookings } = useSelector((state: RootState) => state.facilityBooking)

  return (
    <>
      <TopNavBarRevamp title={'View Conflicts'} />
      <MainContainer>{isLoading ? <LoadingSpin /> : <BookingCard bookings={conflictBookings} />}</MainContainer>
    </>
  )
}
