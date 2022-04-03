import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

import { DailyContainer, MainContainer } from './BlockStyles'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import BookingBlock from './BookingBlock'
import { RootState } from '../../store/types'
import {
  setBookingEndTime,
  setBookingStartTime,
  setSelectedBlockTimestamp,
  setSelectedEndTime,
  setSelectedStartTime,
  setTimeBlocks,
} from '../../store/facilityBooking/action'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { isToday } from './CurrentTimeLine'
import { PATHS } from '../../routes/Routes'

export const getBlockHr = (hourString: string) => Number(hourString.slice(0, 2))

type Props = {
  facilityId: number
  date: Date
}

export default function BookingSection({ facilityId, date }: Props) {
  const history = useHistory()
  const dispatch = useDispatch()
  const { timeBlocks, selectedBlockTimestamp, selectedStartTime, selectedEndTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

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
    history.push(`${PATHS.CREATE_FACILITY_BOOKING}/${facilityId}`)
  }

  const setSelectedBlock = (selectedTimestamp: number) => {
    dispatch(setSelectedBlockTimestamp(selectedTimestamp))
    if (selectedStartTime === 0) {
      if (selectedEndTime === 0) {
        // selecting start time first before selecting end time
        dispatch(setSelectedStartTime(selectedTimestamp))
      } else {
        // reselecting start time only, then go back to booking page
        if (selectedTimestamp > selectedEndTime) {
          return alert('start time should be earlier than end time!')
        }
        dispatch(setSelectedStartTime(selectedTimestamp))
        dispatch(setBookingStartTime(selectedTimestamp))
        goToBookingPage()
      }
    } else {
      if (selectedEndTime === 0) {
        // select end time (after start time is selected), then go to booking page
        const selectedEndTime = selectedTimestamp + 3600 // Add 1 hour to selected block as end time

        dispatch(setSelectedEndTime(selectedTimestamp))
        dispatch(setBookingStartTime(selectedStartTime))
        dispatch(setBookingEndTime(selectedEndTime))
        goToBookingPage()
      } else {
        // disallowed case
        return
      }
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
