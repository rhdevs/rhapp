import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PullToRefresh from 'pull-to-refresh-react'

import { onRefresh } from '../../../common/reloadPage'
import { PATHS } from '../../Routes'
import { resetTimeSelectorSelection } from '../../../store/facilityBooking/action'

import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { Calendar } from '../../../components/Calendar/Calendar'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import MyBookingsIcon from '../../../components/FacilityBooking/MyBookingsIcon'
import { setClickedDate } from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import { MainCalendarContainer } from '../FacilityBooking.styled'

/**
 * # Search Booking Date
 * Path: `/facility/selectDate`
 *
 * ## Page Description
 * Search Booking Date is accessable through the Facilities Landing Page. \
 * On Search Booking Date page, users will select the date which they want to search for available time slots.
 *
 * @remarks
 */
export default function SearchBookingDate() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { clickedDate } = useSelector((state: RootState) => state.facilityBooking)

  const onDateClick = (newClickedDate: Date) => {
    dispatch(resetTimeSelectorSelection())
    dispatch(setClickedDate(newClickedDate))
    history.push(PATHS.SEARCH_BOOKING_TIME)
  }

  return (
    <>
      <TopNavBarRevamp
        title="Select Starting Date"
        rightComponent={MyBookingsIcon()}
        onLeftClick={() => history.push(`${PATHS.FACILITY_LANDING_PAGE}`)}
      />
      <PullToRefresh onRefresh={onRefresh}>
        <MainCalendarContainer>
          <Calendar onDateClick={onDateClick} clickedDate={clickedDate} monthsToShow={5} />
          <BottomNavBar />
        </MainCalendarContainer>
      </PullToRefresh>
    </>
  )
}
