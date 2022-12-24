import React from 'react'

import { TimeBlock } from '../../store/facilityBooking/types'

import CurrentTimeLine from './CurrentTimeLine'
import HourBlocks from './HourBlocks'
import BookingBlock from './BookingBlock'

import { DailyContainer, MainContainer } from './BlockStyles.styled'

import { isSameDate } from '../../common/isSameDate'

/**
 *
 * Display blocks of time for user to select
 *
 * @returns A section containing clickable timeblocks
 *
 * @example
 * <TimeSelector timeBlocks={timeBlocks} bookingBlockOnClick={setSelectedBlock} />
 *
 * @remarks
 */
export default function TimeSelector(props: {
  timeBlocks: TimeBlock[]
  bookingBlockOnClick: (timestamp: number) => void
}) {
  const { timeBlocks, bookingBlockOnClick } = { ...props }
  const defaultTimePosition = 16 // 4pm (can range from 0 to 23 - length of timeBlocks)

  return (
    <MainContainer>
      <CurrentTimeLine />
      <HourBlocks />
      <DailyContainer>
        {timeBlocks.map((entry, index) => {
          return (
            <BookingBlock
              key={index}
              onClick={() => bookingBlockOnClick(entry.timestamp)}
              entry={entry}
              // if day selected is not current, scroll to defaultTimePosition
              // TODO doesn't work
              scrollTo={!isSameDate(new Date(), timeBlocks[0].timestamp) && index === defaultTimePosition}
            />
          )
        })}
      </DailyContainer>
    </MainContainer>
  )
}
