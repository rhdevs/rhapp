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
        <DateRows currentDate={props.date} nthMonth={month} facilityId={props.selectedFacilityId} />
        <DateRows currentDate={props.date} nthMonth={month} facilityId={props.selectedFacilityId} />
      </DatesContainer>
    )
  } else {
    return (
      <DatesContainer>
        <DateRows currentDate={props.date} nthMonth={month} facilityId={props.selectedFacilityId} />
      </DatesContainer>
    )
  }
}

export default DailyViewDatesRow
