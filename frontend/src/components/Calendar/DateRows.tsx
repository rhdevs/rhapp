import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const DateRows = (props: {
  firstDate: number
  assignedMonth: number
  lastDateOfThisMonth: number
  bufferDates: number[]
}) => {
  for (let i = props.firstDate; i < props.lastDateOfThisMonth + 1; i++) {
    props.bufferDates.push(i)
  }

  return (
    <>
      {props.bufferDates.map((day) => {
        if (day === 0) {
          return <EmptyDateContainer />
        } else {
          return (
            <ClickableDateContainer
              key={day + props.assignedMonth * 100}
              date={day}
              assignedMonth={props.assignedMonth}
            />
          )
        }
      })}
    </>
  )
}
