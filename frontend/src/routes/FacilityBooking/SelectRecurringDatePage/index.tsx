import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PullToRefresh from 'pull-to-refresh-react'

import { onRefresh } from '../../../common/reloadPage'
import {
  fetchFacilityNameFromID,
  resetBooking,
  setBookingEndDate,
  setSelectedFacility,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import { Calendar } from '../../../components/Calendar/Calendar'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'

import { MainCalendarContainer } from '../FacilityBooking.styled'

/**
 * # SelectRecurringDatePage
 * Path: `/facility/booking/create/recurring/selectEndDate/:facilityId`
 *
 * ## Page Description
 * SelectRecurringDatePage is accessible when user toggles weekly recurrence on in CreateBooking page
 * and tries to select a weekly booking end date. The page displays days in calendar format for user to select an end date.
 *
 * @remarks
 * // TODO redirect to edit page when come from edit page
 */
export default function SelectRecurringDatePage() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityId: string }>()
  const { selectedFacilityId, clickedDate } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
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
      history.goBack()
    }
  }

  return (
    <>
      <TopNavBarRevamp title="Select Weekly Booking End Date" onLeftClick={() => history.goBack()} />
      <PullToRefresh onRefresh={onRefresh}>
        <MainCalendarContainer>
          <Calendar onDateClick={onDateClick} clickedDate={clickedDate} monthsToShow={5} />
        </MainCalendarContainer>
      </PullToRefresh>
    </>
  )
}
