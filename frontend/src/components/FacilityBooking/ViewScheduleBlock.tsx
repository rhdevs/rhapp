import React, { useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../store/types'
import { Booking } from '../../store/facilityBooking/types'

import ViewBlock from './ViewBlock'
import HourBlocks from './HourBlocks'
import CurrentTimeLine from './CurrentTimeLine'
import { ViewBookingCard } from './ViewBookingCard'

import { DailyContainer, MainContainer } from './BlockStyles.styled'

// import { isSameDate } from '../../common/isSameDate'

/**
 *
 * @returns displays a 24h timeline of all bookings made on the facility
 *
 * @example
 * ```
 * <ViewScheduleBlock />
 * ```
 * @remarks
 *
 */
const ViewScheduleBlock = () => {
  const { timeBlocks } = useSelector((state: RootState) => state.facilityBooking)
  const [isViewBookingModalOpen, setIsViewBookingModalOpen] = useState<boolean>()
  const [viewBooking, setViewBooking] = useState<Booking>()
  // const defaultTimePosition = 16 //4pm (can range from 0 to 23 - length of timeBlocks)

  // passing entry ID instead of booking object which might be undefind
  const fetchBooking = (entryId: number) => {
    setViewBooking(timeBlocks[entryId].booking)
  }

  return (
    <>
      {isViewBookingModalOpen && (
        <ViewBookingCard booking={viewBooking} exitOnClick={() => setIsViewBookingModalOpen(false)} />
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
              // TODO doesn't work
              // scrollTo={!isSameDate(new Date(), timeBlocks[0].timestamp) && index === defaultTimePosition}
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
