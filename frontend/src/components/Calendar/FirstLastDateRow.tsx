import styled from 'styled-components'
import React from 'react'

import { ClickableDateContainer } from './ClickableDateContainer'

export const FirstLastDateRow = (
  firstDayOfThisMonth: number,
  lastDateOfPreviousMonth: number,
  firstRow: boolean,
  assignedMonth: number,
  eventDates: number[],
) => {
  let newMonthDate = 1
  let firstDateToPut = lastDateOfPreviousMonth - firstDayOfThisMonth + 2
  if (firstDayOfThisMonth == 0) {
    firstDateToPut = lastDateOfPreviousMonth - 5
  }

  return firstRow ? (
    <>
      <ClickableDateContainer
        date={firstDateToPut++}
        isBlurred={true}
        assignedMonth={assignedMonth}
        eventDates={eventDates}
      />
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <ClickableDateContainer
          date={firstDateToPut++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <ClickableDateContainer
          date={firstDateToPut++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <ClickableDateContainer
          date={firstDateToPut++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <ClickableDateContainer
          date={firstDateToPut++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <ClickableDateContainer
          date={firstDateToPut++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
      ) : (
        <ClickableDateContainer
          date={firstDateToPut++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      )}
    </>
  ) : (
    <>
      <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer
          date={newMonthDate++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer
          date={newMonthDate++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer
          date={newMonthDate++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer
          date={newMonthDate++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer
          date={newMonthDate++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer
          date={newMonthDate++}
          isBlurred={true}
          assignedMonth={assignedMonth}
          eventDates={eventDates}
        />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} assignedMonth={assignedMonth} eventDates={eventDates} />
      )}
    </>
  )
}
