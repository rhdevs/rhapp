import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'

import { RootState } from '../../store/types'
import { CustomDateRows } from '../../components/Calendar/CustomDateRows'
import { setClickedDate } from '../../store/calendar/actions'

const DatesContainer = styled.div`
  display: flex;
  margin: auto;
`

/**
 *
 * @param selectedFacilityId (type `number`)
 * @param disabledDates (type `number[]`, optional)
 *
 * A row of 7 dates in a week (Sunday to Saturday) that users can click on to change the selected dates. To be used after a facility is selected by a user.
 *
 * ## Redux
 * ### useSelector variables
 * `clickedDate: Date` - the date that the user has clicked on the date row
 * ### Actions
 * `setClickedDate` - sets the `clickedDate` value to the date which the user has clicked on
 *
 * @example
 * ```
 * // user selected Thursday, 15 September 2020
 * // component will display dates |11 12 13 14 (15) 16 17| with 15th highlighted in dark green
 * // if current date is in date row and not selected, it will be highlighted in light green
 * <DailyViewDatesRow selectedFacilityId={1} />
 * ```
 *
 * @example
 * ```
 * // with disabledDates passed in, disabled dates will be greyed and not clickable
 * // the component below disables dates of the week before Thursday the 15th
 * <DailyViewDatesRow selectedFacilityId={1} disabledDates={[11, 12, 13, 14]} />
 * ```
 *
 * @remarks
 * <any remarks on this component type in here>
 *
 */

const DailyViewDatesRow = (props: { selectedFacilityId: number; disabledDates?: number[] }) => {
  const dispatch = useDispatch()
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

  const onDateClick = (newClickedDate: Date) => {
    dispatch(setClickedDate(newClickedDate))
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
          onDateClick={onDateClick}
        />
        <CustomDateRows
          firstDate={dateNumberToObject(1)}
          assignedMonth={date < dateRowStartDate ? month : month + 1}
          disabledDates={props.disabledDates}
          facilityId={props.selectedFacilityId}
          lastDate={dateNumberToObject(dateRowStartDate + 6 - lastDate.getDate())}
          onDateClick={onDateClick}
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
          onDateClick={onDateClick}
        />
      </DatesContainer>
    )
  }
}

export default DailyViewDatesRow
