import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { RootState } from '../../store/types'
import { StyledBookingBlock } from './BlockStyles'
import { scrollToView } from './CurrentTimeLine'

type Props = {
  entry: TimeBlock
  onClick: React.MouseEventHandler<HTMLDivElement>
  scrollTo?: boolean
}

const BookingBlock = (props: Props) => {
  const ref = useRef<HTMLDivElement>(null)

  const { selectedBlockTimestamp, selectedStartTime, selectedEndTime } = useSelector(
    (state: RootState) => state.facilityBooking,
  )

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

    return ((props.entry.type === TimeBlockType.OCCUPIED && cutoffStart >= props.entry.timestamp) ||
      cutoffEnd <= props.entry.timestamp) as boolean
  }

  return (
    <StyledBookingBlock
      ref={ref}
      onClick={
        props.entry.type === TimeBlockType.AVAILABLE || props.entry.type === TimeBlockType.SELECTED
          ? props.onClick
          : undefined
      }
      type={props.entry.type}
      blockId={props.entry.id}
      hasOverlay={hasOverlay()}
    >
      {blockText()}
    </StyledBookingBlock>
  )
}

export default BookingBlock
