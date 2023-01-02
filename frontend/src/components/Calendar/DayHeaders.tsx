import React from 'react'
import styled from 'styled-components'

import { days } from '../../common/dates'

const DayContainer = styled.div`
  font-weight: 600;
  font-size: 13px;
  text-align: center;
`

export const DayHeaders = () => {
  return (
    <>
      {days.slice(1).map((day) => {
        return <DayContainer key={day}>{day.slice(0, 3)}</DayContainer>
      })}
    </>
  )
}
