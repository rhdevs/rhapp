import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DailyContainer, MainContainer } from './BlockStyles'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { get24Hourtime } from '../../common/get24HourTime'
import BookingBlock from './BookingBlock'
import { RootState } from '../../store/types'
import { setStartEndTime, setTimeBlocks } from '../../store/facilityBooking/action'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { calcTop } from './CurrentTimeLine'

export const getBlockHr = (hourString: string) => Number(hourString.slice(0, 2))

const BookingSection = () => {
  const { selectedDayBookings, timeBlocks, selectedStartTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )
  const dispatch = useDispatch()
  const [selectedBlockTimestamp, setSelectedBlockTimestamp] = useState<number>(-1)

  useEffect(() => {
    const newTimeblocks: TimeBlock[] = [...Array(24).keys()].map((num, index) => {
      const timestamp = Math.round(new Date().setHours(0, 0, 0, 0) / 1000) //might need to add 8 hours
      return { id: index, timestamp: timestamp + num * 3600, type: TimeBlockType.AVAILABLE }
    })

    selectedDayBookings.forEach((booking) => {
      const startTime = getBlockHr(get24Hourtime(booking.startTime))
      const endTime = getBlockHr(get24Hourtime(booking.endTime))
      for (let hour = startTime; hour < endTime; hour++) {
        newTimeblocks[hour] = {
          ...timeBlocks[hour],
          type: TimeBlockType.OCCUPIED,
        }
      }
    })

    dispatch(setTimeBlocks(newTimeblocks))
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
      console.log('go to create booking page!')
    }
  }

  return (
    <MainContainer>
      <CurrentTimeLine width={'calc(100% - 70px)'} right={'10px'} top={calcTop()} />
      <HourBlocks />
      <DailyContainer>
        {timeBlocks.map((entry, index) => (
          <BookingBlock key={index} onClick={() => setSelectedBlock(entry.timestamp)} entry={entry} />
        ))}
      </DailyContainer>
    </MainContainer>
  )
}
export default BookingSection
