import React from 'react'
import styled from 'styled-components'

import { DayHeaders } from './DayHeaders'
import { DateRows } from './DateRows'

const CalenderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  width: min-content;
  margin-right: auto;
  margin-left: auto;
`

const YearContainer = styled.div`
  width: calc(47.14px * 7);
  font-weight: 600;
  color: #58b994;
  text-align: center;
  padding-top: 10px;
`

const MonthContainer = styled.div`
  padding-bottom: 5px;
`

const MonthsHeaderContainer = styled.div`
  width: 93px;
  color: #58b994;
  margin-top: 10px;
  margin-left: 10px;
  padding-bottom: 20px;
  font-weight: 600;
`

const DatesGridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 47.14px);
  grid-template-rows: 40px;
`

// this component takes in an array of events or an array of dates that has events
export const Calendar = (props: { onDateClick: (date: Date) => void; monthsToShow?: number }) => {
  const today = new Date()
  const currentYear = today.getFullYear()
  const monthsToShow = props.monthsToShow ?? 5
  let startingMonth = 0
  let displayYear = currentYear

  const monthList = [...Array(monthsToShow).keys()].map((x) => new Date(today.getFullYear(), today.getMonth() + x, 1))

  const Month = (innerProps: { month: Date }) => {
    const isYearDisplayed = startingMonth === 0 || innerProps.month.getMonth() === 0 // display year if is first month of calender, or january
    if (innerProps.month.getMonth() === 0 && startingMonth !== 0) displayYear++ // increment when a new year starts

    return (
      <div>
        {/* Note: 0 stands for Jan */}
        {isYearDisplayed && <YearContainer>{displayYear}</YearContainer>}
        <MonthContainer>
          <MonthsHeaderContainer>{innerProps.month.toLocaleString('default', { month: 'long' })}</MonthsHeaderContainer>
          <DatesGridContainer>
            <DayHeaders />
            <DateRows currentDate={today} nthMonth={startingMonth++} onDateClick={props.onDateClick} />
          </DatesGridContainer>
        </MonthContainer>
      </div>
    )
  }

  return (
    <CalenderContainer>
      {monthList.map((month) => (
        <Month month={month} key={startingMonth} />
      ))}
    </CalenderContainer>
  )
}
