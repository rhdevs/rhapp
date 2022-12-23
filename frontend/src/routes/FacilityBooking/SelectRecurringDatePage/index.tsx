import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PullToRefresh from 'pull-to-refresh-react'

import styled from 'styled-components'

import { onRefresh } from '../../../common/reloadPage'
import { PATHS } from '../../Routes'
import {
  fetchFacilityNameFromID,
  resetBooking,
  setBookingEndDate,
  setIsLoading,
  setSelectedFacility,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import { Calendar } from '../../../components/Calendar/Calendar'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'

const MainContainer = styled.div`
  width: 100%;
  height: 90vh;
  background-color: #fafaf4;
`

/**
 * # SelectRecurringDatePage
 * Path: `/facility/booking/create/recurring/selectEndDate/:facilityId`
 *
 * ## Page Description
 * SelectRecurringDatePage is accessible when user toggles weekly recurrence on in CreateBooking page
 * and tries to select a weekly booking end date. The page displays days in calendar format for user to select an end date.
 *
 * @remarks
 */
export default function SelectRecurringDatePage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityId: string }>()
  const { selectedFacilityId } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(resetBooking()) // TODO what is this
    dispatch(fetchFacilityNameFromID(parseInt(params.facilityId)))
    if (selectedFacilityId == 0) {
      dispatch(setSelectedFacility(parseInt(params.facilityId)))
    }
  }, [])

  const onDateClick = (date: Date) => {
    const selectedDate = date.getTime() / 1000

    if (Date.now() / 1000 <= selectedDate) {
      dispatch(setBookingEndDate(selectedDate))
      history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${params.facilityId}`)
    }
  }

  return (
    <>
      <TopNavBarRevamp
        title="Select Weekly Booking End Date"
        onLeftClick={() => history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${params.facilityId}`)}
      />
      <PullToRefresh onRefresh={onRefresh}>
        <MainContainer>
          <Calendar onDateClick={onDateClick} />
        </MainContainer>
      </PullToRefresh>
    </>
  )
}
