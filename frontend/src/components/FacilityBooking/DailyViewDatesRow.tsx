import React from 'react'
import { useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { RootState } from '../../store/types'
import { CustomDateRows } from '../../components/Calendar/CustomDateRows'

const DatesContainer = styled.div`
  display: flex;
  margin: auto;
`

const DailyViewDatesRow = (props: {
  selectedDate: Date
  selectedFacilityId: number
  redirectTo: string
  dateRowStartDate: number
  disabledDates?: number[]
}) => {
  const history = useHistory()
  const { clickedDate } = useSelector((state: RootState) => state.calendar)

  const year = clickedDate.getFullYear() // year e.g. 2022
  const month = clickedDate.getMonth() // month index e.g. 2 - March
  const date = clickedDate.getDate() // the date e.g. 23

  const maxDatePrevMonth = new Date(year, month, 0) // max date of PREVIOUS month
  const maxDateCurMonth = new Date(year, month + 1, 0) // max date of CURRENT month

  const onDateClick = (date: Date) => {
    history.push({
      pathname: props.redirectTo,
      state: {
        dateRowStartDate: props.dateRowStartDate,
      },
    })
  }

  const dateNumberToObject = (dateNum: number) => {
    return new Date(year, month, dateNum)
  }

  if (props.dateRowStartDate + 6 > maxDateCurMonth.getDate()) {
    // if week spans across 2 months, display accordingly
    if (date < props.dateRowStartDate) {
      // current date selected is from the next month
      return (
        <DatesContainer>
          <CustomDateRows
            firstDate={dateNumberToObject(props.dateRowStartDate)}
            assignedMonth={month - 1}
            disabledDates={props.disabledDates}
            facilityId={props.selectedFacilityId}
            onDateClick={onDateClick}
            lastDate={maxDatePrevMonth}
          />
          <CustomDateRows
            firstDate={dateNumberToObject(1)}
            assignedMonth={month}
            disabledDates={props.disabledDates}
            facilityId={props.selectedFacilityId}
            onDateClick={onDateClick}
            lastDate={dateNumberToObject(props.dateRowStartDate + 6 - maxDatePrevMonth.getDate())}
          />
        </DatesContainer>
      )
    } else {
      // current date selected is from the previous month
      return (
        <DatesContainer>
          <CustomDateRows
            firstDate={dateNumberToObject(props.dateRowStartDate)}
            assignedMonth={month}
            disabledDates={props.disabledDates}
            facilityId={props.selectedFacilityId}
            onDateClick={onDateClick}
            lastDate={maxDateCurMonth}
          />
          <CustomDateRows
            firstDate={dateNumberToObject(1)}
            assignedMonth={month + 1}
            disabledDates={props.disabledDates}
            facilityId={props.selectedFacilityId}
            onDateClick={onDateClick}
            lastDate={dateNumberToObject(props.dateRowStartDate + 6 - maxDateCurMonth.getDate())}
          />
        </DatesContainer>
      )
    }
  } else {
    return (
      <DatesContainer>
        <CustomDateRows
          firstDate={dateNumberToObject(props.dateRowStartDate)}
          assignedMonth={month}
          disabledDates={props.disabledDates}
          facilityId={props.selectedFacilityId}
          onDateClick={onDateClick}
          lastDate={dateNumberToObject(props.dateRowStartDate + 6)}
        />
      </DatesContainer>
    )
  }
}

export default DailyViewDatesRow
