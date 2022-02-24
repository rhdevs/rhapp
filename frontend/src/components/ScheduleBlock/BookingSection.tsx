import React, { useEffect } from 'react'
import { DailyContainer } from './BlockStyles'
import { APIEntry, BookingEntry, BookingStatusEntry, TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { get24Hourtime } from '../../common/get24HourTime'
import BookingBlock from './BookingBlock'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { setTimeBlocks } from '../../store/facilityBooking/action'

const N = 24

const getBlockHr = (s: string) => {
  s = s.slice(0, 2)
  return Number(s)
}

const BookingSection = () => {
  const { facilityBookings, timeBlocks, selectedBlockId } = useSelector((state: RootState) => state.facilityBooking)
  const dispatch = useDispatch()

  useEffect(() => {
    const newTimeblocks = timeBlocks.map((entry) => {
      for (let i = 0; i < facilityBookings.length; i++) {
        const starttime = getBlockHr(get24Hourtime(facilityBookings[i].startTime))
        const endtime = getBlockHr(get24Hourtime(facilityBookings[i].endTime))
        if (entry.id >= starttime && entry.id < endtime) {
          const updateStatus = {
            ...entry,
            type: TimeBlockType.OCCUPIED,
          }
          return updateStatus
        }
      }
      return entry
    })
    dispatch(setTimeBlocks(newTimeblocks))
  }, [])

  useEffect(() => {
    if (selectedBlockId !== -1) {
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

  return (
    <DailyContainer>
      {timeBlocks.map((hourblock) => {
        console.log(timeBlocks)
        return (
          <BookingBlock
            onClick={() => dispatch(setTimeBlocks(undefined, hourblock.id))}
            key={hourblock.id}
            bookingEntry={hourblock}
          />
        )
      })}
    </DailyContainer>
  )
}
export default BookingSection
