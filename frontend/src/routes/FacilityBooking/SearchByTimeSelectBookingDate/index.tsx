import React, { useEffect } from 'react'
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
 * # Search By Time Select Booking Date
 * Path: `/facility/searchByTime/selectDate`
 *
 * ## Page Description
 * This page is accessable through the Facilities Landing Page. \
 * On this page, users will select the date which they want to search for available time slots.
 *
 * @remarks
 */
export default function SearchByTimeSelectBookingDate() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { clickedDate } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(setClickedDate(new Date())) // Set the default date to today
  }, [])

  const onDateClick = (newClickedDate: Date) => {
    dispatch(resetTimeSelectorSelection())
    dispatch(setClickedDate(newClickedDate))
    history.push(PATHS.SEARCH_BY_TIME_SELECT_BOOKING_TIME)
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
