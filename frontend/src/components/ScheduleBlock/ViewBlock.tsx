import React from 'react'
import { ViewBookingEntry } from '../../store/facilityBooking/types'
import { StyledViewBooking, TextContainer, Availability } from './BlockStyles'

const ViewBlock = ({ bookingEntry }: { bookingEntry: ViewBookingEntry }) => {
  return (
    <StyledViewBooking isOccupied={bookingEntry.isOccupied} ccaId={bookingEntry.id}>
      {bookingEntry.isOccupied && (
        <TextContainer>
          <Availability>{bookingEntry.ccaName}</Availability>
          <Availability>{bookingEntry.eventName}</Availability>
        </TextContainer>
      )}
    </StyledViewBooking>
  )
}
export default ViewBlock
