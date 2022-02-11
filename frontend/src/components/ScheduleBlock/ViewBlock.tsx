import React from 'react'
import { ViewBookingEntry } from '../../store/facilityBooking/types'
import { StyledViewBooking, TextContainer, Availability } from './BlockStyles'

const ViewBlock = ({ bookingEntry }: { bookingEntry: ViewBookingEntry }) => {
  return (
    <StyledViewBooking isOccupied={bookingEntry.occupied} ccaId={bookingEntry.id}>
      {bookingEntry.occupied && (
        <TextContainer>
          <Availability>{bookingEntry.ccaName}</Availability>
          <Availability>{bookingEntry.eventName}</Availability>
        </TextContainer>
      )}
    </StyledViewBooking>
  )
}
export default ViewBlock
