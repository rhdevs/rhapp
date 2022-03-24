import React from 'react'

import { DateRows } from './DateRows'

export const MonthlyContainer = (props: { currentDate: Date; nthMonth: number; facilityId: number }) => {
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

  return (
    <DateRows
      firstDate={firstDateOfThisMonth}
      assignedMonth={assignedMonth}
      lastDateOfThisMonth={lastDateOfThisMonth}
      bufferDates={bufferDates}
      facilityId={props.facilityId}
    />
  )
}
