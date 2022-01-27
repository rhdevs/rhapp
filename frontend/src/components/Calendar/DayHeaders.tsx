import styled from 'styled-components'
import React from 'react'

const DayContainer = styled.div`
  font-weight: 600;
  font-size: 13px;
  text-align: center;
`

export const DayHeaders = () => {
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
