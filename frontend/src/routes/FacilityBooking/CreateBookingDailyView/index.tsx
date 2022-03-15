import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
import CheckOutlined from '@ant-design/icons/lib/icons/CheckOutlined'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import { RootState } from '../../../store/types'
import TopNavBar from '../../../components/Mobile/TopNavBar'
import LoadingSpin from '../../../components/LoadingSpin'
import {
  editBookingFromDate,
  editBookingToDate,
  getTimeBlocks,
  handleCreateBooking,
  setIsLoading,
  updateDailyView,
} from '../../../store/facilityBooking/action'
import BookingSection from '../../../components/FacilityBooking/BookingSection'
import { unixTo12HourTime } from '../../../common/unixTo12HourTime'
import { DateRows } from '../../../components/Calendar/DateRows'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'

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

const TitleText = styled.h2`
  font-family: lato;
  font-style: normal;
  font-weight: 700;
  font-size: 22px;
  margin-top: 0.7rem;
`

const DatesContainer = styled.div`
  display: flex;
  margin: auto;
`

type State = {
  date: Date
  facilityId: number
}

export default function CreateBookingDailyView() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation<State>()
  const { selectedFacilityName, newBookingFromDate, isLoading } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

  const selectedFacilityId = location.state.facilityId
  const date = location.state.date

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(updateDailyView(date, selectedFacilityId))
  }, [])

  function Dates(date: Date) {
    const year = date.getFullYear()
    const month = date.getMonth()
    const dates = date.getDate()
    const maxDate = new Date(year, month, 0).getDate()
    const day = new Date(year, month, dates).getDay()
    const startDate = dates - day < 0 ? maxDate - (day - dates) : dates - day

    if (startDate + 6 > maxDate) {
      return (
        <DatesContainer>
          <DateRows
            firstDate={startDate}
            assignedMonth={month}
            lastDateOfThisMonth={startDate + maxDate - startDate}
            bufferDates={[]}
            facilityId={selectedFacilityId}
            noRedirect
          />
          <DateRows
            firstDate={1}
            assignedMonth={month}
            lastDateOfThisMonth={1 + 5 - (maxDate - startDate)}
            bufferDates={[]}
            facilityId={selectedFacilityId}
            noRedirect
          />
        </DatesContainer>
      )
    } else {
      return (
        <DatesContainer>
          <DateRows
            firstDate={startDate}
            assignedMonth={month}
            lastDateOfThisMonth={startDate + 6}
            bufferDates={[]}
            facilityId={selectedFacilityId}
            noRedirect
          />
        </DatesContainer>
      )
    }
  }

  return (
    <div>
      <TopNavBarRevamp
        onLeftClick={() => history.goBack()}
        centerComponent={<TitleText>Book {selectedFacilityName}</TitleText>}
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Background>
          <h2>Choose starting time slot</h2>
          <h3>
            The Date: {newBookingFromDate.getDate()}/{newBookingFromDate.getMonth() + 1}/
            {newBookingFromDate.getFullYear()}
          </h3>
          {Dates(date)}
          <BookingSectionDiv>
            <BookingSection />
          </BookingSectionDiv>
        </Background>
      )}
    </div>
  )
}
