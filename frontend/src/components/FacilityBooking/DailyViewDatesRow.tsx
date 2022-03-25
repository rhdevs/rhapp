import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { CustomDateRows } from '../../components/Calendar/CustomDateRows'

const DatesContainer = styled.div`
  display: flex;
  margin: auto;
`

const DailyViewDatesRow = (props: { date: Date; selectedFacilityId: number }) => {
  const year = props.date.getFullYear()
  const month = props.date.getMonth()
  const dates = props.date.getDate()
  const maxDateNumber = new Date(year, month, 0).getDate()
  const day = new Date(year, month, dates).getDay()
  const startDateNumber = dates - day < 0 ? maxDateNumber - (day - dates) : dates - day
  const startDate = new Date(year, month, startDateNumber)

  if (startDateNumber + 6 > maxDateNumber) {
    return (
      <DatesContainer>
        <CustomDateRows
          firstDate={startDate}
          assignedMonth={month}
          lastDate={new Date(year, month, startDateNumber + maxDateNumber - startDateNumber)}
          facilityId={props.selectedFacilityId}
        />
        <CustomDateRows
          firstDate={new Date(year, month, 1)}
          assignedMonth={month}
          lastDate={new Date(year, month, 1 + 5 - (maxDateNumber - startDateNumber))}
          facilityId={props.selectedFacilityId}
        />
      </DatesContainer>
    )
  } else {
    return (
      <DatesContainer>
        <CustomDateRows
          firstDate={startDate}
          assignedMonth={month}
          lastDate={new Date(year, month, startDateNumber + 6)}
          facilityId={props.selectedFacilityId}
        />
      </DatesContainer>
    )
  }
}

export default DailyViewDatesRow
