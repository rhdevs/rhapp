import { type } from 'os'
import React, { useState } from 'react'
import styled from 'styled-components'

import { DayHeaders } from './DayHeaders'
import { MonthlyContainer } from './MontlyContainer'

const CalenderContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const MonthsHeaderContainer = styled.div`
  height: 40px;
  width: 93px;
  color: #58b994;
  margin-left: 10px;
  font-weight: 600;
`

const DatesGridContainer = styled.div`
  display: grid;
  grid-template-columns: 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px 47.14px;
  grid-template-rows: 40px 40px 40px 40px 40px 40px;
`

export const Calendar = () => {
  return (
    <CalenderContainer>
      <MonthsHeaderContainer>Jan 2021</MonthsHeaderContainer>
      <DatesGridContainer>
        <DayHeaders />
        <MonthlyContainer />
      </DatesGridContainer>
      <MonthsHeaderContainer>Feb</MonthsHeaderContainer>
      <DatesGridContainer>
        <DayHeaders />
        <MonthlyContainer />
      </DatesGridContainer>
      <MonthsHeaderContainer>Mar</MonthsHeaderContainer>
      <DatesGridContainer>
        <DayHeaders />
        <MonthlyContainer />
      </DatesGridContainer>
    </CalenderContainer>
  )
}
