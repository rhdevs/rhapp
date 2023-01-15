import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import { AutoComplete } from 'antd'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import ConflictBookingModal from '../ViewConflicts/ConflictBookingModal'
import {
  fetchAllCCAs,
  getFacilityList,
  setIsLoading,
  handleCreateNewBooking,
  setBookingStartTime,
  setBookingEndTime,
  setBookingEndDate,
  fetchSelectedFacility,
  setBookingFormName,
  setBookingFormCCA,
  setBookingFormDescription,
  resetTimeSelectorSelection,
  setSelectedEndTime,
  resetBookingFormInfo,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import InputField from '../../../components/Mobile/InputField'
import { Switch } from '../../../components/Switch'
import { BookingStatus } from '../../../store/facilityBooking/types'
import { unixToFullDate } from '../../../common/unixToFullDate'
import SelectableField from '../../../components/SelectableField'
import ButtonComponent from '../../../components/Button'
import { unixTo24HourTime } from '../../../common/unixTo24HourTime'
import BookingForm from '../../../components/FacilityBooking/BookingForm'

const Background = styled.div`
  background-color: #fff;
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
`

const Form = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 20px;
`

const WeeklyRecurrenceRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 10px 0;
  color: #666;
  align-items: center;
`
const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px 0;
`
const StyledTitle = styled.div`
  display: flex;
  font-family: Lato;
  color: #000;
  font-size: 15px;
  line-height: 30px;
  font-weight: bold;
  white-space: nowrap;
`
const CCAInput = styled(AutoComplete)`
  width: 100%;
  color: #000;
  &.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border-radius: 10px !important;
    border: 0;
    background-color: #f3f3f9;
  }
`

/**
 *
 * @returns The page through which the user is able to edit his facility booking.
 *
 * @example
 * ```
 * The user can edit the following through this page: \
 *  1: Facility \
 *  2: Name of Event \
 *  3: Start/End Date/Time \
 *  4: CCA \
 *  5: Description
 * ```
 *
 * @remarks
 * Might make more sense to allow editing of the start/end date/time only and disable other fields.
 * // TODO sus why is there a wierd timestamp 1644641028 below
 * // TODO consider using the same page as create booking form
 * // TODO does this allow unauthorised edit of booking, since one can modify the url to any booking id?
 *
 */
export default function EditBookingForm() {
  const dispatch = useDispatch()
  const history = useHistory()
  // const params = useParams<{ bookingId: string }>()
  // const { bookingId } = params

  const {
    facilityList,
    isLoading,
    ccaList,
    bookingStatus,
    bookingStartTime,
    selectedBooking, // TODO send data to form data
    bookingEndTime,
    bookingEndDate,
    bookingFormName,
    bookingFormCCA,
    bookingFormDescription,
  } = useSelector((state: RootState) => state.facilityBooking)

  // const [modalIsOpen, setmodalIsOpen] = useState<boolean>(false)
  // const [isWeeklyOn, setIsWeeklyOn] = useState<boolean>(false)

  // useEffect(() => {
  //   dispatch(fetchSelectedFacility(parseInt(bookingId)))
  // }, [dispatch])

  // const formIsValid = () => {
  //   return bookingFormName !== '' && bookingFormCCA !== '' && !(isWeeklyOn && bookingEndDate === 0)
  // }
  // useEffect(() => {
  //   dispatch(setIsLoading(true))
  //   dispatch(fetchAllCCAs())
  //   if (facilityList.length === 0) {
  //     dispatch(getFacilityList())
  //   }
  //   return () => {
  //     // dispatch(resetNewBooking) // TODO this function is defunct; newBooking is unused
  //   }
  // }, [dispatch])

  const onSubmit = (e) => {
    e.preventDefault()
    const ccaId = ccaList.find((cca) => cca.ccaName === bookingFormCCA)?.ccaID

    // if (!ccaId && ccaName !== 'Personal') {
    //   //selected cca is not valid (error)
    // } else {
    // handleSubmit((data) => {
    // console.log(data, ccaName)
    // if (bookingStatus === BookingStatus.CONFLICT) {
    //   setmodalIsOpen(true)
    // } else {
    history.replace(PATHS.VIEW_ALL_FACILITIES)
    history.push(`${PATHS.VIEW_FACILITY}/${selectedBooking?.facilityID}`)
    dispatch(
      handleCreateNewBooking(
        Number(selectedBooking?.facilityID),
        bookingFormName,
        bookingStartTime,
        bookingEndTime,
        bookingEndDate === 0 ? bookingEndTime : bookingEndDate,
        ccaId,
        bookingFormDescription,
      ),
    )
    dispatch(resetBookingFormInfo())
    // }
    // })()
    // }
  }

  const reselectBothDates = () => {
    console.log(selectedBooking)
    dispatch(resetTimeSelectorSelection())
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedBooking?.facilityID}/reselect`)
  }

  const reselectStartDate = () => {
    console.log(selectedBooking)
    reselectBothDates()
  }

  const reselectEndDate = () => {
    console.log(selectedBooking)
    dispatch(setSelectedEndTime(0))
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedBooking?.facilityID}/reselect`)
  }

  return (
    <Background>
      {isLoading ? (
        <LoadingSpin />
      ) : (
        selectedBooking && (
          <>
            <TopNavBar title={`Edit Booking for ${selectedBooking.facilityName}`} />
            <BookingForm
              facilityId={selectedBooking.facilityID}
              startDateOnClick={reselectStartDate}
              endDateOnClick={reselectEndDate}
              submitOnClick={onSubmit}
            />
          </>
        )
      )}
    </Background>
  )
}
