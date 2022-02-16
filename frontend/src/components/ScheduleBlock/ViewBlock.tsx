import { type } from 'os'
import React from 'react'
import { ViewBookingEntry } from '../../store/facilityBooking/types'
import { StyledViewBooking, TextContainer, Availability } from './BlockStyles'

// function updated(bookingEntry: ViewBookingEntry) {
//   for (const val in fixedValues) {
//     for (const j in bookingEntry) {
//       if (fixedValues[val].startTime in bookingEntry) {
//         fixedValues[val].occupied = true
//         fixedValues[val].eventName = bookingEntry[j].eventName
//         fixedValues[val].ccaName = bookingEntry[j].ccaName
//       }
//     }
//   }
//   fixedValues
// }

const ViewBlock = (bookingEntry: ViewBookingEntry) => {
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
