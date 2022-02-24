import React, { useEffect, useState } from 'react'
import ViewBooking from '../../routes/FacilityBooking/ViewBooking'
import { DailyContainer } from './BlockStyles'
import { APIEntry, BookingEntry, BookingStatusEntry } from '../../store/facilityBooking/types'
import { get24Hourtime } from '../../common/get24HourTime'
import AbstractPicker from 'antd-mobile/lib/picker/AbstractPicker'
import BookingBlock from './BookingBlock'

import { defaultTimeBlocks } from '../../store/stubs'
import { start } from 'repl'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/types'

const N = 24

const getBlockHr = (s: string) => {
  s = s.slice(0, 2)
  return Number(s)
}

type TimeBlock = {
  id: number
  type: string
}

const BookingSection = () => {
  const [timeBlocks, setTimeblock] = useState<TimeBlock[]>(defaultTimeBlocks)
  const [selectedId, setSelectedId] = useState(-1)

  const { facilityBookings } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    const newTimeblocks = timeBlocks.map((entry) => {
      for (let i = 0; i < facilityBookings.length; i++) {
        const starttime = getBlockHr(get24Hourtime(facilityBookings[i].startTime))
        const endtime = getBlockHr(get24Hourtime(facilityBookings[i].endTime))
        if (entry.id >= starttime && entry.id < endtime) {
          const updateStatus = {
            ...entry,
            type: 'occupied',
          }
          return updateStatus
        }
      }
      return entry
    })
    setTimeblock(newTimeblocks)
  }, [])

  useEffect(() => {
    if (selectedId !== -1) {
      let flag = false
      const newTimeblocks: TimeBlock[] = timeBlocks.map((entry) => {
        let type = entry.type
        if (entry.id === selectedId) {
          type = 'selected'
        } else if (entry.id < selectedId) {
          type = type === 'available' ? 'unavailable' : type
        } else {
          if (entry.type === 'occupied') {
            flag = true
          }
          if (flag) {
            type = type === 'available' ? 'unavailable' : type
          }
        }
        return { ...entry, type }
      })
      setTimeblock(newTimeblocks)
    }
  }, [selectedId])

  return (
    <DailyContainer>
      {timeBlocks.map((hourblock) => {
        console.log(timeBlocks)
        return <BookingBlock onClick={() => setSelectedId(hourblock.id)} key={hourblock.id} bookingEntry={hourblock} />
      })}
    </DailyContainer>
  )
}
export default BookingSection
