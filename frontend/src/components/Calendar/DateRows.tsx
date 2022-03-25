import React from 'react'
import { ClickableDateContainer, RedirectRoutes } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const DateRows = (props: {
  firstDate: number
  assignedMonth: number
  lastDateOfThisMonth: number
  bufferDates: number[]
  facilityId: number
  overlayDates?: number[]
  onClickDate: (date: Date) => void
}) => {
  for (let i = props.firstDate; i < props.lastDateOfThisMonth + 1; i++) {
    props.bufferDates.push(i)
  }

  return (
    <>
      {props.bufferDates.map((date) => {
        return date === 0 ? (
          <EmptyDateContainer />
        ) : (
          <ClickableDateContainer
            key={date + props.assignedMonth * 100}
            date={date}
            assignedMonth={props.assignedMonth}
            facilityId={props.facilityId}
            overlay={props.overlayDates?.includes(date)}
            onClickDate={props.onClickDate}
          />
        )
      })}
    </>
  )
}
