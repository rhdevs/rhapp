import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { DateRows } from '../../components/Calendar/DateRows'
import { PATHS } from '../../routes/Routes'
import { setIsLoading } from '../../store/facilityBooking/action'
import { RootState } from '../../store/types'
import { CustomDateRows } from '../../components/Calendar/CustomDateRows'

const DatesContainer = styled.div`
  display: flex;
  margin: auto;
`

// TODO overlay dates that are >1 day from the selectedStartTime date
const DailyViewDatesRow = (props: {
  selectedDate: Date
  selectedFacilityId: number
  redirectTo: string
  dateRowStartDate: number
  overlayDates?: number[]
}) => {
  const history = useHistory()
  const { clickedDate } = useSelector((state: RootState) => state.calendar)

  // const clickedDateToDateObject = (clickedDate: number) => {
  //   const month = Math.floor(clickedDate / 100)
  //   const day = clickedDate % 100
  //   return new Date(new Date().getFullYear(), month, day)
  // }

  // const clickedDateObject = clickedDateToDateObject(clickedDate)

  const year = clickedDate.getFullYear() // year e.g. 2022
  const month = clickedDate.getMonth() // month index e.g. 2 - March
  const date = clickedDate.getDate() // the date e.g. 23

  const maxDatePrevMonth = new Date(year, month, 0) // max date of PREVIOUS month
  const maxDateCurMonth = new Date(year, month + 1, 0) // max date of CURRENT month
  // const day = clickedDate.getDay() // day of week

  const onClickDate = (date: Date) => {
    history.push({
      pathname: props.redirectTo,
      state: {
        // date: date,
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
            // lastDateOfThisMonth={maxDatePrevMonth}
            // bufferDates={[]}
            overlayDates={props.overlayDates}
            facilityId={props.selectedFacilityId}
            onClickDate={onClickDate}
            lastDate={maxDatePrevMonth}
          />
          <CustomDateRows
            firstDate={dateNumberToObject(1)}
            assignedMonth={month}
            // lastDateOfThisMonth={props.dateRowStartDate + 6 - maxDatePrevMonth}
            // bufferDates={[]}
            overlayDates={props.overlayDates}
            facilityId={props.selectedFacilityId}
            onClickDate={onClickDate}
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
            // lastDateOfThisMonth={maxDateCurMonth}
            // bufferDates={[]}
            overlayDates={props.overlayDates}
            facilityId={props.selectedFacilityId}
            onClickDate={onClickDate}
            lastDate={maxDateCurMonth}
          />
          <CustomDateRows
            firstDate={dateNumberToObject(1)}
            assignedMonth={month + 1}
            // lastDateOfThisMonth={props.dateRowStartDate + 6 - maxDateCurMonth}
            // bufferDates={[]}
            overlayDates={props.overlayDates}
            facilityId={props.selectedFacilityId}
            onClickDate={onClickDate}
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
          // lastDateOfThisMonth={props.dateRowStartDate + 6}
          // bufferDates={[]}
          overlayDates={props.overlayDates}
          facilityId={props.selectedFacilityId}
          onClickDate={onClickDate}
          lastDate={dateNumberToObject(props.dateRowStartDate + 6)}
        />
      </DatesContainer>
    )
  }
}

export default DailyViewDatesRow
