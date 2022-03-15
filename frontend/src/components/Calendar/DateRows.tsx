import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const DateRows = (props: {
  firstDate: number
  assignedMonth: number
  lastDateOfThisMonth: number
  bufferDates: number[]
  facilityId: number
  noRedirect?: boolean
}) => {
  for (let i = props.firstDate; i < props.lastDateOfThisMonth + 1; i++) {
    props.bufferDates.push(i)
  }

  return (
    <>
      {props.bufferDates.map((day) => {
        return day === 0 ? (
          <EmptyDateContainer />
        ) : (
          <ClickableDateContainer
            key={day + props.assignedMonth * 100}
            date={day}
            assignedMonth={props.assignedMonth}
            facilityId={props.facilityId}
            noRedirect={props.noRedirect}
          />
        )
      })}
    </>
  )
}
