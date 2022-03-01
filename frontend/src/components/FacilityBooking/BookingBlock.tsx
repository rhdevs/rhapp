import React from 'react'
import { useSelector } from 'react-redux'

import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { RootState } from '../../store/types'
import { StyledBookingBlock, TextContainer } from './BlockStyles'

type Props = {
  entry: TimeBlock
  onClick: React.MouseEventHandler<HTMLDivElement>
}

const BookingBlock = (props: Props) => {
  const { selectedStartTime } = useSelector((state: RootState) => state.facilityBooking)

  function blockText() {
    let text = ''
    switch (props.entry.type) {
      case TimeBlockType.OCCUPIED:
        text = 'Occupied'
        break
      case TimeBlockType.AVAILABLE:
        text = 'Available'
        break
      case TimeBlockType.SELECTED:
        text = 'Selected as starting time'
        break
      default:
        break
    }
    return text
  }

  function hasOverlay() {
    const currentTimestamp = Math.round(Date.now() / 1000)
    const currentStartHour = currentTimestamp - (currentTimestamp % 3600)
    const cutoff = selectedStartTime === -1 ? currentStartHour : Math.max(currentStartHour, selectedStartTime)
    return (props.entry.type === TimeBlockType.OCCUPIED && cutoff >= props.entry.timestamp) as boolean
  }

  return (
    <StyledBookingBlock
      onClick={
        props.entry.type === TimeBlockType.AVAILABLE || props.entry.type === TimeBlockType.SELECTED
          ? props.onClick
          : undefined
      }
      type={props.entry.type}
      blockId={props.entry.id}
      hasOverlay={hasOverlay()}
    >
      <TextContainer>{blockText()}</TextContainer>
    </StyledBookingBlock>
  )
}

export default BookingBlock
