import { PropertySafetyFilled } from '@ant-design/icons'
import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const DateRows = (props: {
  year: number
  firstDate: number
  assignedMonth: number
  lastDateOfThisMonth: number
  bufferDates: number[]
  facilityId: number
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
            year={props.year}
            key={day + props.assignedMonth * 100}
            date={day}
            assignedMonth={props.assignedMonth}
            facilityId={props.facilityId}
          />
        )
      })}
    </>
  )
}
