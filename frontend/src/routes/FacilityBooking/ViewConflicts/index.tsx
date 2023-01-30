import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { RootState } from '../../../store/types'
import BookingCard from '../../../components/BookingCard'
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

/**
 * # ViewConflict
 * Path: `facility/<TBD>` (see remarks)
 *
 * ## Page Description
 * This page is (supposed to be) accessed after the system detected a conflict in bookings \
 * For example, if CCA1 books a location at 12pm-2pm, and CCA2 tries to book the same location from 1pm-3pm \
 * a modal will appear, with a prompt to view conflict.
 * @returns TBD (see remarks)
 *
 * @remarks
 * Does not currently work, redirects to `/facility/booking/create/conflict/`
 */
export default function ViewConflict() {
  const history = useHistory()
  const { conflictBookings } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    conflictBookings.length === 0 && history.goBack()
  })

  return (
    <>
      <TopNavBarRevamp title="View Conflicts" />
      <MainContainer>
        <BookingCard bookings={conflictBookings} />
      </MainContainer>
    </>
  )
}
