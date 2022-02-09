import { last } from 'lodash'
import React from 'react'

import { DateRows } from './DateRows'

export const MonthlyContainer = (props: { nthMonth: number }) => {
  const today = new Date()
  const firstDateOfThisMonth = new Date(today.getFullYear(), today.getMonth() + props.nthMonth, 1).getDate()
  const assignedMonth = today.getMonth() + props.nthMonth + 1
  const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth() + props.nthMonth, 1).getDay()
  const lastDateOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1 + props.nthMonth, 0).getDate()
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
    />
  )
}
