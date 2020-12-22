import { Booking, Facility } from './facilityBooking/types'

/**
 * ######### STUBS LIST: #########
 * 1. facilityList
 * 2. myBookings
 * 3. userRhEvents
 */

export const facilityListStub: Facility[] = [
  { facilityID: 123, facilityName: 'Main Area', facilityLocation: 'Upper Lounge' },
  { facilityID: 223, facilityName: 'Alumni Room', facilityLocation: 'Upper Lounge' },
  { facilityID: 224, facilityName: 'Stage', facilityLocation: 'Communal Hall' },
  { facilityID: 225, facilityName: 'Hard Court', facilityLocation: 'Block 5' },
]

export const myBookingsStub: Booking[] = [
  {
    bookingID: 3,
    eventName: 'Bonding Camp',
    facilityID: 5,
    userID: 'A0123456Z',
    ccaID: 4,
    startTime: new Date('2020-12-15 12:00:00'),
    endTime: new Date('2020-12-15 14:00:00'),
    description: 'My Backup Location',
  },
  {
    bookingID: 4,
    eventName: 'Training',
    facilityID: 3,
    userID: 'A0123422Z',
    ccaID: 4,
    startTime: new Date('2020-01-15 12:00:00'),
    endTime: new Date('2020-01-15 14:00:00'),
    description: 'Pls dont steal from me',
  },
  {
    bookingID: 5,
    eventName: 'JCRC Meeting',
    facilityID: 5,
    userID: 'A0123336Z',
    ccaID: 1,
    startTime: new Date('2020-02-15 12:00:00'),
    endTime: new Date('2020-02-15 14:00:00'),
    description: 'Steal from me i kick u out of hall',
  },
]

export const userRhEventsDummy = [
  {
    eventID: 1,
    eventName: 'bonding camp',
    startDateTime: 1608658452,
    endDateTime: 1608654852,
    description: 'nothing',
    location: 'upper lounge',
    ccaID: 1,
    userID: 1,
    image: null,
  },
]
