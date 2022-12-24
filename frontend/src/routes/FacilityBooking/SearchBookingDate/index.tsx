import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PullToRefresh from 'pull-to-refresh-react'

import { onRefresh } from '../../../common/reloadPage'
import { PATHS } from '../../Routes'
import { setIsLoading } from '../../../store/facilityBooking/action'

import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { Calendar } from '../../../components/Calendar/Calendar'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import MyBookingsIcon from '../../../components/FacilityBooking/MyBookingsIcon'
import { setClickedDate } from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import { MainCalendarContainer } from '../FacilityBooking.styled'

/**
 * # Select Time Page
 * Path: `/facility/selectTime`
 *
 * ## Page Description
 * Select Time Page is accessable through the Facilities Landing Page. On Select Time Page,
 * // TODO
 *
 * @remarks
 */
export default function SearchBookingDate() {
  const dispatch = useDispatch()
  const history = useHistory()
  const { clickedDate } = useSelector((state: RootState) => state.facilityBooking)

  const onDateClick = (newClickedDate: Date) => {
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
