import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { isSameDate } from '../../common/isSameDate'
import { EmptyDateContainer } from './Calendar.styled'

export const CustomDateRows = (props: {
  firstDate: Date
  lastDate: Date
  assignedMonth: number
  clickedDate?: Date
  disabledDates?: number[]
  onDateClick?: (date: Date) => void
}) => {
  const bufferDates: number[] = []

  for (let i = props.firstDate.getDate(); i < props.lastDate.getDate() + 1; i++) {
    bufferDates.push(i)
  }

  const DateContainer = (innerProps: { day: number }) => {
    const day = innerProps.day
    const date = new Date(props.firstDate.getFullYear(), props.assignedMonth, day)

    return day === 0 ? (
      <EmptyDateContainer />
    ) : (
      <ClickableDateContainer
        date={date}
        isClicked={props.clickedDate && isSameDate(props.clickedDate, date)}
        disabled={props.disabledDates?.includes(day)}
        onDateClick={props.onDateClick}
      />
    )
  }

  return (
    <>
      {bufferDates.map((day, idx) => {
        return <DateContainer day={day} key={idx} />
      })}
    </>
  )
}
