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
export default function EditBooking() {
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
    dispatch(
      handleCreateNewBooking(
        Number(selectedBooking?.facilityID),
        'eventName',
        bookingStartTime,
        bookingEndTime,
        bookingEndTime,
        ccaId,
        'description',
      ),
    )
    // }
    // })()
    // }
  }

  // useEffect(() => {
  //   if (bookingStatus === BookingStatus.SUCCESS) {
  //     history.replace(PATHS.VIEW_ALL_FACILITIES)
  //     history.push(`${PATHS.VIEW_FACILITY}/${selectedBooking?.facilityID}`)
  //   } else if (bookingStatus === BookingStatus.CONFLICT) {
  //     setmodalIsOpen(true)
  //   }
  // }, [bookingStatus])

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
              // defaultEventName={selectedBooking.eventName}
              // defaultCCA={selectedBooking.ccaName}
              // defaultDescription={selectedBooking.description}
              // startDateOnClick={}
              // endDateOnClick={}
              submitOnClick={onSubmit}
            />
            {/* <Form onSubmit={onSubmit}>
              <InputField
                title="Event Name"
                placeholder="Event Name"
                required
                defaultValue={selectedBooking.eventName}
                onChange={(e) => dispatch(setBookingFormName(e.target.value))}
                // errors={errors.eventName}
              />
              <SelectableField
                title="Start"
                value={
                  bookingStartTime === 0
                    ? ''
                    : unixToFullDate(bookingStartTime) + ' at ' + unixTo24HourTime(bookingStartTime)
                }
                isCompulsory
                onClick={() => dispatch(setBookingStartTime(1644641028))}
              />
              <SelectableField
                title="End"
                value={
                  bookingEndTime === 0 ? '' : unixToFullDate(bookingEndTime) + ' at ' + unixTo24HourTime(bookingEndTime)
                }
                isCompulsory
                onClick={() => dispatch(setBookingEndTime(1644648228))}
              />
              <Container>
                <StyledTitle>CCA</StyledTitle>
                <CCAInput
                  options={ccaList.concat({ ccaID: 0, ccaName: 'Personal', category: 'Personal' }).map((cca) => ({
                    value: cca.ccaName,
                  }))}
                  value={selectedBooking.ccaName}
                  placeholder="CCAs"
                  onChange={(value) => dispatch(setBookingFormCCA(value))}
                  filterOption={(inputValue, option) =>
                    option?.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
                  }
                  notFoundContent="No Matching CCAs"
                  allowClear
                />
              </Container>
              <InputField
                title="Description"
                placeholder="Tell us what your booking is for!"
                textArea
                defaultValue={selectedBooking.description}
                onChange={(e) => dispatch(setBookingFormDescription(e.target.value))}
                // errors={errors.description}
              />
              <WeeklyRecurrenceRow>
                <StyledTitle>Weekly Recurrence</StyledTitle>
                <Switch isOn={isWeeklyOn} handleToggle={() => setIsWeeklyOn(!isWeeklyOn)} switchSize={50} />
              </WeeklyRecurrenceRow>
              {isWeeklyOn && (
                <SelectableField
                  title="End Date"
                  value={bookingEndDate == 0 ? '' : unixToFullDate(bookingEndDate)}
                  isCompulsory
                  onClick={() => dispatch(setBookingEndDate(1644648228))}
                />
              )}
              <ConflictBookingModal modalOpen={modalIsOpen} setModalOpen={setmodalIsOpen} />
              <ButtonComponent
                state="primary"
                text="Submit"
                type="submit"
                disabled={!formIsValid()}
                onClick={() => console.log('submitted')}
              />
            </Form> */}
          </>
        )
      )}
    </Background>
  )
}
