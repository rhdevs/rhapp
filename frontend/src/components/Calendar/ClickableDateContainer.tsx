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

const EventIndicator = styled.div<{ selected?: boolean }>`
  position: absolute;
  align-self: center;
  margin-top: -24px;
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: ${(prop) => (prop.selected ? 'white' : '#468751')};
`

export const ClickableDateContainer = (props: { date: number; isBlurred: boolean }) => {
  const [dateSelected, isDateSelected] = useState(false)
  const DateContainerClickHandler = () => {
    isDateSelected(!dateSelected)
    console.log('Date selected. Need to change color.')
  }

  return (
    // <DateContainer onClick={() => DateContainerClickHandler()} blurred={isBlurred} selected={dateSelected}>
    <DateContainer onClick={DateContainerClickHandler} blurred={props.isBlurred} selected={dateSelected}>
      <EventIndicator selected={dateSelected} />
      {props.date}
    </DateContainer>
  )
}
