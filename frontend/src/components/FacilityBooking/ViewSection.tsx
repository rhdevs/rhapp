import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { DailyContainer, MainContainer } from './BlockStyles'
import ViewBlock from './ViewBlock'
import { get24Hourtime } from '../../common/get24HourTime'
import { RootState } from '../../store/types'
import { getBlockHr } from './BookingSection'
import HourBlocks from './HourBlocks'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import CurrentTimeLine, { calcTop } from './CurrentTimeLine'

const ViewScheduleBlock = () => {
  const { selectedDayBookings } = useSelector((state: RootState) => state.facilityBooking)
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([])

  useEffect(() => {
    const newTimeblocks: TimeBlock[] = [...Array(24).keys()].map((num, index) => {
      const timestamp = Math.round(new Date().setHours(0, 0, 0, 0) / 1000) //might need to add 8 hours
      return {
        id: index,
        type: TimeBlockType.AVAILABLE,
        timestamp: timestamp + num * 3600,
      }
    })

    selectedDayBookings.forEach((booking) => {
      const startTime = getBlockHr(get24Hourtime(booking.startTime))
      const endTime = getBlockHr(get24Hourtime(booking.endTime))
      for (let hour = startTime; hour < endTime; hour++) {
        newTimeblocks[hour] = {
          ...timeBlocks[hour],
          ccaName: booking.ccaName,
          eventName: booking.eventName,
          type: TimeBlockType.OCCUPIED,
        }
      }
    })

    setTimeBlocks(newTimeblocks)
  }, [])

  return (
    <MainContainer>
      <CurrentTimeLine width={'calc(100% - 70px)'} right={'10px'} top={calcTop()} />
      <HourBlocks />
      <DailyContainer>
        {timeBlocks.map((entry, index) => (
          <ViewBlock key={index} entry={entry} />
        ))}
      </DailyContainer>
    </MainContainer>
  )
}
export default ViewScheduleBlock
