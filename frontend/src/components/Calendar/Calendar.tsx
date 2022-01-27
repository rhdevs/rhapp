import { type } from 'os'
import React, { useState } from 'react'
import styled from 'styled-components'

import { DayHeaders } from './DayHeaders'
import { ClickableDateContainer } from './ClickableDateContainer'

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

const MiddleDateRows = (firstDate: number) => {
  return (
    <>
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
      <ClickableDateContainer date={firstDate++} isBlurred={false} />
    </>
  )
}

const FirstLastDateRow = (firstDayOfThisMonth: number, lastDateOfPreviousMonth: number, firstRow: boolean) => {
  let newMonthDate = 1
  let firstDateToPut = lastDateOfPreviousMonth - firstDayOfThisMonth + 2
  return firstRow ? (
    <>
      <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <DateContainer>{newMonthDate++}</DateContainer>
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={firstDateToPut++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={firstDateToPut++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={firstDateToPut++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={firstDateToPut++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={firstDateToPut++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
    </>
  ) : (
    <>
      <ClickableDateContainer date={firstDateToPut++} />
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
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
        <DayHeaders />
        <MakeCurrentMonth />
      </DatesContainer>
      <MonthsContainer>Feb</MonthsContainer>
      <DatesContainer>
        <DayHeaders />
        <MakeCurrentMonth />
      </DatesContainer>
      <MonthsContainer>Mar</MonthsContainer>
      <DatesContainer>
        <DayHeaders />
        <MakeCurrentMonth />
      </DatesContainer>
    </CalenderContainer>
  )
}
