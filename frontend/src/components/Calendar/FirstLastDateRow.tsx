import styled from 'styled-components'
import React from 'react'

import { ClickableDateContainer } from './ClickableDateContainer'

export const FirstLastDateRow = (firstDayOfThisMonth: number, lastDateOfPreviousMonth: number, firstRow: boolean) => {
  let newMonthDate = 1
  let firstDateToPut = lastDateOfPreviousMonth - firstDayOfThisMonth + 2
  if (firstDayOfThisMonth == 0) {
    firstDateToPut = lastDateOfPreviousMonth - 5
  }

  return firstRow ? (
    <>
      <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} isBlurred={true} />
      )}
    </>
  ) : (
    <>
      <ClickableDateContainer date={firstDateToPut++} />
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
      {firstDateToPut > lastDateOfPreviousMonth ? (
        <ClickableDateContainer date={newMonthDate++} isBlurred={true} />
      ) : (
        <ClickableDateContainer date={firstDateToPut++} />
      )}
    </>
  )
}
