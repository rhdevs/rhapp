import { type } from 'os'
import React, { useState } from 'react'
import styled from 'styled-components'

const CalenderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const MonthsContainer = styled.div`
  height: 40px;
  width: 93px;
  color: #58b994;
  margin-left: 10px;
  font-weight: 600;
`

const DatesContainer = styled.div`
  display: grid;
  grid-template-columns: 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px;
  grid-template-rows: 40px 40px 40px 40px 40px 40px;
`

const DayContainer = styled.div`
  font-weight: 600;
  font-size: 13px;
  text-align: center;
`

const DateContainer = styled.div<{ blurred?: boolean; selected?: boolean }>`
  font-size: 12px;
  padding-top: auto;
  padding-bottom: auto;
  text-align: center;
  height: 40px;
  width: 47.14px;
  color: ${(prop) => (prop.blurred ? '#d4d4d4' : prop.selected ? 'white' : '')};
  border: 0.5px solid white;
  border-radius: 40px;
  background-color: ${(prop) => (prop.selected ? '#468751' : ' white')};
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const EventIndicator = styled.div<{ selected?: boolean }>`
  position: absolute;
  align-self: center;
  margin-top: -24px;
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: ${(prop) => (prop.selected ? 'white' : 'black')};
`

const ClickableDateContainer = (date: number, isBlurred: boolean) => {
  const [dateSelected, isDateSelected] = useState(false)
  const DateContainerClickHandler = () => {
    isDateSelected(!dateSelected)
    console.log('Date selected. Need to change color.')
  }

  return (
    // <DateContainer onClick={() => DateContainerClickHandler()} blurred={isBlurred} selected={dateSelected}>
    <DateContainer onClick={DateContainerClickHandler} blurred={isBlurred} selected={dateSelected}>
      <EventIndicator selected={dateSelected} />
      {date}
    </DateContainer>
  )
}

const MonthRow = () => {
  return (
    <>
      <DayContainer>Mon</DayContainer>
      <DayContainer>Tue</DayContainer>
      <DayContainer>Wed</DayContainer>
      <DayContainer>Thu</DayContainer>
      <DayContainer>Fri</DayContainer>
      <DayContainer>Sat</DayContainer>
      <DayContainer>Sun</DayContainer>
    </>
  )
}

const MiddleDateRows = (firstDate: number) => {
  return (
    <>
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
      {ClickableDateContainer(firstDate++, false)}
    </>
  )
}

const FirstLastDateRow = (firstDayOfThisMonth: number, lastDateOfPreviousMonth: number, firstRow: boolean) => {
  let newMonthDate = 1
  let firstDateToPut = lastDateOfPreviousMonth - firstDayOfThisMonth + 2
  return firstRow ? (
    <>
      <DateContainer blurred={true}>{firstDateToPut++}</DateContainer>
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer blurred={true}>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer blurred={true}>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer blurred={true}>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer blurred={true}>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer blurred={true}>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer blurred={true}>{firstDateToPut++}</DateContainer>
      )}
    </>
  ) : (
    <>
      <DateContainer>{firstDateToPut++}</DateContainer>
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer blurred={true}>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer blurred={true}>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer blurred={true}>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer blurred={true}>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer blurred={true}>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer>{firstDateToPut++}</DateContainer>
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer blurred={true}>{newMonthDate++}</DateContainer>
      ) : (
        <DateContainer>{firstDateToPut++}</DateContainer>
      )}
    </>
  )
}
const MakeCurrentMonth = () => {
  const today = new Date()
  const firstDateOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDate()
  const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  const lastDateOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1).getDay()
  const lastDateOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  return (
    <>
      {FirstLastDateRow(firstDayOfThisMonth, lastDateOfPreviousMonth, true)}
      {MiddleDateRows(firstDateOfThisMonth)}
      {FirstLastDateRow(firstDayOfNextMonth, lastDateOfThisMonth, false)}
    </>
  )
}

export const Calendar = () => {
  return (
    <CalenderContainer>
      <MonthsContainer>Jan 2021</MonthsContainer>
      <DatesContainer>
        <MonthRow />
        {MakeCurrentMonth()}
      </DatesContainer>
    </CalenderContainer>
  )
}
