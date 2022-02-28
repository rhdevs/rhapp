import React from 'react'

import { TimeBlock, TimeBlockType } from '../../store/facilityBooking/types'
import { StyledBookingBlock, TextContainer } from './BlockStyles'

type Props = {
  entry: TimeBlock
  onClick: React.MouseEventHandler<HTMLDivElement>
}

const BookingBlock = (props: Props) => {
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

  return (
    <StyledBookingBlock
      onClick={
        props.entry.type === TimeBlockType.AVAILABLE || props.entry.type === TimeBlockType.SELECTED
          ? props.onClick
          : undefined
      }
      type={props.entry.type}
      blockId={props.entry.id}
    >
      <TextContainer>{blockText()}</TextContainer>
    </StyledBookingBlock>
  )
}

export default BookingBlock
