import { type } from 'os'
import React from 'react'
import { ViewBookingEntry } from '../../store/facilityBooking/types'
import { StyledViewBooking, TextContainer, Availability, MainContainer } from './BlockStyles'

type fV = {
  id: number
  ccaName: string
  eventName: string
  occupied: boolean
  startTime: number
}

const fixedValues: fV[] = [
  { id: 1, ccaName: '', eventName: '', occupied: false, startTime: 1615910000 },
  { id: 2, ccaName: '', eventName: '', occupied: false, startTime: 1615910100 },
  { id: 3, ccaName: '', eventName: '', occupied: false, startTime: 1615910200 },
  { id: 4, ccaName: '', eventName: '', occupied: false, startTime: 1615910300 },
  { id: 5, ccaName: '', eventName: '', occupied: false, startTime: 1615910400 },
  { id: 6, ccaName: '', eventName: '', occupied: false, startTime: 1615910500 },
  { id: 7, ccaName: '', eventName: '', occupied: false, startTime: 1615910600 },
  { id: 8, ccaName: '', eventName: '', occupied: false, startTime: 1615910700 },
  { id: 9, ccaName: '', eventName: '', occupied: false, startTime: 1615910800 },
  { id: 10, ccaName: '', eventName: '', occupied: false, startTime: 1615910900 },
  { id: 11, ccaName: '', eventName: '', occupied: false, startTime: 1615911000 },
  { id: 12, ccaName: '', eventName: '', occupied: false, startTime: 1615911100 },
  { id: 13, ccaName: '', eventName: '', occupied: false, startTime: 1615911200 },
  { id: 14, ccaName: '', eventName: '', occupied: false, startTime: 1615911300 },
  { id: 15, ccaName: '', eventName: '', occupied: false, startTime: 1615911400 },
  { id: 16, ccaName: '', eventName: '', occupied: false, startTime: 1615911500 },
  { id: 17, ccaName: '', eventName: '', occupied: false, startTime: 1615911600 },
  { id: 18, ccaName: '', eventName: '', occupied: false, startTime: 1615911700 },
  { id: 18, ccaName: '', eventName: '', occupied: false, startTime: 1615911800 },
  { id: 19, ccaName: '', eventName: '', occupied: false, startTime: 1615911900 },
  { id: 20, ccaName: '', eventName: '', occupied: false, startTime: 1615912000 },
  { id: 21, ccaName: '', eventName: '', occupied: false, startTime: 1615912100 },
  { id: 22, ccaName: '', eventName: '', occupied: false, startTime: 1615912200 },
  { id: 23, ccaName: '', eventName: '', occupied: false, startTime: 1615912300 },
]

function updated(bookingEntry: ViewBookingEntry) {
  for (const val in fixedValues) {
    for (const j in bookingEntry) {
      if (fixedValues[val].startTime in bookingEntry) {
        fixedValues[val].occupied = true
        fixedValues[val].eventName = bookingEntry[j].eventName
        fixedValues[val].ccaName = bookingEntry[j].ccaName
      }
    }
  }
  fixedValues
}

const ViewBlock = (bookingEntry: ViewBookingEntry) => {
  updated(bookingEntry)
  return (
    <MainContainer>
      {fixedValues.map((value, index) => {
        ;<StyledViewBooking isOccupied={value.occupied} ccaId={value.id}>
          <TextContainer>
            <Availability>{value.ccaName}</Availability>
            <Availability>{value.eventName}</Availability>
          </TextContainer>
        </StyledViewBooking>
      })}
    </MainContainer>
  )
}
export default ViewBlock
