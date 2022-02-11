import React from 'react'
import { ViewBookingEntry } from '../../store/facilityBooking/types'
import { ViewBookings, TextContainer, Availability } from './BlockStyles'

const ViewBlock = ({ bookingEntry }: { bookingEntry: ViewBookingEntry }) => {
  return (
    <ViewBookings isOccupied={bookingEntry.occupied} ccaId={bookingEntry.id}>
      {bookingEntry.occupied && (
        <TextContainer>
          <Availability>{bookingEntry.ccaName}</Availability>
          <Availability>{bookingEntry.eventName}</Availability>
        </TextContainer>
      )}
    </ViewBookings>
  )
}
export default ViewBlock
