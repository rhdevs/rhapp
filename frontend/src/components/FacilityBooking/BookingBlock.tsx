import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { RootState } from '../../store/types'
import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { StyledBookingBlock } from './BlockStyles.styled'
import { scrollToView } from './CurrentTimeLine'

type Props = {
  entry: TimeBlock
  onClick: React.MouseEventHandler<HTMLDivElement>
  scrollTo?: boolean
}

/**
 *
 * // props
 * @param entry (TimeBlock)
 * @param onClick (React.MouseEventHandler<HTMLDivElement>)
 * @param scrollTo (boolean) [optional]
 *
 * @returns A bookable block of time
 *
 * @example
 * ```
 * // Pass in a `TimeBlock` object to entry and a function to onClick to set block to booked given entry's timestamp when block is clicked.
 * // Provide a condition to scrollTo to control where the screen scrolls to.
 * <BookingBlock
 *   onClick={() => setSelectedBlock(entry.timestamp)}
 *   entry={entry}
 *   scrollTo={!isToday(timeBlocks[0].timestamp) && index === defaultTimePosition}
 * />
 * ```
 * @remarks
 */
const BookingBlock = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  const { selectedStartTime, selectedEndTime } = useSelector((state: RootState) => state.facilityBooking)

  useEffect(() => {
    if (props.scrollTo) {
      scrollToView(ref)
    }
  }, [ref.current])

  function blockText() {
    switch (props.entry.type) {
      case TimeBlockType.OCCUPIED:
        return 'Occupied'
      case TimeBlockType.AVAILABLE:
        return 'Available'
      case TimeBlockType.SELECTED:
        return 'Selected as starting time'
      default:
        return ''
    }
  }

  function hasOverlay() {
    const currentTimestamp = Math.round(Date.now() / 1000)
    const currentStartHour = currentTimestamp - (currentTimestamp % 3600)

    const cutoffStart = selectedStartTime === 0 ? currentStartHour : Math.max(currentStartHour, selectedStartTime)
    const cutoffEnd = selectedEndTime === 0 ? Infinity : selectedEndTime

    return (
      props.entry.type === TimeBlockType.OCCUPIED ||
      cutoffStart > props.entry.timestamp ||
      cutoffEnd <= props.entry.timestamp
    )
  }

  const isClickable = () => {
    return (
      !hasOverlay() && (props.entry.type === TimeBlockType.AVAILABLE || props.entry.type === TimeBlockType.SELECTED)
    )
  }

  return (
    <StyledBookingBlock
      ref={ref}
      onClick={isClickable() ? props.onClick : undefined}
      type={props.entry.type}
      blockId={props.entry.id}
      hasOverlay={hasOverlay()}
      isClickable={isClickable()}
    >
      {blockText()}
    </StyledBookingBlock>
  )
}

export default BookingBlock
