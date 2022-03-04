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
import { setDefaultTimePosition } from './ViewSection'

export const getBlockHr = (hourString: string) => Number(hourString.slice(0, 2))

const BookingSection = () => {
  const { timeBlocks, selectedStartTime } = useSelector((state: RootState) => state.facilityBooking)
  const history = useHistory()
  const dispatch = useDispatch()
  const [selectedBlockTimestamp, setSelectedBlockTimestamp] = useState<number>(-1)
  let defaultTimePosition = 16 //4pm

  useEffect(() => {
    dispatch(getTimeBlocks())
    defaultTimePosition = setDefaultTimePosition(defaultTimePosition, timeBlocks.length)
  }, [])

  useEffect(() => {
    if (selectedStartTime !== -1) {
      let isAfterOccupied = false
      const newTimeblocks: TimeBlock[] = timeBlocks.map((entry) => {
        let type = entry.type
        if (entry.timestamp === selectedBlockTimestamp) {
          type = TimeBlockType.SELECTED
        } else if (entry.timestamp < selectedBlockTimestamp) {
          type = type === TimeBlockType.AVAILABLE ? TimeBlockType.UNAVAILABLE : type
        } else {
          if (entry.type === TimeBlockType.OCCUPIED) {
            isAfterOccupied = true
          }
          if (isAfterOccupied) {
            type = type === TimeBlockType.AVAILABLE ? TimeBlockType.UNAVAILABLE : type
          }
        }
        return { ...entry, type }
      })
      dispatch(setTimeBlocks(newTimeblocks))
    }
  }, [selectedBlockTimestamp])

  function setSelectedBlock(selectedTimestamp: number) {
    setSelectedBlockTimestamp(selectedTimestamp)
    if (selectedStartTime === -1) {
      dispatch(setStartEndTime(selectedTimestamp))
    } else {
      //Add 1 hour to selected block as end time
      dispatch(setStartEndTime(selectedStartTime, selectedTimestamp + 3600))
      history.push(PATHS.CREATE_FACILITY_BOOKING)
    }
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
