import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import styled from 'styled-components'

import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { PATHS } from '../../Routes'

import {
  fetchAllCCAs,
  getFacilityList,
  setIsLoading,
  handleCreateNewBooking,
  setSelectedEndTime,
  resetTimeSelectorSelection,
  resetBookingFormInfo,
} from '../../../store/facilityBooking/action'
import { RootState } from '../../../store/types'
import { SearchMode } from '../../../store/facilityBooking/types'

import TopNavBar from '../../../components/Mobile/TopNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
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
 * # Create Booking Form
 * Path: `/facility/booking/create/:facilityId`
 *
 * ## Page Description
 * This page contains the booking form for creating a booking. \
 * Once the user selects the start and end time on the `CreateBookingDailyView` page, they will be directed to here
 *
 * @remarks
 *
 */
export default function CreateBookingForm() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    facilityList,
    isLoading,
    ccaList,
    bookingStartTime,
    bookingEndTime,
    bookingEndDate,
    searchMode,
    bookingFormName,
    bookingFormCCA,
    bookingFormDescription,
  } = useSelector((state: RootState) => state.facilityBooking)

  const params = useParams<{ facilityId: string }>()

  const selectedFacilityId = parseInt(params.facilityId)

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(fetchAllCCAs())
    facilityList.length === 0 && dispatch(getFacilityList())
  }, [dispatch])

  /**
   * @returns string of the facility's name
   */
  const getFacilityName = () => {
    return facilityList.find((facility) => facility.facilityID === Number(selectedFacilityId))?.facilityName
  }

  const onSubmit = (e) => {
    e.preventDefault()
    const ccaId = ccaList.find((cca) => cca.ccaName === bookingFormCCA)?.ccaID

    history.replace(PATHS.VIEW_ALL_FACILITIES)
    history.push(`${PATHS.VIEW_FACILITY}/${selectedFacilityId}`)
    dispatch(
      handleCreateNewBooking(
        Number(params.facilityId),
        bookingFormName,
        bookingStartTime,
        bookingEndTime,
        bookingEndDate === 0 ? bookingEndTime : bookingEndDate,
        ccaId,
        bookingFormDescription,
      ),
    )
    dispatch(resetBookingFormInfo())
  }

  /** when user goes back, reset user's time selections */
  const reselectBothDates = () => {
    dispatch(resetTimeSelectorSelection())
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}/reselect`)
  }

  /** currently the same as reselectBothDates */
  const reselectStartDate = () => {
    reselectBothDates()
  }

  /**  reselect end date only */
  const reselectEndDate = () => {
    dispatch(setSelectedEndTime(0))
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}/reselect`)
  }

  /** similar to reselectBothDates, but without the reselect in the url path to prevent infinite loop */
  const goBack = () => {
    dispatch(resetTimeSelectorSelection())
    history.push(`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}`)
  }

  const onLeftClick = () => {
    dispatch(resetBookingFormInfo())
    searchMode === SearchMode.BY_TIME ? history.push(PATHS.SEARCH_BY_TIME_BOOKING_RESULTS) : goBack()
  }

  return (
    <Background>
      <TopNavBar title={`Book ${getFacilityName()}`} onLeftClick={onLeftClick} />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <BookingForm
          type="create"
          facilityId={selectedFacilityId}
          startDateOnClick={reselectStartDate}
          endDateOnClick={reselectEndDate}
          submitOnClick={onSubmit}
        />
      )}
    </Background>
  )
}
