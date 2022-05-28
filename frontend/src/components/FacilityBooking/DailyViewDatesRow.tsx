import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import { RootState } from '../../store/types'
import { CustomDateRows } from '../../components/Calendar/CustomDateRows'

const DatesContainer = styled.div`
  display: flex;
  margin: auto;
`

const DailyViewDatesRow = (props: { selectedDate: Date; selectedFacilityId: number; disabledDates?: number[] }) => {
  const { clickedDate } = useSelector((state: RootState) => state.calendar)

  const year = clickedDate.getFullYear() // year e.g. 2022
  const month = clickedDate.getMonth() // month index e.g. 2 - March
  const date = clickedDate.getDate() // the date e.g. 23
  const day = clickedDate.getDay()

  const maxDatePrevMonth = new Date(year, month, 0) // max date of PREVIOUS month
  const maxDateCurMonth = new Date(year, month + 1, 0) // max date of CURRENT month

  const getDateRowStartDate = () => {
    if (day === 6) return date // if saturday chosen, start row on saturday instead of sunday
    if (date - day < 0) {
      // if date is on the new week of the month that doesn't start on sunday
      return maxDatePrevMonth.getDate() - (day - date) // get previous month's last sunday
    }
    return date - day // by default, date row start on sunday
  }

  const [dateRowStartDate, setDateRowStartDate] = useState(0)

  useEffect(() => {
    setDateRowStartDate(getDateRowStartDate())
  }, [])

  const dateNumberToObject = (dateNum: number) => {
    return new Date(year, month, dateNum)
  }

  if (dateRowStartDate + 6 > maxDateCurMonth.getDate()) {
    // if week spans across 2 months, display accordingly
    const lastDate = date < dateRowStartDate ? maxDatePrevMonth : maxDateCurMonth
    return (
      <DatesContainer>
        <CustomDateRows
          firstDate={dateNumberToObject(dateRowStartDate)}
          assignedMonth={date < dateRowStartDate ? month - 1 : month}
          disabledDates={props.disabledDates}
          facilityId={props.selectedFacilityId}
          lastDate={lastDate}
        />
        <CustomDateRows
          firstDate={dateNumberToObject(1)}
          assignedMonth={date < dateRowStartDate ? month : month + 1}
          disabledDates={props.disabledDates}
          facilityId={props.selectedFacilityId}
          lastDate={dateNumberToObject(dateRowStartDate + 6 - lastDate.getDate())}
        />
      </DatesContainer>
    )
  } else {
    return (
      <DatesContainer>
        <CustomDateRows
          firstDate={dateNumberToObject(dateRowStartDate)}
          assignedMonth={month}
          disabledDates={props.disabledDates}
          facilityId={props.selectedFacilityId}
          lastDate={dateNumberToObject(dateRowStartDate + 6)}
        />
      </DatesContainer>
    )
  }
}

export default DailyViewDatesRow
