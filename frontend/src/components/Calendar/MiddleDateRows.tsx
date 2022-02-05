import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'

export const MiddleDateRows = (firstDate: number, assignedMonth: number, eventDates: number[]) => {
  const days: number[] = []

  for (let i = firstDate; i < 28; i++) {
    days.push(i)
  }

  return (
    <>
      {days.map((day) => {
        return (
          <ClickableDateContainer key={day} date={firstDate++} assignedMonth={assignedMonth} eventDates={eventDates} />
        )
      })}
    </>
  )
}
