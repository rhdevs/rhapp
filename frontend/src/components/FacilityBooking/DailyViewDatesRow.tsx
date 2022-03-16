import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { DateRows } from '../../components/Calendar/DateRows'

const DatesContainer = styled.div`
  display: flex;
  margin: auto;
`

const DailyViewDatesRow = (props: { date: Date; selectedFacilityId: number }) => {
  const year = props.date.getFullYear()
  const month = props.date.getMonth()
  const dates = props.date.getDate()
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
          facilityId={props.selectedFacilityId}
        />
        <DateRows
          firstDate={1}
          assignedMonth={month}
          lastDateOfThisMonth={1 + 5 - (maxDate - startDate)}
          bufferDates={[]}
          facilityId={props.selectedFacilityId}
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
          facilityId={props.selectedFacilityId}
        />
      </DatesContainer>
    )
  }
}

export default DailyViewDatesRow
