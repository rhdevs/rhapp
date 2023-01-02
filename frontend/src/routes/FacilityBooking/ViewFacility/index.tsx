import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PullToRefresh from 'pull-to-refresh-react'

import { Alert } from 'antd'
import styled from 'styled-components'
import { FormOutlined } from '@ant-design/icons'

import { onRefresh } from '../../../common/reloadPage'
import { PATHS } from '../../Routes'
import {
  fetchFacilityNameFromID,
  resetBooking,
  setBookingStatus,
  setIsLoading,
  setSelectedFacility,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import BottomNavBar from '../../../components/Mobile/BottomNavBar'
import { Calendar } from '../../../components/Calendar/Calendar'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import { setClickedDate } from '../../../store/calendar/actions'
import { BookingStatus } from '../../../store/facilityBooking/types'
import ConflictBookingModal from '../ViewConflicts/ConflictBookingModal'

const AlertGroup = styled.div`
  padding: 3px 23px 3px 23px;
`

const MainContainer = styled.div`
  width: 100%;
  height: 90vh;
  background-color: #fafaf4;
`
/**
 * # ViewFacility
 * Path: `facility/monthView/:facilityId`
 *
 * ## Page Description
 * This page is accessed after the user clicks on a facility from the Facilities page \
 * The selected facility [e.g. Main Area (UL)] be selected, showing the available dates (i.e. calendar) to book
 * @returns A calendar of available dates to book
 */
export default function ViewFacility() {
  const [modalIsOpen, setModalIsOpen] = useState<boolean>(false)
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ facilityId: string }>()
  const { selectedFacilityName, selectedFacilityId, bookingStatus, bookingErrorMessage } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(resetBooking())
    dispatch(fetchFacilityNameFromID(parseInt(params.facilityId)))
    if (selectedFacilityId === 0) {
      dispatch(setSelectedFacility(parseInt(params.facilityId)))
    }
  }, [])

  const MyBookingsIcon = (
    <FormOutlined
      style={{ color: 'black', fontSize: '150%' }}
      onClick={() => {
        history.push(`${PATHS.VIEW_MY_BOOKINGS}/${localStorage.getItem('userID')}`)
      }}
    />
  )

  const onDateClick = (newClickedDate: Date) => {
    dispatch(setClickedDate(newClickedDate))
    history.push(`${PATHS.VIEW_FACILITY_BOOKING_DAILY_VIEW}/${params.facilityId}`)
  }

  useEffect(() => {
    if (bookingStatus === BookingStatus.SUCCESS) closeAlertDelay(5)
    /* if FAILURE, don't close alert automatically and let the user close it */
    if (bookingStatus === BookingStatus.CONFLICT) setModalIsOpen(true)
  }, [bookingStatus])

  /**
   * Closes the alert after a specified number of seconds
   * @param seconds number of seconds to delay before closing alert
   */
  async function closeAlertDelay(seconds: number) {
    await new Promise((resolve) =>
      setTimeout(() => resolve(dispatch(setBookingStatus(BookingStatus.INITIAL))), seconds * 1000),
    )
  }

  const SuccessAlertSection = () => (
    <Alert message="Successful" description="Yay yippe doodles" type="success" closable showIcon />
  )
  const FailureAlertSection = () => (
    <Alert
      message="Not Successful Boohoo :-("
      description={bookingErrorMessage}
      type="error"
      closable
      showIcon
      onClose={() => dispatch(setBookingStatus(BookingStatus.INITIAL))}
    />
  )

  const AlertSection = () => {
    return (
      <AlertGroup>
        {bookingStatus === BookingStatus.SUCCESS && <SuccessAlertSection />}
        {bookingStatus === BookingStatus.FAILURE && <FailureAlertSection />}
      </AlertGroup>
    )
  }

  return (
    <>
      <TopNavBarRevamp
        title={selectedFacilityName}
        rightComponent={MyBookingsIcon}
        onLeftClick={() => history.push(`${PATHS.FACILITY_BOOKING_MAIN}`)}
      />
      <PullToRefresh onRefresh={onRefresh}>
        <AlertSection />
        <MainContainer>
          <Calendar selectedFacilityId={parseInt(params.facilityId)} onDateClick={onDateClick} />
          <BottomNavBar />
        </MainContainer>
      </PullToRefresh>
      <ConflictBookingModal modalOpen={modalIsOpen} setModalOpen={setModalIsOpen} />
    </>
  )
}
