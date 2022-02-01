import styled from 'styled-components'
import React from 'react'

import { FirstLastDateRow } from './FirstLastDateRow'
import { MiddleDateRows } from './MiddleDateRows'

export const MonthlyContainer = () => {
  const today = new Date()
  const firstDateOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDate()
  const firstDayOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay()
  const lastDateOfThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate()
  const firstDayOfNextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1).getDay()
  const lastDateOfPreviousMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate()
  return (
    <>
      {FirstLastDateRow(firstDayOfThisMonth, lastDateOfPreviousMonth, true)}
      {MiddleDateRows(firstDateOfThisMonth)}
      {FirstLastDateRow(firstDayOfNextMonth, lastDateOfThisMonth, false)}
    </>
  )
}
