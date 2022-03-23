import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { DateRows } from '../../components/Calendar/DateRows'
import { PATHS } from '../../routes/Routes'
import { setIsLoading } from '../../store/facilityBooking/action'
import { RootState } from '../../store/types'
import { RedirectRoutes } from '../Calendar/ClickableDateContainer'

const DatesContainer = styled.div`
  display: flex;
  margin: auto;
`

// TODO if saturday put saturday in front
// TODO overlay dates that are >1 day from the selectedStartTime date
const DailyViewDatesRow = (props: {
  selectedDate: Date
  selectedFacilityId: number
  redirectTo: string
  dateRowStartDate: number
}) => {
  const history = useHistory()
  const { clickedDate } = useSelector((state: RootState) => state.calendar)

  const clickedDateToDateObject = (clickedDate: number) => {
    const month = Math.floor(clickedDate / 100)
    const day = clickedDate % 100
    return new Date(new Date().getFullYear(), month, day)
  }

  const clickedDateObject = clickedDateToDateObject(clickedDate)

  const year = clickedDateObject.getFullYear() // year e.g. 2022
  const month = clickedDateObject.getMonth() // month index e.g. 2 - March
  const date = clickedDateObject.getDate() // the date e.g. 23

  const maxDatePrevMonth = new Date(year, month, 0).getDate() // max date of PREVIOUS month
  const maxDateCurMonth = new Date(year, month + 1, 0).getDate() // max date of CURRENT month
  const day = clickedDateObject.getDay() // day of week

  // const dispatch = useDispatch()
  // const { dateRowStartDate } = useSelector((state: RootState) => state.facilityBooking)
  // first day on row

  // if (dateRowStartDate === 0) {
  //   // use redux to ensure that the date row doesn't refresh when user selects date
  //   const newRowStartDate = date - day < 0 ? maxDatePrevMonth - (day - date) : date - day
  //   console.log('newRowStartDate', newRowStartDate)
  //   dispatch(setdateRowStartDate(newRowStartDate))
  // }

  // useEffect(() => {
  //   const newRowStartDate = date - day < 0 ? maxDatePrevMonth - (day - date) : date - day
  //   dispatch(setdateRowStartDate(newRowStartDate))
  // }, [])

  console.log('selectedDate', clickedDateObject)
  console.log('year', year)
  console.log('month', month)
  console.log('date', date)
  console.log('maxDatePrevMonth', maxDatePrevMonth)
  console.log('maxDateCurMonth', maxDateCurMonth)
  console.log('day', day)
  console.log('dateRowStartDate', props.dateRowStartDate)

  const onClickDate = (date: Date) => {
    history.push({
      pathname: props.redirectTo,
      state: {
        date: date,
        dateRowStartDate: props.dateRowStartDate,
      },
    })
  }

  if (props.dateRowStartDate + 6 > maxDateCurMonth) {
    // if week spans across 2 months, display accordingly
    if (date < props.dateRowStartDate) {
      // current date selected is from the next month
      return (
        <DatesContainer>
          <DateRows
            firstDate={props.dateRowStartDate}
            assignedMonth={month - 1}
            lastDateOfThisMonth={maxDatePrevMonth}
            bufferDates={[]}
            facilityId={props.selectedFacilityId}
            onClickDate={onClickDate}
          />
          <DateRows
            firstDate={1}
            assignedMonth={month}
            lastDateOfThisMonth={props.dateRowStartDate + 6 - maxDatePrevMonth}
            bufferDates={[]}
            facilityId={props.selectedFacilityId}
            onClickDate={onClickDate}
          />
        </DatesContainer>
      )
    } else {
      // current date selected is from the previous month
      return (
        <DatesContainer>
          <DateRows
            firstDate={props.dateRowStartDate}
            assignedMonth={month}
            lastDateOfThisMonth={maxDateCurMonth}
            bufferDates={[]}
            facilityId={props.selectedFacilityId}
            onClickDate={onClickDate}
          />
          <DateRows
            firstDate={1}
            assignedMonth={month + 1}
            lastDateOfThisMonth={props.dateRowStartDate + 6 - maxDateCurMonth}
            bufferDates={[]}
            facilityId={props.selectedFacilityId}
            onClickDate={onClickDate}
          />
        </DatesContainer>
      )
    }
  } else {
    return (
      <DatesContainer>
        <DateRows
          firstDate={props.dateRowStartDate}
          assignedMonth={month}
          lastDateOfThisMonth={props.dateRowStartDate + 6}
          bufferDates={[]}
          facilityId={props.selectedFacilityId}
          onClickDate={onClickDate}
        />
      </DatesContainer>
    )
  }
}

export default DailyViewDatesRow
