import React from 'react'
import styled from 'styled-components'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/types'

const DateContainer = styled.div<{ selected?: boolean; isCurrentDate?: boolean; disabled?: boolean }>`
  font-size: 12px;
  padding-top: 0px;
  padding-bottom: auto;
  text-align: center;
  height: 40px;
  width: 47.14px;
  color: ${(props) => (props.selected ? 'white' : props.disabled ? '#888888' : props.isCurrentDate ? '#58B994' : '')};
  border-radius: 40px;
  background-color: ${(props) => (props.selected ? '#468751' : props.isCurrentDate ? '#D8E6DF' : '')};
  display: flex;
  justify-content: center;
  flex-direction: column;
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
`

const EventIndicator = styled.div<{ selected?: boolean; hasEvent?: boolean }>`
  display: ${(props) => (props.hasEvent ? 'block' : 'none')};
  align-self: center;
  margin-top: -6px;
  margin-bottom: -1px;
  height: 7px;
  width: 7px;
  border-radius: 50%;
  background-color: ${(props) => (props.selected ? 'white' : '#468751')};
`

export const ClickableDateContainer = (props: {
  date: Date
  hasEvent?: boolean
  disabled?: boolean
  onDateClick?: (date: Date) => void
}) => {
  const {
    clickedDate,
    // processedDates
  } = useSelector((state: RootState) => state.calendar)

  const DateContainerClickHandler = (newClickedDate: Date) => {
    props.onDateClick && props.onDateClick(newClickedDate)
  }
  2
  const hasEvent = () => {
    // TODO event indicator doesn't work yet
    return false
  }

  const isCurrentDate = () => {
    const today = new Date()
    return today.toDateString() === props.date.toDateString()
  }

  const isCurrentDateClicked = () => {
    return clickedDate.toDateString() === props.date.toDateString()
  }

  return (
    <DateContainer
      onClick={() => !props.disabled && DateContainerClickHandler(props.date)}
      selected={isCurrentDateClicked()}
      isCurrentDate={isCurrentDate()}
      disabled={props.disabled}
    >
      {/* TODO event indicator doesn't work yet */}
      <EventIndicator selected={isCurrentDateClicked()} hasEvent={hasEvent()} />
      {props.date.getDate()}
    </DateContainer>
  )
}
