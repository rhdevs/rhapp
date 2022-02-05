import styled from 'styled-components'
import React from 'react'

import { FirstLastDateRow } from './FirstLastDateRow'
import { MiddleDateRows } from './MiddleDateRows'

export const MonthlyContainer = (props: { nthMonth: number; eventDates: number[] }) => {
  const today = new Date()
  const firstDateOfThisMonth = new Date(today.getFullYear(), today.getMonth() + props.nthMonth, 1).getDate()
  const assignedMonth = today.getMonth() + props.nthMonth + 1
  const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth() + props.nthMonth, 1).getDay()
  const lastDateOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1 + props.nthMonth, 0).getDate()
  const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1 + props.nthMonth, 1).getDay()
  const lastDateOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() + props.nthMonth, 0).getDate()
  const startingDateForMiddleRow = firstDateOfThisMonth + 8 - firstDayOfThisMonth
  return (
    <>
      {FirstLastDateRow(firstDayOfThisMonth, lastDateOfPreviousMonth, true, assignedMonth, props.eventDates)}
      {MiddleDateRows(startingDateForMiddleRow, assignedMonth, props.eventDates)}
      {FirstLastDateRow(firstDayOfNextMonth, lastDateOfThisMonth, false, assignedMonth, props.eventDates)}
    </>
  )
}
