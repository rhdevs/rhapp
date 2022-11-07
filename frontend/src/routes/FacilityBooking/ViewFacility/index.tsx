import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import PullToRefresh from 'pull-to-refresh-react'

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
// import { ToastContainer, toast } from 'react-toastify'
// import 'react-toastify/dist/ReactToastify.css'

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
  const { selectedFacilityName, selectedFacilityId, bookingStatus } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(resetBooking())
    dispatch(fetchFacilityNameFromID(parseInt(params.facilityId)))
    if (selectedFacilityId == 0) {
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
    if (bookingStatus === BookingStatus.SUCCESS) {
      dispatch(setBookingStatus(BookingStatus.INITIAL))
      console.log('sucessssssssss')
      // TODO show a toast notification to inform of success booking
      // toast.success('Booking was Successfull !', {
      //   position: 'bottom-right',
      //   autoClose: 3000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      //   theme: 'light',
      // })
    }
    if (bookingStatus === BookingStatus.CONFLICT) {
      setModalIsOpen(true)
    }
  }, [bookingStatus])

  return (
    <>
      <TopNavBarRevamp
        title={selectedFacilityName}
        rightComponent={MyBookingsIcon}
        onLeftClick={() => history.push(`${PATHS.FACILITY_BOOKING_MAIN}`)}
      />
      <PullToRefresh onRefresh={onRefresh}>
        <MainContainer>
          <Calendar selectedFacilityId={parseInt(params.facilityId)} onDateClick={onDateClick} />
          <BottomNavBar />
        </MainContainer>
      </PullToRefresh>
      <ConflictBookingModal modalOpen={modalIsOpen} setModalOpen={setModalIsOpen} />
      {/* <ToastContainer /> */}
    </>
  )
}
