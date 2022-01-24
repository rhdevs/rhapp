import React from 'react'
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

const Day = styled.div`
  font-weight: 600;
  font-size: 13px;
  text-align: center;
`

const Date = styled.div`
  font-size: 13px;
  text-align: center;
`

export const Calendar = () => {
  const DateRow = () => {
    return (
      <>
        <Date>1</Date>
        <Date>1</Date>
        <Date>1</Date>
        <Date>1</Date>
        <Date>1</Date>
        <Date>1</Date>
        <Date>1</Date>
      </>
    )
  }

  return (
    <CalenderContainer>
      <MonthsContainer>April 2021</MonthsContainer>
      <DatesContainer>
        <Day>Mon</Day>
        <Day>Tue</Day>
        <Day>Wed</Day>
        <Day>Thu</Day>
        <Day>Fri</Day>
        <Day>Sat</Day>
        <Day>Sun</Day>
        <DateRow />
        <DateRow />
        <DateRow />
        <DateRow />
        <DateRow />
        <DateRow />
      </DatesContainer>
    </CalenderContainer>
  )
}
