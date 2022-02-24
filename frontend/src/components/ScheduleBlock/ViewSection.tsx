import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { DailyContainer, MainContainer, MainTimeContainer, TimeContainer } from './BlockStyles'
import { ViewBookingEntry } from '../../store/facilityBooking/types'
import ViewBlock from './ViewBlock'
import { get24Hourtime } from '../../common/get24HourTime'
import { hourBlocks } from '../../store/stubs'
import { RootState } from '../../store/types'
import { getBlockHr } from './BookingSection'

const ViewScheduleBlock = () => {
  const { selectedDayBookings } = useSelector((state: RootState) => state.facilityBooking)
  const [timeBlocks, setTimeBlocks] = useState<ViewBookingEntry[]>([])

  useEffect(() => {
    const newTimeblocks: ViewBookingEntry[] = [...Array(24).keys()].map((num) => {
      const timestamp = Math.round(new Date().setHours(0, 0, 0, 0) / 1000) //might need to add 8 hours
      return {
        ccaName: '',
        eventName: '',
        isOccupied: false,
        id: timestamp + num * 3600,
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
          isOccupied: true,
        }
      }
    })

    setTimeBlocks(newTimeblocks)
  }, [])

  // useEffect(() => {
  //   for (let j = 0; j < resp.length; j++) {
  //     const starttime = getBlockHr(get24Hourtime(resp[j].startTime).toString())
  //     const endtime = getBlockHr(get24Hourtime(resp[j].endTime).toString())
  //     const diff = starttime + (endtime - starttime)
  //     for (let i = starttime; i < diff; i++) {
  //       fixedValues[i].ccaName = 'CCA NAME HERE'
  //       fixedValues[i].eventName = resp[j].eventName
  //       fixedValues[i].occupied = true
  //     }
  //   }
  // }, [])

  return (
    <MainContainer>
      <MainTimeContainer>
        {hourBlocks.map((hour, index) => (
          <TimeContainer key={index}>{hour}</TimeContainer>
        ))}
      </MainTimeContainer>
      <DailyContainer>
        {timeBlocks.map((entry, index) => (
          <ViewBlock key={index} bookingEntry={entry} />
        ))}
      </DailyContainer>
    </MainContainer>
  )
}
export default ViewScheduleBlock
