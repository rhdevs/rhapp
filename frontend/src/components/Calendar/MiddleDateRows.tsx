import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const MiddleDateRows = (
  firstDate: number,
  assignedMonth: number,
  eventDates: number[],
  firstDayOfThisMonth: number,
  lastDateOfThisMonth: number,
  bufferDates: number[],
) => {
  for (let i = firstDate; i < lastDateOfThisMonth + 1; i++) {
    bufferDates.push(i)
  }

  return (
    <>
      {bufferDates.map((day) => {
        if (day === 0) {
          return <EmptyDateContainer />
        } else {
          return (
            <ClickableDateContainer
              key={day}
              date={firstDate++}
              assignedMonth={assignedMonth}
              eventDates={eventDates}
            />
          )
        }
      })}
    </>
  )
}
