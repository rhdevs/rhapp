import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const CustomDateRows = (props: {
  firstDate: Date
  lastDate: Date
  assignedMonth: number
  facilityId: number
  disabledDates?: number[]
  onClickDate: (date: Date) => void
}) => {
  const bufferDates: number[] = []
  let keyCounter = 0

  for (let i = props.firstDate.getDate(); i < props.lastDate.getDate() + 1; i++) {
    bufferDates.push(i)
  }

  return (
    <>
      {bufferDates.map((date) => {
        return date === 0 ? (
          <EmptyDateContainer key={keyCounter++} />
        ) : (
          <ClickableDateContainer
            key={new Date(props.firstDate.getFullYear(), props.assignedMonth, date).toDateString()}
            date={new Date(props.firstDate.getFullYear(), props.assignedMonth, date)}
            facilityId={props.facilityId}
            disabled={props.disabledDates?.includes(date)}
            onClickDate={props.onClickDate}
          />
        )
      })}
    </>
  )
}
