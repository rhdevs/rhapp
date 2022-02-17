import React, { useState } from 'react'
import { BookingStatusEntry } from '../../store/facilityBooking/types'
import { StyledBookingBlock, TextContainer, Availability } from './BlockStyles'

type Props = {
  bookingEntry: BookingStatusEntry
  //setList: React.Dispatch<React.SetStateAction<BookingStatusEntry>>
  index: number
}

const BookingBlock = (props: Props) => {
  // const [isSelected, setIsSelected ] = useState<boolean>(false)
  // setIsSelected(true)
  console.log(props)
  return (
    <StyledBookingBlock type={props.bookingEntry.type} ccaId={props.bookingEntry.id}>
      {props.bookingEntry.type === 'occupied' && <TextContainer>Occupied</TextContainer>}
      {(props.bookingEntry.type === 'available' || props.bookingEntry.type === 'selected') && (
        <TextContainer>Available</TextContainer>
      )}
    </StyledBookingBlock>
  )
}

export default BookingBlock
