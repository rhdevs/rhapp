import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'

import LoadingSpin from '../../../components/LoadingSpin'
import BookingSection from '../../../components/FacilityBooking/BookingSection'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import DailyViewDatesRow from '../../../components/FacilityBooking/DailyViewDatesRow'
import { RootState } from '../../../store/types'
import {
  setIsLoading,
  setSelectedBlockTimestamp,
  setSelectedEndTime,
  setSelectedStartTime,
  updateDailyView,
} from '../../../store/facilityBooking/action'
import { PATHS } from '../../Routes'

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

type State = {
  dateRowStartDate: number
}

export default function CreateBookingDailyView() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation<State>()
  const params = useParams<{ facilityID: string }>()
  const { selectedFacilityName, isLoading, selectedStartTime, dailyViewDatesRowStartDate } = useSelector(
    (state: RootState) => state.facilityBooking,
  )
  const { clickedDate } = useSelector((state: RootState) => state.calendar)

  const selectedFacilityId = parseInt(params.facilityID)
  const dateRowStartDate = location.state.dateRowStartDate

  const [overlayDates, setOverlayDates] = useState<number[]>([])

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(updateDailyView(clickedDate, selectedFacilityId))
  }, [clickedDate])

  useEffect(() => {
    updateOverlayDates()
  }, [selectedStartTime])

  const updateOverlayDates = () => {
    if (selectedStartTime === 0) return

    const newOverlayDates: number[] = []

    const year = clickedDate.getFullYear() // year e.g. 2022
    const month = clickedDate.getMonth() // month index e.g. 2 - March
    const selectedDate = clickedDate.getDate() // the date e.g. 23

    const maxDatePrevMonth = new Date(year, month, 0).getDate() // max date of PREVIOUS month
    const maxDateCurMonth = new Date(year, month + 1, 0).getDate() // max date of CURRENT month

    if (dateRowStartDate + 6 > maxDateCurMonth) {
      // if week spans across 2 months
      if (selectedDate < dateRowStartDate) {
        // start date selected is from the next month
        const cutoffDate = selectedDate + 2
        const endDate = dateRowStartDate + 6 - maxDatePrevMonth
        for (let i = cutoffDate; i <= endDate; i++) newOverlayDates.push(i)
      } else {
        // start date selected is from the previous month
        const cutoffDate = (selectedDate + 2) % maxDateCurMonth
        const endDate = dateRowStartDate + 6 - maxDateCurMonth
        for (let i = cutoffDate; i <= maxDateCurMonth; i++) newOverlayDates.push(i)
        for (let j = 1; j <= endDate; j++) newOverlayDates.push(j)
      }
    } else {
      const cutoffDate = selectedDate + 2
      const endDate = dateRowStartDate + 6
      for (let i = cutoffDate; i <= endDate; i++) newOverlayDates.push(i)
    }
    setOverlayDates(newOverlayDates)
  }

  const goBackToDailyViewPage = () => {
    history.push({
      pathname: PATHS.VIEW_FACILITY_BOOKING_DAILY_VIEW + selectedFacilityId,
      state: {
        dateRowStartDate: dateRowStartDate,
      },
    })
  }

  const onLeftClick = () => {
    // reset user selection
    dispatch(setSelectedBlockTimestamp(0))
    dispatch(setSelectedStartTime(0))
    dispatch(setSelectedEndTime(0))
    goBackToDailyViewPage()
  }

  return (
    <>
      <TopNavBarRevamp onLeftClick={onLeftClick} centerComponent={<TitleText>Book {selectedFacilityName}</TitleText>} />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Background>
          <h2>Choose {selectedStartTime ? 'ending' : 'starting'} time slot</h2>
          <DailyViewDatesRow
            selectedDate={clickedDate}
            selectedFacilityId={selectedFacilityId}
            redirectTo={PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW + selectedFacilityId}
            dateRowStartDate={dateRowStartDate}
            overlayDates={overlayDates}
          />
          <BookingSectionDiv>
            <BookingSection facilityId={selectedFacilityId} date={clickedDate} />
          </BookingSectionDiv>
        </Background>
      )}
    </>
  )
}
