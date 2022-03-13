import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { DailyContainer, MainContainer } from './BlockStyles'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import BookingBlock from './BookingBlock'
import { RootState } from '../../store/types'
import {
  editBookingFromDate,
  editBookingToDate,
  getTimeBlocks,
  setTimeBlocks,
} from '../../store/facilityBooking/action'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { isToday } from './CurrentTimeLine'
import { PATHS } from '../../routes/Routes'

export const getBlockHr = (hourString: string) => Number(hourString.slice(0, 2))

const BookingSection = () => {
  const { timeBlocks } = useSelector((state: RootState) => state.facilityBooking)
  const history = useHistory()
  const dispatch = useDispatch()
  const [selectedBlockTimestamp, setSelectedBlockTimestamp] = useState<number>(-1)
  const defaultTimePosition = 16 // 4pm (can range from 0 to 23 - length of timeBlocks)

  const [selectedStartTime, setSelectedStartTime] = useState(-1)

  useEffect(() => {
    dispatch(getTimeBlocks())
  }, [])

  useEffect(() => {
    updateTimeBlocks()
  }, [selectedBlockTimestamp])

  function assignType(entry: TimeBlock): TimeBlockType {
    if (entry.timestamp === selectedBlockTimestamp) return TimeBlockType.SELECTED
    if (entry.timestamp < selectedBlockTimestamp)
      return entry.type === TimeBlockType.AVAILABLE ? TimeBlockType.UNAVAILABLE : entry.type
    return entry.type
  }

  function updateTimeBlocks() {
    if (selectedStartTime === -1) return
    const newTimeblocks: TimeBlock[] = timeBlocks.map((entry) => {
      const type = assignType(entry)
      return { ...entry, type }
    })
    dispatch(setTimeBlocks(newTimeblocks))
  }

  function setSelectedBlock(selectedTimestamp: number) {
    setSelectedBlockTimestamp(selectedTimestamp)

    if (selectedStartTime === -1) {
      setSelectedStartTime(selectedTimestamp)
      return
    }
    const selectedEndTime = selectedTimestamp + 3600 // Add 1 hour to selected block as end time
    const bookingFromDate = new Date(selectedStartTime * 1000)
    const bookingToDate = new Date(selectedEndTime * 1000)

    dispatch(editBookingFromDate(bookingFromDate))
    dispatch(editBookingToDate(bookingToDate))

    history.push(PATHS.CREATE_FACILITY_BOOKING)
  }

  return (
    <MainContainer>
      <CurrentTimeLine />
      <HourBlocks />
      <DailyContainer>
        {timeBlocks.map((entry, index) => (
          <BookingBlock
            key={index}
            selectedStartTime={selectedStartTime}
            onClick={() => setSelectedBlock(entry.timestamp)}
            entry={entry}
            // if day selected is not current, scroll to defaultTimePosition
            scrollTo={!isToday(timeBlocks[0].timestamp) && index === defaultTimePosition}
          />
        ))}
      </DailyContainer>
    </MainContainer>
  )
}
export default BookingSection
