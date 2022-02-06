import React, { useState } from 'react'
import styled from 'styled-components'

const DateContainer = styled.div<{ selected?: boolean; currentDate?: boolean }>`
  font-size: 12px;
  padding-top: 0px;
  padding-bottom: auto;
  text-align: center;
  height: 40px;
  width: 47.14px;
  color: ${(prop) => (prop.selected ? 'white' : prop.currentDate ? '#58B994' : '')};
  border-radius: 40px;
  background-color: ${(prop) => (prop.selected ? '#468751' : !prop.selected && prop.currentDate ? '#D8E6DF' : '')};
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const EventIndicator = styled.div<{ selected?: boolean; eventPresent?: boolean }>`
  display: ${(prop) => (prop.eventPresent ? 'block' : 'none')};
  align-self: center;
  margin-top: -6px;
  margin-bottom: -1px;
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: ${(prop) => (prop.selected ? 'white' : '#468751')};
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

  const checkEventPresence = () => {
    if (props.eventDates.find((date) => date === assignedDateMonth)) {
      return true
    }
  }

  const checkCurrentDate = () => {
    const today = new Date()
    const month = new Date(today).getMonth() + 1
    const day = new Date(today).getDate()
    const processedDate = month * 100 + day
    if (processedDate === assignedDateMonth) {
      return true
    }
  }

  return (
    <DateContainer onClick={DateContainerClickHandler} selected={dateSelected} currentDate={checkCurrentDate()}>
      <EventIndicator selected={dateSelected} eventPresent={checkEventPresence()} />
      {props.date}
    </DateContainer>
  )
}
