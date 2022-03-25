import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const DateRows = (props: { currentDate: Date; nthMonth: number; facilityId: number }) => {
  const assignedMonth = props.currentDate.getMonth() + props.nthMonth
  const firstDateOfThisMonth = new Date(props.currentDate.getFullYear(), assignedMonth, 1).getDate()
  const firstDayOfThisMonth = new Date(props.currentDate.getFullYear(), assignedMonth, 1).getDay()
  const lastDateOfThisMonth = new Date(props.currentDate.getFullYear(), assignedMonth + 1, 0).getDate()
  const bufferDates: number[] = []
  let keyCounter = 0

  if (firstDayOfThisMonth === 0) {
    for (let i = 1; i < 7; i++) {
      bufferDates.push(0)
    }
  } else {
    for (let i = 1; i < firstDayOfThisMonth; i++) {
      bufferDates.push(0)
    }
  }

  for (let i = firstDateOfThisMonth; i < lastDateOfThisMonth + 1; i++) {
    bufferDates.push(i)
  }
  return (
    <>
      {bufferDates.map((day) => {
        return day === 0 ? (
          <EmptyDateContainer key={keyCounter++} />
        ) : (
          <ClickableDateContainer
            key={new Date(props.currentDate.getFullYear(), assignedMonth, day).toDateString()}
            date={new Date(props.currentDate.getFullYear(), assignedMonth, day)}
            facilityId={props.facilityId}
          />
        )
      })}
    </>
  )
}
