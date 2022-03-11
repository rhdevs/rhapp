import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { RootState } from '../../../store/types'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
import {
  editBookingFromDate,
  editBookingToDate,
  handleCreateBooking,
  setStartEndTime,
} from '../../../store/facilityBooking/action'
import BookingSection from '../../../components/FacilityBooking/BookingSection'
import { unixTo12HourTime } from '../../../common/unixTo12HourTime'
import { DateRows } from '../../../components/Calendar/DateRows'

const HEADER_HEIGHT = '70px'

const Background = styled.div`
  background-color: #fff;
  height: calc(100vh - ${HEADER_HEIGHT});
  width: (100vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 36px;
  overflow: hidden;
`

const BookingSectionDiv = styled.div`
  width: 100vw;
  height: 100%;
  overflow-y: scroll;

  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`

export default function CreateBookingDailyView() {
  const dispatch = useDispatch()
  const history = useHistory()
  const {
    newBookingFacilityName,
    newBookingFromDate,
    isLoading,
    createBookingError,
    selectedStartTime,
    selectedEndTime,
  } = useSelector((state: RootState) => state.facilityBooking)

  const CheckIcon = (createBookingError: string) => {
    if (selectedStartTime != -1 && selectedEndTime != -1) {
      return (
        <div
          onClick={() => {
            dispatch(editBookingFromDate(new Date(selectedStartTime * 1000)))
            dispatch(editBookingToDate(new Date(selectedEndTime * 1000)))
            setStartEndTime(-1, -1)
            history.goBack()
          }}
        >
          <CheckOutlined style={{ color: 'green' }} />
        </div>
      )
    } else {
      return <CheckOutlined style={{ color: '#0000004d' }} />
    }
  }

  return (
    <div>
      <TopNavBar title={`Book ${newBookingFacilityName}`} rightComponent={CheckIcon(createBookingError)} />
      {isLoading && <LoadingSpin />}
      {!isLoading && (
        <Background>
          <h2>Choose starting time slot</h2>
          <em>&lt;Date Selector here&gt;</em>
          <h1>
            Start: {unixTo12HourTime(selectedStartTime)} End: {unixTo12HourTime(selectedEndTime)}
          </h1>
          <h2>
            The Date: Day {newBookingFromDate.getDate()} of Month {newBookingFromDate.getMonth() + 1} of Year&nbsp;
            {newBookingFromDate.getFullYear()}
          </h2>
          <DateRows firstDate={0} assignedMonth={0} lastDateOfThisMonth={10} bufferDates={[]} facilityId={0} />
          <BookingSectionDiv>
            <BookingSection />
          </BookingSectionDiv>
        </Background>
      )}
    </div>
  )
}
