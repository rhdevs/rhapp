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

export default function CreateBookingDailyView(props: { startDate: number; month: number }) {
  const dispatch = useDispatch()
  const history = useHistory()
  const { isLoading } = useSelector((state: RootState) => state.facilityBooking)

  function Dates(date: number, month: number) {
    const year = new Date().getFullYear()
    const maxDate = new Date(year, month, 0).getDate()
    const startDate = date - 1
    console.log(maxDate)
    if (startDate + 6 > maxDate) {
      return (
        <DatesContainer>
          <DateRows
            firstDate={startDate}
            assignedMonth={month}
            lastDateOfThisMonth={startDate + maxDate - startDate}
            bufferDates={[]}
          />
          <DateRows
            firstDate={1}
            assignedMonth={month}
            lastDateOfThisMonth={1 + 5 - (maxDate - startDate)}
            bufferDates={[]}
          />
        </DatesContainer>
      )
    } else {
      return (
        <DatesContainer>
          <DateRows firstDate={startDate} assignedMonth={month} lastDateOfThisMonth={startDate + 5} bufferDates={[]} />
        </DatesContainer>
      )
    }
  }

  return (
    <div>
      <TopNavBarRevamp
        centerComponent={<TitleText>Calendar</TitleText>}
        rightComponent={<ButtonComponent state="primary" text="Book Facility" onClick={() => 'hehe'} size="small" />}
      />
      {isLoading && <LoadingSpin />}
      {!isLoading && (
        <Background>
          {Dates(29, 3)}
          <BookingSectionDiv>
            <ViewSection />
          </BookingSectionDiv>
        </Background>
      )}
    </div>
  )
}
