import React from 'react'
import { BookingStatusEntry } from '../../store/facilityBooking/types'
import { StyledBookingBlock, TextContainer } from './BlockStyles'

type Props = {
  bookingEntry: BookingStatusEntry
  onClick: React.MouseEventHandler<HTMLDivElement>
}

const BookingBlock = (props: Props) => {
  function onClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    if (props.bookingEntry.type === 'available' || props.bookingEntry.type === 'selected') {
      return props.onClick(e)
    }
  }
  return (
    <StyledBookingBlock
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => onClick(e)}
      type={props.bookingEntry.type}
      ccaId={props.bookingEntry.id}
    >
      {props.bookingEntry.type === 'occupied' && <TextContainer>Occupied</TextContainer>}
      {props.bookingEntry.type === 'available' && <TextContainer>Available</TextContainer>}
      {props.bookingEntry.type === 'selected' && <TextContainer>Selected as starting time</TextContainer>}
    </StyledBookingBlock>
  )
}

export default BookingBlock
