import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { RootState } from '../store/types'
import BookingCard from './BookingCard'
import LoadingSpin from './LoadingSpin'
import TopNavBarRevamp from './TopNavBarRevamp'
import { useHistory } from 'react-router-dom'

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
  const history = useHistory()
  const { isLoading, conflictBookings } = useSelector((state: RootState) => state.facilityBooking)
  useEffect(() => {
    if (conflictBookings.length === 0) {
      history.goBack()
    }
  })

  return (
    <>
      <TopNavBarRevamp title={'View Conflicts'} />
      <MainContainer>{isLoading ? <LoadingSpin /> : <BookingCard bookings={conflictBookings} />}</MainContainer>
    </>
  )
}
