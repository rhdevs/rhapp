import { Booking, Facility } from './facilityBooking/types'
import { User } from './profile/types'
import { SearchResult } from './home/types'
import {
  Order,
  PaymentMethod,
  SupperGroupStatus,
  FoodMenu,
  SupperGroup,
  SplitACMethod,
  Restaurant,
  CollatedOrder,
  CancelAction,
  Food,
  UserDetails,
} from './supper/types'
import { GymStatusStates, HistoryEntry } from './gym/types'
import { unixToFullDate } from '../common/unixToFullDate'

/**
 * ######### STUBS LIST: #########
 * 1. facilityList
 * 2. myBookings
 * 3. Washing Machines
 * 4. Search Results
 * 5. dummyUserId
 * 6. Gym Features
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
  profilePicSignedUrl:
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
export const foodList: Food[] = [
  {
    foodId: '12345364832764134',
    comments: 'CHILLI PLS! or something to make it more spicy because I want to eat something spicy!',
    cancelAction: CancelAction.REMOVE,
    quantity: 1,
    foodMenuId: 'i3572f8whff582842',
    restaurantId: 'jkhw8237429dh8wqe',
    foodName: 'McGriddles with Egg Meal',
    price: 6.7,
    custom: [
      {
        title: 'Sides',
        options: [
          { name: 'Fries', isSelected: true, price: 0 },
          { name: 'Apple pie', isSelected: false, price: 1.2 },
        ],
        max: 1,
        min: 1,
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

    foodPrice: 8.6,
  },
  {
    foodId: '12345364832764134',
    quantity: 2,
    cancelAction: CancelAction.CONTACT,
    foodMenuId: 'i3572f8whff582842',
    restaurantId: 'jkhw8237429dh8wqe',
    foodName: 'McGriddles with Egg Meal',
    price: 6.7,
    custom: [
      {
        title: 'Sides',
        options: [
          { name: 'Fries', isSelected: false, price: 0 },
          { name: 'Apple pie', isSelected: false, price: 1.2 },
        ],
        max: null,
        min: 0,
        customNumber: 1,
      },
      {
        title: 'Drinks',
        options: [
          { name: 'Coca Cola', isSelected: false, price: 0 },
          { name: 'Ice Lemon Tea', isSelected: false, price: 1.2 },
          { name: 'Milo', isSelected: false, price: 1.5 },
        ],
        max: 1,
        min: 1,
        customNumber: 2,
      },
    ],

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
      profilePicSignedUrl:
        'https://avatars0.githubusercontent.com/u/12388321?s=400&u=5cb37c17aecf292b713adbf41ceddfea943a55b4&v=4',
      displayName: 'Jane Doe',
      telegramHandle: 'jane_doe',
      block: 8,
      bio: 'This is my bio, I am jane doe',
      modules: ['CS1010', 'CFG1000', 'CS2040S'],
    },
    supperGroupId: 2,
    userContact: 99234567,
    foodList: foodList,
    totalCost: 23,
    hasPaid: false, //1 if user paid owner (user POV)
    paymentMethod: PaymentMethod.CASH,
    hasReceived: true, //1 if owner received payment (owner POV)
    createdAt: 122,
  },
  {
    orderId: 'kajldskfhskfksdf',
    user: userProfileStub,
    supperGroupId: 1,
    userContact: 91234567,
    foodList: foodList,
    totalCost: 13,
    hasPaid: true, //1 if user paid owner (user POV)
    paymentMethod: PaymentMethod.GOOGLEPAY,
    hasReceived: false, //1 if owner received payment (owner POV)
    createdAt: 12,
  },
]

export const userDetailsStub: UserDetails[] = [
  { userId: '1', name: 'Gougou', telegramHandle: 'gg' },
  // { userId: '2', name: 'Moumou has a really really long name...', telegramHandle: 'mm' },
  // { userId: '3', name: 'Poupou', telegramHandle: 'pp' },
]

export const paymentMethods = [PaymentMethod.CASH, PaymentMethod.GOOGLEPAY, PaymentMethod.PAYLAH, PaymentMethod.PAYNOW]

export const restaurantList = ["McDonald's", "Al Amaan's", 'Kimly Dim Sum']

export const supperGroupStatusList = [SupperGroupStatus.ORDERED, SupperGroupStatus.ARRIVED, SupperGroupStatus.CANCELLED]
// foodMenuId: string
// restaurantId: string
// foodMenuName: string
// price: number
// custom?: Custom[]
export const foodMenuStub: FoodMenu[] = [
  { foodMenuId: 'msm', restaurantId: 'mdn', foodMenuName: 'McSpicy Meal', section: 'Value Meals', price: 7.9 },
  { foodMenuId: 'fofm', restaurantId: 'mdn', foodMenuName: 'Filet-O-Fish Meal', section: 'Value Meals', price: 5 },
  {
    foodMenuId: 'snm',
    restaurantId: 'mdn',
    foodMenuName: 'Spicy McNuggets Meal',
    section: 'Upsized Value Meals',
    price: 7.5,
  },
  { foodMenuId: 'ccc', restaurantId: 'mdn', foodMenuName: 'Corn', section: 'Ala Carte', price: 3.0 },
  { foodMenuId: 'mcm', restaurantId: 'mdn', foodMenuName: 'Mc Muffin', section: 'Breakfast', price: 3.0 },
]

export const foodItemStub: FoodMenu = {
  foodMenuId: 'snm',
  restaurantId: 'mdn',
  foodMenuName: 'Spicy McNuggets Meal',
  price: 7.5,
  custom: [
    {
      title: 'Sides',
      options: [
        { name: 'fries', price: 0, isSelected: true },
        { name: 'corn cup', price: 0, isSelected: false },
      ],
      min: 1,
      max: 1,
      customNumber: 1,
    },
    {
      title: 'Drinks',
      options: [
        { name: 'Coke Small', price: 0 },
        { name: 'Coke medium', price: 0.5 },
        { name: 'Coke Large', price: 1 },
        { name: 'Coke No Sugar Small', price: 0 },
        { name: 'Coke No Sugar Medium', price: 0.5 },
        { name: 'Coke No Sugar large', price: 1 },
      ],
      min: 0,
      max: 2,
      customNumber: 1,
    },
  ],
  section: 'Upsized Value Meals',
}

export const supperGroupStub: SupperGroup = {
  additionalCost: 3,
  comments: 'pls feed me',
  costLimit: 1000,
  createdAt: 10000000,
  currentFoodCost: 100,
  location: 'Blk 5 Hard Court',
  numOrders: 2,
  ownerId: 'A1234567B',
  ownerTele: 'leongggg',
  ownerName: 'Leong',
  paymentInfo: [
    { paymentMethod: PaymentMethod.PAYLAH, link: 'http://www.google.com' },
    { paymentMethod: PaymentMethod.GOOGLEPAY, link: 'www.google.com' },
  ],
  restaurantName: "McDonald's",
  splitAdditionalCost: SplitACMethod.EQUAL,
  status: SupperGroupStatus.OPEN,
  supperGroupId: 1,
  supperGroupName: 'feed me',
  totalPrice: 15.7,
  userIdList: ['A1234567D', 'A1234567C', 'A1234567B'],
  closingTime: 10000000,
  estArrivalTime: 100453488,
  orderList: orderList,
  phoneNumber: 99999999,
}

// Restaurant = {
//   restaurantId: string
//   name: string
//   restaurantLogo: string
//   menu: FoodMenu[]
//   allSection: string[]
// }
// export type FoodMenu = {
//   foodMenuId: string
//   restaurantId: string
//   foodMenuName: string
//   section: string
//   price: number
//   custom?: Custom[]
// }

export const AlAmaanStub: Restaurant = {
  restaurantId: 'alalalala',
  name: "Al Amaan's",
  restaurantLogo: 'logo',
  menu: [
    { foodMenuId: 'tyn', restaurantId: 'alamaan', foodMenuName: 'Tomyum Noodles', section: 'Thai Kitchen', price: 6.5 },
    {
      foodMenuId: 'bsn',
      restaurantId: 'alamaan',
      foodMenuName: 'Bandung Soup Noodles',
      section: 'Thai Kitchen',
      price: 4.5,
    },
    {
      foodMenuId: 'TSSC',
      restaurantId: 'alamaan',
      foodMenuName: 'Thai Sweet and Spicy Chicken',
      section: 'Thai Kitchen',
      price: 4.0,
    },
    {
      foodMenuId: 'hkn',
      restaurantId: 'alamaan',
      foodMenuName: 'Pad Thai',
      section: 'Thai Kitchen',
      price: 5.5,
    },
    {
      foodMenuId: 'gn',
      restaurantId: 'alamaan',
      foodMenuName: 'Garlic Naan',
      section: 'Indian Kitchen',
      price: 2.4,
    },
    {
      foodMenuId: 'fnc',
      restaurantId: 'alamaan',
      foodMenuName: 'Fish & Chips',
      section: 'Western Kitchen',
      price: 5.5,
    },
  ],
  allSection: ['Thai Kitchen', 'Indian Kitchen', 'Western Kitchen'],
}

export const KimlyStub: Restaurant = {
  restaurantId: 'kkkkkk',
  name: 'Kimly Dim Sum',
  restaurantLogo: 'logo',
  menu: [
    { foodMenuId: 'bkb', restaurantId: 'kimly', foodMenuName: 'Bak Kwa Pau', section: 'Mains', price: 1.2 },
    {
      foodMenuId: 'bpp',
      restaurantId: 'kimly',
      foodMenuName: 'Big Pau (Pork)',
      section: 'Mains',
      price: 1.9,
    },
    {
      foodMenuId: 'csp',
      restaurantId: 'kimly',
      foodMenuName: 'Char Siew Pau (Mini)',
      section: 'Mains',
      price: 1.3,
    },
    {
      foodMenuId: 'tp',
      restaurantId: 'kimly',
      foodMenuName: 'Teh Ping',
      section: 'Drinks',
      price: 1.5,
    },
    {
      foodMenuId: 'bd',
      restaurantId: 'kimly',
      foodMenuName: 'Bandung',
      section: 'Drinks',
      price: 2.0,
    },
  ],
  allSection: ['Mains', 'Drinks'],
}

export const McDonaldstub: Restaurant = {
  restaurantId: 'mdmdmdmd',
  name: "McDonald's",
  restaurantLogo: 'logo',
  menu: foodMenuStub,
  allSection: ['Value Meals', 'Upsized Value Meals', 'Ala Carte', 'Breakfast'],
}

export const supperGroupId = 1

// supperGroupId: string;
// ownerId: string;
// collatedOrderList: Food[];
export const dummyCollatedOrderList: CollatedOrder = {
  supperGroupId: 1,
  ownerId: 'A1234567B',
  collatedOrderList: foodList,
}

export const initSupperGroup: SupperGroup = {
  costLimit: undefined,
  createdAt: undefined,
  currentFoodCost: 0,
  location: '',
  numOrders: 0,
  ownerId: localStorage.userID,
  ownerName: '',
  ownerTele: '',
  paymentInfo: [],
  restaurantName: '',
  splitAdditionalCost: undefined,
  status: SupperGroupStatus.OPEN,
  supperGroupId: undefined,
  supperGroupName: '',
  totalPrice: 0,
  closingTime: undefined,
}

export const gymStatus: GymStatusStates = {
  gymIsOpen: false,
  avatar: '',
  keyHolder: { displayName: '5-122', telegramHandle: 'smchead' },
  keyIsReturned: true,
}

export const gymHistory: HistoryEntry[] = [
  {
    date: unixToFullDate(1638426691),
    details: [
      {
        statusChange: '',
        requestTime: 1638416070,
        userDetails: '@John99',
      },
      {
        statusChange: '',
        requestTime: 1638413730,
        userDetails: '@andy333',
      },
      {
        statusChange: 'open',
        requestTime: 1638409291,
        userDetails: '@inspired_ahpau',
      },
    ],
  },
  {
    date: unixToFullDate(1638322891),
    details: [
      {
        statusChange: '',
        requestTime: 1638363931,
        userDetails: '5 - 409',
      },
      {
        statusChange: 'closed',
        requestTime: 1638363510,
        userDetails: '@inspired_ahpau',
      },
      {
        statusChange: '',
        requestTime: 1638360330,
        userDetails: '@inspired_ahpau',
      },
      {
        statusChange: '',
        requestTime: 1638355410,
        userDetails: '@xiaomingwong',
      },
      {
        statusChange: '',
        requestTime: 1638349170,
        userDetails: '@bob_the_builder',
      },
    ],
  },
]
