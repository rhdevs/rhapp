import React from 'react'
import { ClickableDateContainer, RedirectRoutes } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const DateRows = (props: {
  firstDate: number
  assignedMonth: number
  lastDateOfThisMonth: number
  bufferDates: number[]
  facilityId: number
  redirectTo?: RedirectRoutes
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
            redirectTo={props.redirectTo}
          />
        )
      })}
    </>
  )
}
