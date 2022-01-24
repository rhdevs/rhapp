import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useParams, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../store/types'
import { PATHS } from '../routes/Routes'
import { DOMAIN_URL, ENDPOINTS } from '../store/endpoints'
import { months, days } from '../common/dates'
import { get24Hourtime } from '../common/get24HourTime'
import { openUserTelegram } from '../common/telegramMethods'
import { onRefresh } from '../common/reloadPage'
import TopNavBar from './Mobile/TopNavBar'
import BookingCard from './BookingCard'
import PullToRefresh from 'pull-to-refresh-react'
import LoadingSpin from './LoadingSpin'
import {
  createNewBookingFromFacility,
  fetchFacilityNameFromID,
  getAllBookingsForFacility,
  SetIsLoading,
  setViewDates,
  setSelectedFacility,
} from '../store/facilityBooking/action'

const MainContainer = styled.div`
  width: 100%;
  height: 95vh;
  background-color: #fafaf4;
  position: fixed;
  top: 70px;
  overflow: scroll;
  padding-bottom: 50px;
`

export default function ViewConflict() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityID: string }>()
  const {
    ViewStartDate,
    ViewEndDate,
    createSuccess,
    createFailure,
    isLoading,
    facilityBookings,
    selectedFacilityName,
    selectedFacilityId,
  } = useSelector((state: RootState) => state.facilityBooking)
  useEffect(() => {
    dispatch(SetIsLoading(true))
    dispatch(fetchFacilityNameFromID(parseInt(params.facilityID)))
    dispatch(getAllBookingsForFacility(ViewStartDate, ViewEndDate, parseInt(params.facilityID)))
    if (selectedFacilityId == 0) {
      dispatch(setSelectedFacility(parseInt(params.facilityID)))
    }
    return () => {
      dispatch(setViewDates(new Date(), parseInt(params.facilityID)))
    }
  }, [])

  return (
    <>
      <TopNavBar title={'View Conflicts'} />
      <PullToRefresh onRefresh={onRefresh}>
        <MainContainer>
          {!isLoading && <BookingCard></BookingCard>}
          {isLoading && <LoadingSpin />}
        </MainContainer>
      </PullToRefresh>
    </>
  )
}
