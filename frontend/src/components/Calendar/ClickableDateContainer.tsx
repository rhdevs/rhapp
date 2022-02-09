import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { SetClickedDate } from '../../store/calendar/actions'
import { RootState } from '../../store/types'

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

export const ClickableDateContainer = (props: { date: number; eventPresent?: boolean; assignedMonth: number }) => {
  const dispatch = useDispatch()
  const { isThereADateClicked, clickedDate, processedDates } = useSelector((state: RootState) => state.calendar)
  const assignedDateMonth = props.assignedMonth * 100 + props.date

  const DateContainerClickHandler = (newClickedDate: number) => {
    dispatch(SetClickedDate(newClickedDate))
  }

  const hasEvent = () => {
    return processedDates.find((date) => date === assignedDateMonth) !== undefined
  }

  const isCurrentDate = () => {
    const today = new Date()
    const month = new Date(today).getMonth() + 1
    const day = new Date(today).getDate()
    const processedDate = month * 100 + day
    return processedDate === assignedDateMonth
  }

  const isCurrentDateClicked = () => {
    return isThereADateClicked && clickedDate === assignedDateMonth
  }

  return (
    <DateContainer
      onClick={() => DateContainerClickHandler(assignedDateMonth)}
      selected={isCurrentDateClicked()}
      currentDate={isCurrentDate()}
    >
      <EventIndicator selected={isCurrentDateClicked()} eventPresent={hasEvent()} />
      {props.date}
    </DateContainer>
  )
}
