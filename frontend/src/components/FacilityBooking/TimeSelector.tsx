import React, { createRef, useEffect } from 'react'

import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'

import CurrentTimeLine from './CurrentTimeLine'
import HourBlocks from './HourBlocks'
import BookingBlock from './BookingBlock'
// import { isSameDate } from '../../common/isSameDate'

import { BLOCK_GAP, DailyContainer, MainContainer } from './BlockStyles.styled'
import { isSameDate } from '../../common/isSameDate'

/**
 *
 * Display blocks of time for user to select
 *
 * @param timeBlocks (TimeBlock[]) - Array of timeblocks to display
 * @param bookingBlockOnClick (Function) - Function to call when a timeblock is clicked
 * @param overwriteAvailability (number[]) [optional] - Array of timestamps to overwrite `OCCUPIED` to `AVAILABLE`
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
  overwriteAvailability?: number[]
}) {
  const { timeBlocks, bookingBlockOnClick } = { ...props }

  const isCurrentDay = isSameDate(new Date(), timeBlocks[0].timestamp * 1000)
  const defaultTimePosition = 16 // 4pm (can range from 0 to 23 - length of timeBlocks)

  // scroll to defaultTimePosition if day selected is not current (i.e. current time line is not visible)
  const ref = createRef<HTMLDivElement>()
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }, [ref])

  return (
    <MainContainer>
      <CurrentTimeLine />
      <HourBlocks />
      <DailyContainer>
        {timeBlocks.map((entry, index) => {
          const toOverwrite =
            entry.type === TimeBlockType.OCCUPIED && props.overwriteAvailability?.includes(entry.timestamp)
          const updatedEntry = toOverwrite ? { ...entry, type: TimeBlockType.AVAILABLE } : entry

          return (
            <>
              <BookingBlock key={index} onClick={() => bookingBlockOnClick(entry.timestamp)} entry={updatedEntry} />
              {
                // if day selected is not current, scroll to defaultTimePosition
                !isCurrentDay && index === defaultTimePosition && <div style={{ marginBottom: -BLOCK_GAP }} ref={ref} />
              }
            </>
          )
        })}
      </DailyContainer>
    </MainContainer>
  )
}
