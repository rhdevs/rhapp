import styled from 'styled-components'
import React from 'react'

import { FirstLastDateRow } from './FirstLastDateRow'
import { MiddleDateRows } from './MiddleDateRows'

export const MonthlyContainer = (props: { nthMonth: number; eventDates: number[] }) => {
  const today = new Date()
  const firstDateOfThisMonth = new Date(today.getFullYear(), today.getMonth() + props.nthMonth, 1).getDate()
  //console.log('To remove before merging PR, used for debugging')
  //console.log(today.getMonth() + props.nthMonth + 1)
  const assignedMonth = today.getMonth() + props.nthMonth + 1
  //console.log('First Date of this month ' + firstDateOfThisMonth)
  const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth() + props.nthMonth, 1).getDay()
  const lastDateOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1 + props.nthMonth, 0).getDate()
  const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1 + props.nthMonth, 1).getDay()
  const lastDateOfPreviousMonth = new Date(today.getFullYear(), today.getMonth() + props.nthMonth, 0).getDate()
  //console.log('First Day of this month ' + firstDayOfThisMonth)
  //console.log('First Day of next month ' + firstDayOfNextMonth)
  const startingDateForMiddleRow = firstDateOfThisMonth + 8 - firstDayOfThisMonth
  //console.log('Starting Date for middle row' + startingDateForMiddleRow)
  return (
    <>
      {FirstLastDateRow(firstDayOfThisMonth, lastDateOfPreviousMonth, true, assignedMonth, props.eventDates)}
      {MiddleDateRows(startingDateForMiddleRow, assignedMonth, props.eventDates)}
      {FirstLastDateRow(firstDayOfNextMonth, lastDateOfThisMonth, false, assignedMonth, props.eventDates)}
    </>
  )
}