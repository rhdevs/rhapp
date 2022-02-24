import React, { useEffect, useState } from 'react'
import { DailyContainer } from './BlockStyles'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { get24Hourtime } from '../../common/get24HourTime'
import BookingBlock from './BookingBlock'

import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import { setStartEndTimeId, setTimeBlocks } from '../../store/facilityBooking/action'

const N = 24

const getBlockHr = (s: string) => {
  s = s.slice(0, 2)
  return Number(s)
}

const BookingSection = () => {
  const { selectedDayBookings, timeBlocks, startTimeId } = useSelector((state: RootState) => state.facilityBooking)
  const dispatch = useDispatch()
  const [selectedBlockId, setSelectedBlockId] = useState<number>(-1)

  useEffect(() => {
    const newTimeblocks = timeBlocks.map((entry) => {
      for (let i = 0; i < selectedDayBookings.length; i++) {
        const starttime = getBlockHr(get24Hourtime(selectedDayBookings[i].startTime))
        const endtime = getBlockHr(get24Hourtime(selectedDayBookings[i].endTime))
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
    if (startTimeId !== -1) {
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
    if (startTimeId === -1) {
      dispatch(setStartEndTimeId(selectedId))
    } else {
      dispatch(setStartEndTimeId(startTimeId, selectedId))
      console.log('go to create booking page!')
    }
  }

  return (
    <DailyContainer>
      {timeBlocks.map((hourBlock) => {
        return (
          <BookingBlock onClick={() => setSelectedBlock(hourBlock.id)} key={hourBlock.id} bookingEntry={hourBlock} />
        )
      })}
    </DailyContainer>
  )
}
export default BookingSection
