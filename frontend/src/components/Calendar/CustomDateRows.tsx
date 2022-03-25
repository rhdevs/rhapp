import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const CustomDateRows = (props: {
  firstDate: Date
  lastDate: Date
  assignedMonth: number
  facilityId: number
}) => {
  const bufferDates: number[] = []
  let keyCounter = 0

  for (let i = props.firstDate.getDate(); i < props.lastDate.getDate() + 1; i++) {
    bufferDates.push(i)
  }

  return (
    <>
      {bufferDates.map((day) => {
        return day === 0 ? (
          <EmptyDateContainer key={keyCounter++} />
        ) : (
          <ClickableDateContainer
            key={new Date(props.firstDate.getFullYear(), props.assignedMonth, day).toDateString()}
            date={new Date(props.firstDate.getFullYear(), props.assignedMonth, day)}
            facilityId={props.facilityId}
          />
        )
      })}
    </>
  )
}
