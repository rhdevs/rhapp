import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { DailyContainer, MainContainer } from './BlockStyles'
import ViewBlock from './ViewBlock'
import { RootState } from '../../store/types'
import HourBlocks from './HourBlocks'
import CurrentTimeLine, { isToday } from './CurrentTimeLine'
import { getTimeBlocks } from '../../store/facilityBooking/action'
import { ViewBookingCard } from './ViewBookingCard'
import { Booking } from '../../store/facilityBooking/types'

const ViewScheduleBlock = () => {
  const { timeBlocks } = useSelector((state: RootState) => state.facilityBooking)
  const dispatch = useDispatch()
  const [isViewBookingModalOpen, setIsViewBookingModalOpen] = useState<boolean>()
  const [viewBooking, setViewBooking] = useState<Booking>()
  const defaultTimePosition = 16 //4pm (can range from 0 to 23 - length of timeBlocks)

  useEffect(() => {
    dispatch(getTimeBlocks(new Date()))
  }, [])

  // passing entry ID instead of booking object which might be undefind
  const fetchBooking = (entryId: number) => {
    setViewBooking(timeBlocks[entryId].booking)
  }

  return (
    <>
      {isViewBookingModalOpen && (
        <ViewBookingCard booking={viewBooking} onClickFunction={() => setIsViewBookingModalOpen(false)} />
      )}
      <MainContainer>
        <CurrentTimeLine />
        <HourBlocks />
        <DailyContainer>
          {timeBlocks.map((entry, index) => (
            <ViewBlock
              key={index}
              entry={entry}
              // if day selected is not current, scroll to defaultTimePosition
              scrollTo={!isToday(timeBlocks[0].timestamp) && index === defaultTimePosition}
              openViewBookingModal={() => setIsViewBookingModalOpen(true)}
              setViewBookingEntryId={() => fetchBooking(entry.id)}
            />
          ))}
        </DailyContainer>
      </MainContainer>
    </>
  )
}
export default ViewScheduleBlock
