import React, { useEffect } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from 'react-router-dom'
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
import { updateDailyView } from '../../../store/facilityBooking/action'

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

type State = {
  date: Date
  facilityId: number
}

export default function ViewBookingDailyView() {
  const history = useHistory()
  const dispatch = useDispatch()
  const location = useLocation<State>()
  const { isLoading } = useSelector((state: RootState) => state.facilityBooking)
  const selectedFacilityId = location.state.facilityId
  const date = location.state.date

  useEffect(() => {
    dispatch(updateDailyView(date, selectedFacilityId))
  }, [date])

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
          />
          <DateRows
            firstDate={1}
            assignedMonth={month}
            lastDateOfThisMonth={1 + 5 - (maxDate - startDate)}
            bufferDates={[]}
            facilityId={selectedFacilityId}
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
          />
        </DatesContainer>
      )
    }
  }

  return (
    <div>
      <TopNavBarRevamp
        onLeftClick={() => 'link to calendar page'}
        centerComponent={<TitleText>Calendar</TitleText>}
        rightComponent={
          <ButtonComponent
            state="primary"
            text="Book Facility"
            onClick={() => history.push(PATHS.CREATE_FACILITY_BOOKING_DAILY_VIEW)}
            size="small"
          />
        }
      />
      {isLoading ? (
        <LoadingSpin />
      ) : (
        <Background>
          {Dates(date)}
          <BookingSectionDiv>
            <ViewSection />
          </BookingSectionDiv>
        </Background>
      )}
    </div>
  )
}
