import React, { useState } from 'react'
import { StyledBookingBlock, TextContainer, Availability } from './BlockStyles'

type Props = {
  bookingEntry: ListEntry
  setList: React.Dispatch<React.SetStateAction<ListEntry>>
  index: number
}
type ListEntry = {
  id: number
  type: 'available' | 'occupied' | 'selected' | 'unavailable'
}

const BookingBlock = (props: Props) => {
  // const [isSelected, setIsSelected ] = useState<boolean>(false)
  // setIsSelected(true)
  return <StyledBookingBlock type={props.bookingEntry.type} ccaId={props.bookingEntry.id}></StyledBookingBlock>
}

export default BookingBlock
