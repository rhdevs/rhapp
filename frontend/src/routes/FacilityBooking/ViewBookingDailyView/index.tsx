import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'
import 'antd-mobile/dist/antd-mobile.css'
import 'antd/dist/antd.css'
import { RootState } from '../../../store/types'
import { useDispatch, useSelector } from 'react-redux'
import LoadingSpin from '../../../components/LoadingSpin'
import { PATHS } from '../../Routes'
import ViewSection from '../../../components/FacilityBooking/ViewSection'
import TopNavBarRevamp from '../../../components/TopNavBarRevamp'
import ButtonComponent from '../../../components/Button'
import { DateRows } from '../../../components/Calendar/DateRows'
import { ENDPOINTS, DOMAIN_URL } from '../../../store/endpoints'
import { setSelectedDayBookings } from '../../../store/facilityBooking/action'

const HEADER_HEIGHT = '70px'

const Background = styled.div`
  background-color: #fff;
  height: calc(100vh - ${HEADER_HEIGHT});
  width: (100vw);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 36px;
`

const BookingSectionDiv = styled.div`
  width: 100%;
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

export default function CreateBookingDailyView(props: { date: Date; facilityId: number }) {
  const history = useHistory()
  const dispatch = useDispatch()
  const { isLoading } = useSelector((state: RootState) => state.facilityBooking)

  const adjustedStart = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), 0, 0, 0, 0)
  const adjustedEnd = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate(), 23, 59, 59, 999)
  const querySubString =
    props.facilityId +
    '/' +
    '?startTime=' +
    parseInt((adjustedStart.getTime() / 1000).toFixed(0)) +
    '&endTime=' +
    parseInt((adjustedEnd.getTime() / 1000).toFixed(0))

  fetch(DOMAIN_URL.FACILITY + ENDPOINTS.FACILITY_BOOKING + '/' + querySubString, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then(async (res) => {
      dispatch(setSelectedDayBookings(res.data))
    })

  function Dates(date: Date) {
    const year = date.getFullYear()
    const maxDate = new Date(year, date.getMonth(), 0).getDate()
    const day = date.getDay()
    const startDate = date.getDate() - day < 0 ? maxDate - (day - date.getDate()) : date.getDate() - day
    if (startDate + 6 > maxDate) {
      return (
        <DatesContainer>
          <DateRows
            firstDate={startDate}
            assignedMonth={date.getMonth()}
            lastDateOfThisMonth={startDate + maxDate - startDate}
            bufferDates={[]}
          />
          <DateRows
            firstDate={1}
            assignedMonth={date.getMonth()}
            lastDateOfThisMonth={1 + 5 - (maxDate - startDate)}
            bufferDates={[]}
          />
        </DatesContainer>
      )
    } else {
      return (
        <DatesContainer>
          <DateRows
            firstDate={startDate}
            assignedMonth={date.getMonth()}
            lastDateOfThisMonth={startDate + 6}
            bufferDates={[]}
          />
        </DatesContainer>
      )
    }
  }

  return (
    <div>
      <TopNavBarRevamp
        centerComponent={<TitleText>Calendar</TitleText>}
        rightComponent={
          <ButtonComponent state="primary" text="Book Facility" onClick={() => 'link to booking page'} size="small" />
        }
      />
      {isLoading && <LoadingSpin />}
      {!isLoading && (
        <Background>
          {Dates(props.date)}
          <BookingSectionDiv>
            <ViewSection />
          </BookingSectionDiv>
        </Background>
      )}
    </div>
  )
}
