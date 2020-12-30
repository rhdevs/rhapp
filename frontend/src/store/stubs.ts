import { Booking, Facility } from './facilityBooking/types'

/**
 * ######### STUBS LIST: #########
 * 1. facilityList
 * 2. myBookings
 * 3. userRhEvents
 * 4. Washing Machines
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
    eventName: 'dummy event 4',
    startDateTime: 1607418000,
    endDateTime: 1607428800,
    description: 'nothing',
    location: 'hall',
    ccaID: 1,
    userID: 1,
    image: null,
  },
  {
    eventID: 1,
    eventName: 'bonding camp',
    startDateTime: 1608654852,
    endDateTime: 1608658452,
    description: 'nothing',
    location: 'upper lounge',
    ccaID: 1,
    userID: 1,
    image: null,
  },
  {
    eventID: 1,
    eventName: '2nd bonding camp',
    startDateTime: 1607342400,
    endDateTime: 1607349600,
    description: 'nothing',
    location: 'hall',
    ccaID: 1,
    userID: 1,
    image: null,
  },
  {
    eventID: 1,
    eventName: 'dummy event 3',
    startDateTime: 1608723138,
    endDateTime: 1608726751,
    description: 'nothing',
    location: 'hall',
    ccaID: 1,
    userID: 1,
    image: null,
  },
]

// machineID	STRING 	ID of laundry machine	6101
// locationID	STRING	ID of location of laundry machines	61
// userID	VARCHAR	ID of user	7
// jobID 	VARCHAR 	current Job ID using the machine	5443OGSDFDS... ( MongoDB object ID )
// type	VARCHAR	Type of laundry machine	Washing Machine/ Dryer
// startTime	DATETIME 	Log of starting time for state	1/1/1970 0000
// duration	INT	Duration of a job state (in minutes)	15, 45, 90
// job	VARCHAR	Current job state	Vacant, Reserved, In Use, Done, Alerted, Collected, Cancelled
export const WashingMachineListStub = [
  {
    machineId: 6101,
    locationId: 61,
    userId: '1',
    jobId: '2312',
    type: 'Washing Machine',
    startTime: 1608723138,
    duration: 60,
    job: 'Available',
  },
  {
    machineId: 6101,
    locationId: 61,
    userId: '1',
    jobId: '2312',
    type: 'Washing Machine',
    startTime: 1608723138,
    duration: 60,
    job: 'In Use',
  },
  {
    machineId: 6101,
    locationId: 61,
    userId: '1',
    jobId: '2312',
    type: 'Washing Machine',
    startTime: 1608723138,
    duration: 60,
    job: 'Uncollected',
  },
  {
    machineId: 6101,
    locationId: 61,
    userId: '1',
    jobId: '2312',
    type: 'Washing Machine',
    startTime: 1608723138,
    duration: 60,
    job: 'Completed',
  },
]
