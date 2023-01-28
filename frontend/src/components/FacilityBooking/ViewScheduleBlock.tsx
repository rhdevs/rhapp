import React, { createRef, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../store/types'
import { Booking } from '../../store/facilityBooking/types'

import { isSameDate } from '../../common/isSameDate'
import ViewBlock from './ViewBlock'
import HourBlocks from './HourBlocks'
import CurrentTimeLine from './CurrentTimeLine'
import { ViewBookingCard } from './ViewBookingCard'

import { BLOCK_GAP, DailyContainer, MainContainer } from './BlockStyles.styled'

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

  const isCurrentDay = isSameDate(new Date(), timeBlocks[0].timestamp * 1000)
  const defaultTimePosition = 18 // 6pm (can range from 0 to 23 - length of timeBlocks)

  // passing entry ID instead of booking object which might be undefind
  const fetchBooking = (entryId: number) => {
    setViewBooking(timeBlocks[entryId].booking)
  }

  // scroll to defaultTimePosition if day selected is not current (i.e. current time line is not visible)
  const ref = createRef<HTMLDivElement>()
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [ref])

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
            <>
              <ViewBlock
                key={index}
                entry={entry}
                openViewBookingModal={() => setIsViewBookingModalOpen(true)}
                setViewBookingEntryId={() => fetchBooking(entry.id)}
              />
              {
                // if day selected is not current, scroll to defaultTimePosition
                !isCurrentDay && index === defaultTimePosition && <div style={{ marginBottom: -BLOCK_GAP }} ref={ref} />
              }
            </>
          ))}
        </DailyContainer>
      </MainContainer>
    </>
  )
}
export default ViewScheduleBlock
