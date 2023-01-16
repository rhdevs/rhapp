import React from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import styled from 'styled-components'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'
import {
  resetTimeSelectorSelection,
  setSelectedEndTime,
  resetBookingFormInfo,
  handleEditBooking,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'

import LoadingSpin from '../../../components/LoadingSpin'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import BookingForm from '../../../components/FacilityBooking/BookingForm'

const Background = styled.div`
  background-color: #fff;
  min-height: 100vh;
  height: 100%;
  width: 100vw;
  display: flex;
  flex-direction: column;
`

/**
 *
 * @returns The page through which the user is able to edit their facility booking. (currently only booking name cannot be changed)
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
 *
 */
export default function EditBookingForm() {
  const dispatch = useDispatch()
  const history = useHistory()
  const params = useParams<{ bookingId: string }>()
  const { bookingId } = params

  const {
    isLoading,
    ccaList,
    bookingStartTime,
    selectedBookingToEdit,
    bookingEndTime,
    bookingFormName,
    bookingFormCCA,
    bookingFormDescription,
  } = useSelector((state: RootState) => state.facilityBooking)

  const onSubmit = (e) => {
    e.preventDefault()
    const ccaId = ccaList.find((cca) => cca.ccaName === bookingFormCCA)?.ccaID
    history.replace(PATHS.VIEW_ALL_FACILITIES)
    history.push(`${PATHS.VIEW_FACILITY}/${selectedBookingToEdit?.facilityID}`)
    dispatch(
      handleEditBooking(
        Number(bookingId),
        Number(selectedBookingToEdit?.facilityID),
        bookingFormName,
        bookingStartTime,
        bookingEndTime,
        ccaId,
        bookingFormDescription,
      ),
    )
    dispatch(resetBookingFormInfo())
  }

  const reselectBothDates = () => {
    dispatch(resetTimeSelectorSelection())
    history.push(
      `${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedBookingToEdit?.facilityID}/reselectExistingBooking`,
    )
  }

  const reselectStartDate = () => {
    reselectBothDates()
  }

  const reselectEndDate = () => {
    dispatch(setSelectedEndTime(0))
    history.push(
      `${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedBookingToEdit?.facilityID}/reselectExistingBooking`,
    )
  }

  const onLeftClick = () => {
    dispatch(resetBookingFormInfo())
    history.goBack()
  }

  return (
    <Background>
      {isLoading ? (
        <LoadingSpin />
      ) : (
        selectedBookingToEdit && (
          <>
            <TopNavBar title={`Edit ${selectedBookingToEdit.facilityName} Booking`} onLeftClick={onLeftClick} />
            <BookingForm
              type="edit"
              facilityId={selectedBookingToEdit.facilityID}
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
