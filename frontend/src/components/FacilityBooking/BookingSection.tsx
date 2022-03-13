import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { DailyContainer, MainContainer } from './BlockStyles'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import BookingBlock from './BookingBlock'
import { RootState } from '../../store/types'
import { getTimeBlocks, setStartEndTime, setTimeBlocks } from '../../store/facilityBooking/action'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { isToday } from './CurrentTimeLine'
import { PATHS } from '../../routes/Routes'

export const getBlockHr = (hourString: string) => Number(hourString.slice(0, 2))

const BookingSection = () => {
  const { timeBlocks, selectedStartTime } = useSelector((state: RootState) => state.facilityBooking)
  const history = useHistory()
  const dispatch = useDispatch()
  const [selectedBlockTimestamp, setSelectedBlockTimestamp] = useState<number>(-1)
  const defaultTimePosition = 16 // 4pm (can range from 0 to 23 - length of timeBlocks)

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
      dispatch(setStartEndTime(selectedTimestamp))
      return
    }
    // Add 1 hour to selected block as end time
    dispatch(setStartEndTime(selectedStartTime, selectedTimestamp + 3600))
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
