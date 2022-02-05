import React from 'react'

import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const FirstLastDateRow = (
  firstDayOfThisMonth: number,
  lastDateOfPreviousMonth: number,
  firstRow: boolean,
  assignedMonth: number,
  eventDates: number[],
) => {
  let newMonthDate = 1
  let firstDateToPut = lastDateOfPreviousMonth - firstDayOfThisMonth + 2
  console.log(firstDayOfThisMonth)
  if (firstDayOfThisMonth == 0) {
    firstDateToPut = lastDateOfPreviousMonth - 5
  }

  const days: number[] = [1, 2, 4, 5, 6, 7]

  return firstRow ? (
    <>
      {firstDateToPut++ > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <EmptyDateContainer />
      )}
      {firstDateToPut++ > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <EmptyDateContainer />
      )}
      {firstDateToPut++ > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <EmptyDateContainer />
      )}
      {firstDateToPut++ > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <EmptyDateContainer />
      )}
      {firstDateToPut++ > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <EmptyDateContainer />
      )}
      {firstDateToPut++ > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <EmptyDateContainer />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <EmptyDateContainer />
      )}
    </>
  ) : (
    <>
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <EmptyDateContainer />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <EmptyDateContainer />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <EmptyDateContainer />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <EmptyDateContainer />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <EmptyDateContainer />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <EmptyDateContainer />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <EmptyDateContainer />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
    </>
  )
}
