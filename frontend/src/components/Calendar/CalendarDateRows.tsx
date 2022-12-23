import React from 'react'
import { ClickableDateContainer } from './ClickableDateContainer'
import { EmptyDateContainer } from './EmptyDateContainer'

export const CalendarDateRows = (props: {
  currentDate: Date
  nthMonth: number
  clickedDate?: Date
  overlayDates?: number[]
  onDateClick: (date: Date) => void
}) => {
  const assignedMonth = props.currentDate.getMonth() + props.nthMonth
  const firstDateOfThisMonth = new Date(props.currentDate.getFullYear(), assignedMonth, 1).getDate()
  const firstDayOfThisMonth = new Date(props.currentDate.getFullYear(), assignedMonth, 1).getDay()
  const lastDateOfThisMonth = new Date(props.currentDate.getFullYear(), assignedMonth + 1, 0).getDate()
  const bufferDates: number[] = []

  if (firstDayOfThisMonth === 0) {
    for (let i = 1; i < 7; i++) {
      bufferDates.push(0)
    }
  } else {
    for (let i = 1; i < firstDayOfThisMonth; i++) {
      bufferDates.push(0)
    }
  }

  for (let i = firstDateOfThisMonth; i < lastDateOfThisMonth + 1; i++) {
    bufferDates.push(i)
  }

  const DateContainer = (innerProps: { day: number }) => {
    const day = innerProps.day
    const date = new Date(props.currentDate.getFullYear(), assignedMonth, day)

    return day === 0 ? (
      <EmptyDateContainer />
    ) : (
      <ClickableDateContainer
        date={date}
        isClicked={props.clickedDate?.toDateString() === date.toDateString()}
        disabled={props.overlayDates?.includes(day)}
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
