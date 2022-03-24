import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const DateRows = (props: { currentDate: Date; nthMonth: number; facilityId: number }) => {
  const firstDateOfThisMonth = new Date(
    props.currentDate.getFullYear(),
    props.currentDate.getMonth() + props.nthMonth,
    1,
  ).getDate()
  const assignedMonth = props.currentDate.getMonth() + props.nthMonth
  const firstDayOfThisMonth = new Date(
    props.currentDate.getFullYear(),
    props.currentDate.getMonth() + props.nthMonth,
    1,
  ).getDay()
  const lastDateOfThisMonth = new Date(
    props.currentDate.getFullYear(),
    props.currentDate.getMonth() + 1 + props.nthMonth,
    0,
  ).getDate()
  const bufferDates: number[] = []

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
          <EmptyDateContainer />
        ) : (
          <ClickableDateContainer
            key={day + assignedMonth * 100}
            date={day}
            assignedMonth={assignedMonth}
            facilityId={props.facilityId}
          />
        )
      })}
    </>
  )
}
