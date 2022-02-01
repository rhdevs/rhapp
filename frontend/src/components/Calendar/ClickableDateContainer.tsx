import styled from 'styled-components'
import React, { useState } from 'react'

const DateContainer = styled.div<{ blurred?: boolean; selected?: boolean }>`
  font-size: 12px;
  padding-top: auto;
  padding-bottom: auto;
  text-align: center;
  height: 40px;
  width: 47.14px;
  color: ${(prop) => (prop.blurred ? '#d4d4d4' : prop.selected ? 'white' : '')};
  border: 0.5px solid white;
  border-radius: 40px;
  background-color: ${(prop) => (prop.selected ? '#468751' : ' white')};
  display: flex;
  justify-content: center;
  flex-direction: column;
`

const EventIndicator = styled.div<{ selected?: boolean; eventPresent?: boolean }>`
  display: ${(prop) => (prop.eventPresent ? 'block' : 'none')};
  position: absolute;
  align-self: center;
  margin-top: -24px;
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: ${(prop) => (prop.selected ? 'white' : '#468751')};
`

export const ClickableDateContainer = (props: {
  date: number
  isBlurred?: boolean
  eventPresent?: boolean
  assignedMonth: number
  eventDates: number[]
}) => {
  const [dateSelected, isDateSelected] = useState(false)
  const DateContainerClickHandler = () => {
    isDateSelected(!dateSelected)
    console.log('Date selected. Need to change color.')
    console.log(props.date)
    console.log(props.assignedMonth)
    const assignedDateMonth = props.assignedMonth * 100 + props.date
    console.log(assignedDateMonth)
    console.log(props.eventDates)
  }

  const checkEventPresence = () => {
    const assignedDateMonth = props.assignedMonth * 100 + props.date
    if (props.eventDates.find((date) => date === assignedDateMonth)) {
      return true
    }
  }

  return (
    // <DateContainer onClick={() => DateContainerClickHandler()} blurred={isBlurred} selected={dateSelected}>
    <DateContainer onClick={DateContainerClickHandler} blurred={props.isBlurred} selected={dateSelected}>
      <EventIndicator selected={dateSelected} eventPresent={checkEventPresence()} />
      {props.date}
    </DateContainer>
  )
}
