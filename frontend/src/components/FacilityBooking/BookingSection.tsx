import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { DailyContainer, MainContainer } from './BlockStyles'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import BookingBlock from './BookingBlock'
import { RootState } from '../../store/types'
import {
  getTimeBlocks,
  setBookingEndTime,
  setBookingStartTime,
  setSelectedBlockTimestamp,
  setSelectedStartTime,
  setTimeBlocks,
} from '../../store/facilityBooking/action'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { isToday } from './CurrentTimeLine'
import { PATHS } from '../../routes/Routes'

export const getBlockHr = (hourString: string) => Number(hourString.slice(0, 2))

type Props = {
  redirectPath: PATHS
  facilityId: number
  date: Date
}

export default function BookingSection({ redirectPath, facilityId, date }: Props) {
  const history = useHistory()
  const dispatch = useDispatch()
  const { timeBlocks, selectedBlockTimestamp, selectedStartTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )
  const { clickedDate } = useSelector((state: RootState) => state.calendar)

  // const [selectedBlockTimestamp, setSelectedBlockTimestamp] = useState<number>(-1)
  // const [selectedStartTime, setSelectedStartTime] = useState(-1)

  const defaultTimePosition = 16 // 4pm (can range from 0 to 23 - length of timeBlocks)

  useEffect(() => {
    dispatch(getTimeBlocks(new Date(2022, Math.floor(clickedDate / 100), clickedDate % 100)))
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
    if (selectedStartTime === 0) return
    const newTimeblocks: TimeBlock[] = timeBlocks.map((entry) => {
      const type = assignType(entry)
      return { ...entry, type }
    })
    dispatch(setTimeBlocks(newTimeblocks))
  }

  function setSelectedBlock(selectedTimestamp: number) {
    dispatch(setSelectedBlockTimestamp(selectedTimestamp))

    if (selectedStartTime === 0) {
      dispatch(setSelectedStartTime(selectedTimestamp))
      return
    }
    const selectedEndTime = selectedTimestamp + 3600 // Add 1 hour to selected block as end time

    dispatch(setBookingStartTime(selectedStartTime))
    dispatch(setBookingEndTime(selectedEndTime))

    history.push({
      pathname: redirectPath ?? PATHS.CREATE_FACILITY_BOOKING,
      state: {
        facilityId: facilityId,
        date: date,
      },
    })
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
              selectedStartTime={selectedStartTime}
              onClick={() => setSelectedBlock(entry.timestamp)}
              entry={entry}
              // if day selected is not current, scroll to defaultTimePosition TODO doesn't work
              scrollTo={!isToday(timeBlocks[0].timestamp) && index === defaultTimePosition}
            />
          )
        })}
      </DailyContainer>
    </MainContainer>
  )
}
