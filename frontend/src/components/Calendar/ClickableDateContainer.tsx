import React from 'react'
import styled from 'styled-components'
import { REVAMP_GREEN } from '../../common/colours'
import { isSameDate } from '../../common/isSameDate'

const DateContainer = styled.div<{ selected?: boolean; isCurrentDate?: boolean; disabled?: boolean }>`
  font-size: 12px;
  padding-top: 0px;
  padding-bottom: auto;
  text-align: center;
  height: 40px;
  width: 47.14px;
  color: ${(props) => (props.selected ? 'white' : props.disabled ? '#888888' : props.isCurrentDate ? '#58B994' : '')};
  border-radius: 40px;
  background-color: ${(props) => (props.selected ? REVAMP_GREEN : props.isCurrentDate ? '#D8E6DF' : '')};
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
  background-color: ${(props) => (props.selected ? 'white' : REVAMP_GREEN)};
`

export const ClickableDateContainer = (props: {
  date: Date
  isClicked?: boolean
  hasEvent?: boolean
  disabled?: boolean
  onDateClick?: (date: Date) => void
}) => {
  const DateContainerClickHandler = (newClickedDate: Date) => {
    props.onDateClick && props.onDateClick(newClickedDate)
  }

  const hasEvent = () => {
    // TODO event indicator doesn't work yet
    return false
  }

  return (
    <DateContainer
      onClick={() => !props.disabled && DateContainerClickHandler(props.date)}
      selected={props.isClicked}
      isCurrentDate={isSameDate(new Date(), props.date)}
      disabled={props.disabled}
    >
      {/* TODO event indicator doesn't work yet */}
      <EventIndicator selected={props.isClicked} hasEvent={hasEvent()} />
      {props.date.getDate()}
    </DateContainer>
  )
}
