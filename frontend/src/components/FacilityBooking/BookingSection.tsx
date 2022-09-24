import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'

import { PATHS } from '../../routes/Routes'
import {
  setBookingEndTime,
  setBookingStartTime,
  setSelectedBlockTimestamp,
  setSelectedEndTime,
  setSelectedStartTime,
  setTimeBlocks,
} from '../../store/facilityBooking/action'
import { RootState } from '../../store/types'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'

import CurrentTimeLine, { isToday } from './CurrentTimeLine'
import HourBlocks from './HourBlocks'
import BookingBlock from './BookingBlock'

import { DailyContainer, MainContainer } from './BlockStyles.styled'

/**
 *
 * @returns A section containing clickable timeblocks for booking
 *
 * @example
 * Call the component in a page that allows user to book timeslot for specific facility.
 * <BookingSection />
 *
 * @remarks
 */
export default function BookingSection() {
  const history = useHistory()
  const dispatch = useDispatch()
  const params = useParams<{ facilityId: string }>()
  const { timeBlocks, selectedBlockTimestamp, selectedStartTime, selectedEndTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )
  const selectedFacilityId = parseInt(params.facilityId)

  const defaultTimePosition = 16 // 4pm (can range from 0 to 23 - length of timeBlocks)

  useEffect(() => {
    updateTimeBlocks()
  }, [selectedBlockTimestamp])

  const assignType = (entry: TimeBlock): TimeBlockType => {
    if (entry.timestamp === selectedBlockTimestamp) return TimeBlockType.SELECTED
    if (entry.timestamp < selectedBlockTimestamp)
      return entry.type === TimeBlockType.AVAILABLE ? TimeBlockType.UNAVAILABLE : entry.type
    return entry.type
  }

  const updateTimeBlocks = () => {
    if (selectedStartTime === 0) return
    const newTimeblocks: TimeBlock[] = timeBlocks.map((entry) => {
      const type = assignType(entry)
      return { ...entry, type }
    })
    dispatch(setTimeBlocks(newTimeblocks))
  }

  const goToBookingPage = () => {
    history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${selectedFacilityId}`)
  }

  const setSelectedBlock = (selectedTimestamp: number) => {
    dispatch(setSelectedBlockTimestamp(selectedTimestamp))
    if (selectedStartTime === 0) {
      if (selectedEndTime === 0) {
        // selecting start time first before selecting end time
        dispatch(setSelectedStartTime(selectedTimestamp))
      } else {
        return // (reselect start time only without reselecting end time) disallowed for now
      }
    } else {
      // select end time (after start time is selected), then go to booking page
      const selectedEndTime = selectedTimestamp + 3600 // Add 1 hour to selected block as end time

      dispatch(setSelectedEndTime(selectedTimestamp))
      dispatch(setBookingStartTime(selectedStartTime))
      dispatch(setBookingEndTime(selectedEndTime))
      goToBookingPage()
    }
  }

  return (
    <MainContainer>
      <CurrentTimeLine />
      <HourBlocks />
      <DailyContainer>
        {timeBlocks.map((entry, index) => {
          return (
            <BookingBlock
              key={index}
              onClick={() => setSelectedBlock(entry.timestamp)}
              entry={entry}
              // if day selected is not current, scroll to defaultTimePosition
              // TODO doesn't work
              scrollTo={!isToday(timeBlocks[0].timestamp) && index === defaultTimePosition}
            />
          )
        })}
      </DailyContainer>
    </MainContainer>
  )
}
