import React, { useState } from 'react'
import styled from 'styled-components'

const DateContainer = styled.div<{ selected?: boolean; currentDate?: boolean }>`
  font-size: 12px;
  padding-top: 0px;
  padding-bottom: auto;
  text-align: center;
  height: 40px;
  width: 47.14px;
  color: ${(props) => (props.selected ? 'white' : props.currentDate ? '#58B994' : '')};
  border-radius: 40px;
  background-color: ${(props) => (props.selected ? '#468751' : props.currentDate ? '#D8E6DF' : '')};
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const EventIndicator = styled.div<{ selected?: boolean; eventPresent?: boolean }>`
  display: ${(props) => (props.eventPresent ? 'block' : 'none')};
  align-self: center;
  margin-top: -6px;
  margin-bottom: -1px;
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: ${(props) => (props.selected ? 'white' : '#468751')};
`

export const ClickableDateContainer = (props: {
  date: number
  eventPresent?: boolean
  assignedMonth: number
  eventDates: number[]
}) => {
  const assignedDateMonth = props.assignedMonth * 100 + props.date
  const [dateSelected, isDateSelected] = useState(false)
  const DateContainerClickHandler = () => {
    isDateSelected(!dateSelected)
    console.log('Date ' + assignedDateMonth + ' selected. Need to change color.')
  }

  const hasEvent = () => {
    return props.eventDates.find((date) => date === assignedDateMonth) !== undefined
  }

  const isCurrentDate = () => {
    const today = new Date()
    const month = new Date(today).getMonth() + 1
    const day = new Date(today).getDate()
    const processedDate = month * 100 + day
    return processedDate === assignedDateMonth
  }

  return (
    <DateContainer onClick={DateContainerClickHandler} selected={dateSelected} currentDate={isCurrentDate()}>
      <EventIndicator selected={dateSelected} eventPresent={hasEvent()} />
      {props.date}
    </DateContainer>
  )
}
