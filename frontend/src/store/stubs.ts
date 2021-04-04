import { Booking, Facility } from './facilityBooking/types'
import { User } from './profile/types'
import { SearchResult } from './home/types'
import { Order, PaymentMethod } from './supper/types'

/**
 * ######### STUBS LIST: #########
 * 1. facilityList
 * 2. myBookings
 * 3. Washing Machines
 * 4. Search Results
 * 5. dummyUserId
 */

export const facilityListStub: Facility[] = [
  { facilityID: 123, facilityName: 'Main Area', facilityLocation: 'Upper Lounge' },
  { facilityID: 223, facilityName: 'Alumni Room', facilityLocation: 'Upper Lounge' },
  { facilityID: 224, facilityName: 'Stage', facilityLocation: 'Communal Hall' },
  { facilityID: 225, facilityName: 'Hard Court', facilityLocation: 'Block 5' },
]

export const getHallEventTypesStub: string[] = ['Hall Event', 'Block Event', 'Training', 'IHG']

export const targetAudienceListStub: string[] = ['Blk 7', 'Blk 7 comm']

export const myBookingsStub: Booking[] = [
  {
    bookingID: 3,
    eventName: 'Bonding Camp',
    facilityID: 5,
    userID: 'A0123456Z',
    ccaID: 4,
    startTime: new Date('2020-12-15 12:00:00').getTime() / 1000,
    endTime: new Date('2020-12-15 14:00:00').getTime() / 1000,
    description: 'My Backup Location',
  },
  {
    bookingID: 4,
    eventName: 'Training',
    facilityID: 3,
    userID: 'A0123422Z',
    ccaID: 4,
    startTime: new Date('2020-01-15 12:00:00').getTime() / 1000,
    endTime: new Date('2020-01-15 14:00:00').getTime() / 1000,
    description: 'Pls dont steal from me',
  },
  {
    bookingID: 5,
    eventName: 'JCRC Meeting',
    facilityID: 5,
    userID: 'A0123336Z',
    ccaID: 1,
    startTime: new Date('2020-02-15 12:00:00').getTime() / 1000,
    endTime: new Date('2020-02-15 14:00:00').getTime() / 1000,
    description: 'Steal from me i kick u out of hall',
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
// export const WashingMachineListStub: WashingMachine[] = [
//   {
//     machineId: '6100',
//     locationId: '61',
//     userId: '1',
//     jobId: '2312',
//     type: 'Washing Machine',
//     startTime: 1608723138,
//     duration: 60,
//     job: WMStatus.AVAIL,
//   },
//   {
//     machineId: '6101',
//     locationId: '61',
//     userId: '1',
//     jobId: '2312',
//     type: 'Washing Machine',
//     startTime: 1608723138,
//     duration: 60,
//     job: WMStatus.INUSE,
//   },
//   {
//     machineId: '6102',
//     locationId: '61',
//     userId: '1',
//     jobId: '2312',
//     type: 'Washing Machine',
//     startTime: 1608723138,
//     duration: 60,
//     job: WMStatus.UNCOLLECTED,
//   },
//   {
//     machineId: '6103',
//     locationId: '61',
//     userId: '1',
//     jobId: '2312',
//     type: 'Washing Machine',
//     startTime: 1608723138,
//     duration: 60,
//     job: WMStatus.COMPLETED,
//   },
//   {
//     machineId: '6104',
//     locationId: '61',
//     userId: '1',
//     jobId: '2312',
//     type: 'Washing Machine',
//     startTime: 1608723138,
//     duration: 60,
//     job: WMStatus.RESERVED,
//   },
// ]

export const facilityBookingsStubs = [
  {
    id: 1,
    date: '17 Dec',
    startTime: '1530',
    endTime: '1720',
    eventName: 'Bonding Camp',
    eventCCA: 'RHMP',
    eventOwner: 'not you',
  },
  {
    id: 2,
    date: '18 Dec',
    startTime: '1530',
    endTime: '1720',
    eventName: 'Training',
    eventCCA: 'Voices',
    eventOwner: 'you',
  },
]

export const searchResultsStub: SearchResult[] = [
  {
    id: 1,
    title: 'Ali',
    description: 'Hello my name is Ali',
  },
  {
    id: 2,
    title: 'Bob',
    description: 'Hello my name is Bob',
  },
  {
    id: 3,
    title: 'Bob',
  },
]

export const userProfileStub: User = {
  _id: '0',
  userID: localStorage.userID,
  profilePictureUrl:
    'https://avatars0.githubusercontent.com/u/12388321?s=400&u=5cb37c17aecf292b713adbf41ceddfea943a55b4&v=4',
  displayName: 'Zhou MaoMao',
  telegramHandle: 'zhoumm',
  block: 8,
  bio: 'This is my bio hur hur',
  modules: ['CS1010', 'CFG1000', 'CS2040S'],
}

export const dummyUserId = 'A1234567B'

// foodId: string
// comments?: string
// quantity: number
// foodMenu: FoodMenu
// foodPrice?: number

// foodMenuId: string
// restaurantId: string
// foodMenuName: string
// price: number
// custom?: Custom[]

// title: string
// options: Option[]
// max: number | null
// min: number
// customNumber: number

// name: string
// isSelected: boolean
// price: number
export const foodList = [
  {
    foodId: '12345364832764134',
    comments: 'CHILLI PLS! or something to make it more spicy because I want to eat something spicy!',
    quantity: 1,
    foodMenu: {
      foodMenuId: 'i3572f8whff582842',
      restaurantId: 'jkhw8237429dh8wqe',
      foodMenuName: 'McGriddles with Egg Meal',
      price: 6.7,
      custom: [
        {
          title: 'Sides',
          options: [
            { name: 'Fries', isSelected: true, price: 0 },
            { name: 'Apple pie', isSelected: false, price: 1.2 },
          ],
          max: null,
          min: 0,
          customNumber: 1,
        },
        {
          title: 'Drinks',
          options: [
            { name: 'Coca Cola', isSelected: true, price: 0 },
            { name: 'Ice Lemon Tea', isSelected: false, price: 1.2 },
            { name: 'Milo', isSelected: false, price: 1.5 },
          ],
          max: null,
          min: 0,
          customNumber: 2,
        },
      ],
    },
    foodPrice: 8.6,
  },
  {
    foodId: '12345364832764134',
    quantity: 2,
    foodMenu: {
      foodMenuId: 'i3572f8whff582842',
      restaurantId: 'jkhw8237429dh8wqe',
      foodMenuName: 'McGriddles with Egg Meal',
      price: 6.7,
      custom: [
        {
          title: 'Sides',
          options: [
            { name: 'Fries', isSelected: true, price: 0 },
            { name: 'Apple pie', isSelected: false, price: 1.2 },
          ],
          max: null,
          min: 0,
          customNumber: 1,
        },
        {
          title: 'Drinks',
          options: [
            { name: 'Coca Cola', isSelected: true, price: 0 },
            { name: 'Ice Lemon Tea', isSelected: false, price: 1.2 },
            { name: 'Milo', isSelected: false, price: 1.5 },
          ],
          max: null,
          min: 0,
          customNumber: 2,
        },
      ],
    },
    foodPrice: 8.6,
  },
]

// orderId: string
// user: string
// supperGroupId: string
// userContact?: number
// foodList: Food[]
// totalCost: number
// hasPaid: boolean //1 if user paid owner (user POV)
// paymentMethod: PaymentMethod
// hasReceived: boolean //1 if owner received payment (owner POV)
// createdAt: number
export const orderList: Order[] = [
  {
    orderId: 'y34u23423jhkdfaksd',
    user: {
      _id: '12',
      userID: 'j324ioasdia90da',
      profilePictureUrl:
        'https://avatars0.githubusercontent.com/u/12388321?s=400&u=5cb37c17aecf292b713adbf41ceddfea943a55b4&v=4',
      displayName: 'Jane Doe',
      telegramHandle: 'jane_doe',
      block: 8,
      bio: 'This is my bio, I am jane doe',
      modules: ['CS1010', 'CFG1000', 'CS2040S'],
    },
    supperGroupId: '2',
    userContact: 99234567,
    foodList: foodList,
    totalCost: 23,
    hasPaid: false, //1 if user paid owner (user POV)
    paymentMethod: PaymentMethod.CASH,
    hasReceived: false, //1 if owner received payment (owner POV)
    createdAt: 122,
  },
  {
    orderId: 'kajldskfhskfksdf',
    user: userProfileStub,
    supperGroupId: '1',
    userContact: 91234567,
    foodList: foodList,
    totalCost: 13,
    hasPaid: false, //1 if user paid owner (user POV)
    paymentMethod: PaymentMethod.GOOGLEPAY,
    hasReceived: false, //1 if owner received payment (owner POV)
    createdAt: 12,
  },
]
