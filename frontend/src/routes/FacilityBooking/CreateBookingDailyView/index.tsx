import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import {
  editBookingCCA,
  editBookingDescription,
  editBookingFromDate,
  editBookingName,
  editBookingToDate,
  fetchAllCCAs,
  getFacilityList,
  handleCreateBooking,
  resetCreateBookingSuccessFailure,
  resetNewBooking,
  setIsLoading,
  setNewBookingFacilityName,
  setSelectedFacility,
  setBookingRepeat,
} from '../../../store/facilityBooking/action'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import BookingSection from '../../../components/FacilityBooking/BookingSection'

const Background = styled.div`
  background-color: #fff;
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 36px;
`

const BookingSectionDiv = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
`

export default function CreateBookingDailyView() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    newBooking,
    newBookingCCA,
    newBookingDescription,
    newBookingFacilityName,
    newBookingFromDate,
    newBookingToDate,
    facilityList,
    isLoading,
    createBookingError,
    createSuccess,
    createFailure,
    newBookingFacilityId,
  } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    dispatch(setIsLoading(true))
    if (newBooking) {
      dispatch(editBookingFromDate(new Date(newBooking.startTime * 1000)))
      dispatch(editBookingToDate(new Date(newBooking.endTime * 1000)))
      dispatch(editBookingDescription(newBooking.description))
      dispatch(editBookingName(newBooking.eventName))
      dispatch(editBookingCCA(newBooking.ccaName ? newBooking.ccaName : ''))
    } else {
      dispatch(resetNewBooking())
    }
    dispatch(fetchAllCCAs())
    if (facilityList.length === 0) {
      dispatch(getFacilityList())
    }
    return () => {
      dispatch(resetNewBooking)
    }
  }, [dispatch])

  useEffect(() => {
    if (createSuccess === true && createFailure === false) {
      history.replace(PATHS.FACILITY_BOOKING_MAIN)
      if (newBookingFacilityId) {
        history.push('/facility/view/' + newBookingFacilityId)
      } else {
        history.push('/facility/view/1')
      }
      dispatch(resetCreateBookingSuccessFailure(true, true))
      setTimeout(() => dispatch(resetCreateBookingSuccessFailure(false, false)), 5000)
    }
  }, [createSuccess, createFailure])

  const CheckIcon = (createBookingError: string) => {
    if (
      createBookingError === '' &&
      newBookingCCA !== '' &&
      newBookingDescription !== '' &&
      newBookingFacilityName !== ''
    ) {
      return (
        <div
          onClick={() => {
            dispatch(handleCreateBooking(newBooking?.bookingID ? true : false))
          }}
        >
          <CheckOutlined style={{ color: 'green' }} />
        </div>
      )
    } else {
      // if (newBookingCCA !== '' || newBookingDescription !== '' || newBookingFacilityName !== '') {
      //   dispatch(SetCreateBookingError('All fields are compulsary!'))
      // }
      return <CheckOutlined style={{ color: '#0000004d' }} />
    }
  }

  /* 
  TODO: There are two places that are called conference room, 1 in kuok and 1 in UL. The name has to deconflict.
  Used to be there are two Main Area also but since name is short, they are now Main Area (UL) and Main Area (Hall)
  */
  const locationOptions = facilityList
    .filter((facility) => facility.facilityName !== 'Conference Room')
    .map((facility) => ({
      value: facility.facilityName,
    }))

  locationOptions.push({ value: 'Conference Room' })

  return (
    <div>
      <TopNavBar title={`Book ${newBookingFacilityName}`} rightComponent={CheckIcon(createBookingError)} />
      {isLoading && <LoadingSpin />}
      {!isLoading && (
        <Background>
          <h2>Choose starting time slot</h2>
          <em>&lt;Date Selector here&gt;</em>
          <h2>
            The Date: Day {newBookingFromDate.getDate()} of Month {newBookingFromDate.getMonth() + 1} of Year&nbsp;
            {newBookingFromDate.getFullYear()}
          </h2>
          <BookingSectionDiv>
            <BookingSection />
          </BookingSectionDiv>
        </Background>
      )}
    </div>
  )
}
