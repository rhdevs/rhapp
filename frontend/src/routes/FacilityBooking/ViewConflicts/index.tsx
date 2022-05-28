import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { RootState } from '../../../store/types'
import BookingCard from '../../../components/BookingCard'
import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'

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
    conflictBookings.length === 0 && history.goBack()
  })

  return (
    <>
      <TopNavBarRevamp title={'View Conflicts'} />
      <MainContainer>{isLoading ? <LoadingSpin /> : <BookingCard bookings={conflictBookings} />}</MainContainer>
    </>
  )
}
