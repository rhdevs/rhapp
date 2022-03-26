import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { setClickedDate } from '../../store/calendar/actions'
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
  date: Date
  eventPresent?: boolean
  facilityId: number
  disabled?: boolean
  onClickDate: (date: Date) => void
}) => {
  const dispatch = useDispatch()
  const { clickedDate, processedDates } = useSelector((state: RootState) => state.calendar)
  const assignedDateMonth = new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate())

  const DateContainerClickHandler = (newClickedDate: Date) => {
    dispatch(setClickedDate(newClickedDate))
    props.onClickDate(newClickedDate)
  }

  const hasEvent = () => {
    return processedDates.find((processedDate) => processedDate === assignedDateMonth) !== undefined
  }

  const isCurrentDate = () => {
    const today = new Date()
    return today.toDateString() === assignedDateMonth.toDateString()
  }

  const isCurrentDateClicked = () => {
    return clickedDate.toDateString() === assignedDateMonth.toDateString()
  }

  return (
    <DateContainer
      onClick={() => !props.disabled && DateContainerClickHandler(assignedDateMonth)}
      selected={isCurrentDateClicked()}
      isCurrentDate={isCurrentDate()}
      disabled={props.disabled}
    >
      <EventIndicator selected={isCurrentDateClicked()} eventPresent={hasEvent()} />
      {props.date.getDate()}
    </DateContainer>
  )
}
