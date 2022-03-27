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
import { ViewBookingLocationState } from '../ViewBookingDailyView'

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

export default function CreateBookingDailyView() {
  const dispatch = useDispatch()
  const history = useHistory()
  const location = useLocation<ViewBookingLocationState>()
  const params = useParams<{ facilityID: string }>()
  const { selectedFacilityName, isLoading, selectedStartTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )
  const { clickedDate } = useSelector((state: RootState) => state.calendar)

  const selectedFacilityId = parseInt(params.facilityID)

  const [disabledDates, setDisabledDates] = useState<number[]>([])

  const dateRowStartDate = location.state.dateRowStartDate

  useEffect(() => {
    dispatch(setIsLoading(true))
    dispatch(updateDailyView(clickedDate, selectedFacilityId))
  }, [clickedDate])

  useEffect(() => {
    updatedisabledDates()
  }, [selectedStartTime])

  const updatedisabledDates = () => {
    if (selectedStartTime === 0) return

    const year = clickedDate.getFullYear() // year e.g. 2022
    const month = clickedDate.getMonth() // month index e.g. 2 - March
    const selectedDate = clickedDate.getDate() // the date e.g. 23
    const maxDateCurMonth = new Date(year, month + 1, 0).getDate() // max date of CURRENT month
    // array from 1 to maxDateCurMonth
    const newDisabledDates: number[] = Array.from({ length: maxDateCurMonth }, (_, index) => index + 1)

    if (selectedDate === maxDateCurMonth) {
      newDisabledDates.pop()
      newDisabledDates.shift()
    } else {
      newDisabledDates.splice(selectedDate - 1, 2)
    }
    setDisabledDates(newDisabledDates)
  }

  const goBackToDailyViewPage = () => {
    history.push({
      pathname: `${PATHS.VIEW_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}`,
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
            redirectTo={`${PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW}/${selectedFacilityId}`}
            dateRowStartDate={dateRowStartDate}
            disabledDates={disabledDates}
          />
          <BookingSectionDiv>
            <BookingSection facilityId={selectedFacilityId} date={clickedDate} />
          </BookingSectionDiv>
        </Background>
      )}
    </>
  )
}
