import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DailyContainer, MainContainer, MainTimeContainer, TimeContainer } from './BlockStyles'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { get24Hourtime } from '../../common/get24HourTime'
import BookingBlock from './BookingBlock'
import { RootState } from '../../store/types'
import { setStartEndTime, setTimeBlocks } from '../../store/facilityBooking/action'
import { hourBlocks } from '../../store/stubs'

export const getBlockHr = (s: string) => {
  s = s.slice(0, 2)
  return Number(s)
}

const BookingSection = () => {
  const { selectedDayBookings, timeBlocks, selectedStartTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )
  const dispatch = useDispatch()
  const [selectedBlockId, setSelectedBlockId] = useState<number>(-1)

  useEffect(() => {
    const newTimeblocks: TimeBlock[] = [...Array(24).keys()].map((num) => {
      const timestamp = Math.round(new Date().setHours(0, 0, 0, 0) / 1000) //might need to add 8 hours
      return { id: timestamp + num * 3600, type: TimeBlockType.AVAILABLE }
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
      let flag = false
      const newTimeblocks: TimeBlock[] = timeBlocks.map((entry) => {
        let type = entry.type
        if (entry.id === selectedBlockId) {
          type = TimeBlockType.SELECTED
        } else if (entry.id < selectedBlockId) {
          type = type === TimeBlockType.AVAILABLE ? TimeBlockType.UNAVAILABLE : type
        } else {
          if (entry.type === TimeBlockType.OCCUPIED) {
            flag = true
          }
          if (flag) {
            type = type === TimeBlockType.AVAILABLE ? TimeBlockType.UNAVAILABLE : type
          }
        }
        return { ...entry, type }
      })
      dispatch(setTimeBlocks(newTimeblocks))
    }
  }, [selectedBlockId])

  function setSelectedBlock(selectedId: number) {
    setSelectedBlockId(selectedId)
    if (selectedStartTime === -1) {
      dispatch(setStartEndTime(selectedId))
    } else {
      //Add 1 hour to selected block as end time
      dispatch(setStartEndTime(selectedStartTime, selectedId + 3600))
      console.log('go to create booking page!')
    }
  }

  return (
    <MainContainer>
      <MainTimeContainer>
        {hourBlocks.map((hour, index) => (
          <TimeContainer key={index}>{hour}</TimeContainer>
        ))}
      </MainTimeContainer>
      <DailyContainer>
        {timeBlocks.map((block) => (
          <BookingBlock onClick={() => setSelectedBlock(block.id)} key={block.id} bookingEntry={block} />
        ))}
      </DailyContainer>
    </MainContainer>
  )
}
export default BookingSection
