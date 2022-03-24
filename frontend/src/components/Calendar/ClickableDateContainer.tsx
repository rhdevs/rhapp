import React from 'react'
import styled from 'styled-components'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'
import { setClickedDate } from '../../store/calendar/actions'
import { RootState } from '../../store/types'
import { PATHS } from '../../routes/Routes'

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
  cursor: pointer;
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
  assignedMonth: number
  facilityId: number
}) => {
  const dispatch = useDispatch()
  const history = useHistory()
  const { clickedDate, processedDates } = useSelector((state: RootState) => state.calendar)
  // const assignedDateMonth = props.assignedMonth * 100 + props.date
  const assignedDateMonth = new Date(props.date.getFullYear(), props.assignedMonth, props.date.getDate())

  const DateContainerClickHandler = (newClickedDate: Date) => {
    dispatch(setClickedDate(newClickedDate))
    history.push({
      pathname: PATHS.VIEW_FACILITY_BOOKING_DAILY_VIEW,
      state: {
        facilityId: props.facilityId,
        date: new Date(props.date.getFullYear(), props.date.getMonth(), props.date.getDate()),
      },
    })
  }

  const hasEvent = () => {
    return processedDates.find((processedDate) => processedDate === assignedDateMonth) !== undefined
  }

  const isCurrentDate = () => {
    const today = new Date()
    return today === assignedDateMonth
  }

  const isCurrentDateClicked = () => {
    return clickedDate === assignedDateMonth
  }

  return (
    <DateContainer
      onClick={() => DateContainerClickHandler(assignedDateMonth)}
      selected={isCurrentDateClicked()}
      currentDate={isCurrentDate()}
    >
      <EventIndicator selected={isCurrentDateClicked()} eventPresent={hasEvent()} />
      {props.date.getDate()}
    </DateContainer>
  )
}
