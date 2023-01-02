import { invert } from 'lodash'

export type Facility = {
  facilityID: number
  facilityName: string
  facilityLocation: string
}

export type userCCA = {
  ccaID: number
  ccaName: string
  category: string
}

export type Booking = {
  bookingID?: number
  eventName: string
  facilityID: number
  facilityName?: string
  userID: string
  displayName?: string
  ccaID: number
  ccaName?: string
  startTime: number
  endTime: number
  description: string
  repeat?: boolean
  endDate?: number
}

export type Event = {
  id: number
  date: string
  startTime: string
  endTime: string
  eventName: string
  eventCCA: string
  eventOwner: string
}

export type TimeBlock = {
  id: number
  timestamp: number
  type: TimeBlockType
  ccaName?: string
  eventName?: string
  booking?: Booking
}

export enum TimeBlockType {
  AVAILABLE = 'available',
  OCCUPIED = 'occupied',
  UNAVAILABLE = 'unavailable',
  SELECTED = 'selected',
}

export enum SearchMode {
  NONE = 'none',
  BY_FACILITY = 'byFacility',
  BY_TIME = 'byTime',
}

export enum FACILITY_ACTIONS {
  SET_IS_LOADING = 'FACILITY_ACTIONS.SET_IS_LOADING',
  SET_BLOCK_OUT_IS_OPEN = 'FACILITY_ACTIONS.SET_BLOCK_OUT_OPEN',
  SET_IS_JCRC = 'FACILITY_ACTIONS.SET_IS_JCRC',
  GET_FACILITY_LIST = 'FACILITY_ACTIONS.GET_FACILITY_LIST',
  GET_FACILITY_LIST_WITHIN_TIME = 'FACILITY_ACTIONS.GET_FACILITY_LIST_WITHIN_TIME',
  GET_MY_BOOKINGS = 'FACILITY_ACTIONS.GET_MY_BOOKINGS',
  SET_IS_DELETE_MY_BOOKING = 'FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING',
  DELETE_MY_BOOKING = 'FACILITY_ACTIONS.DELETE_MY_BOOKING',
  HANDLE_BOOKING_NAME = 'FACILITY_ACTIONS.HANDLE_BOOKING_NAME',
  SET_BOOKING_TO_DATE = 'FACILITY_ACTIONS.SET_BOOKING_TO_DATE',
  SET_BOOKING_FROM_DATE = 'FACILITY_ACTIONS.SET_BOOKING_FROM_DATE',
  SET_SEARCH_MODE = 'FACILITY_ACTIONS.SET_SEARCH_MODE',
  SET_VIEW_FACILITY_START_DATE = 'FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE',
  SET_VIEW_FACILITY_END_DATE = 'FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE',
  SET_VIEW_FACILITY_MODE = 'FACILITY_ACTIONS.VIEW_FACILITY_MODE',
  HANDLE_CREATE_BOOKING = 'FACILITY_ACTIONS.HANDLE_CREATE_BOOKING',
  POPULATE_FACILITY_BOOKINGS = 'FACILITY_ACTIONS.POPULATE_FACILITY_BOOKINGS',
  SET_FACILITY_DETAILS = 'FACILITY_ACTIONS.SET_FACILITY_DETAILS',
  SET_VIEW_BOOKING = 'FACILITY_ACTIONS.SET_VIEW_BOOKING',
  SET_SELECTED_FACILITY = 'FACILITY_ACTIONS.SET_SELECTED_FACILITY',
  GET_ALL_CCA = 'FACILITY_ACTIONS.GET_ALL_CCA',
  SET_BOOKING = 'FACILITY_ACTIONS.SET_BOOKING',
  SET_BOOKING_STATUS = 'FACILITY_ACTIONS.SET_BOOKING_STATUS',
  SET_SELECTED_BLOCK_TIMESTAMP = 'FACILITY_ACTIONS.SET_SELECTED_BLOCK_TIMESTAMP',
  SET_SELECTED_START_TIME = 'FACILITY_ACTIONS.SET_SELECTED_START_TIME',
  SET_SELECTED_END_TIME = 'FACILITY_ACTIONS.SET_SELECTED_END_TIME',
  SET_BOOKING_START_TIME = 'FACILITY_ACTIONS.SET_BOOKING_START_TIME',
  SET_BOOKING_END_TIME = 'FACILITY_ACTIONS.SET_BOOKING_END_TIME',
  SET_BOOKING_END_DATE = 'FACILITY_ACTIONS.SET_BOOKING_END_DATE',
  SET_FACILITY_BOOKINGS = 'FACILITY_ACTIONS.SET_FACILITY_BOOKINGS',
  SET_VIEW_FACILITY_NAME = 'FACILITY_ACTIONS.SET_VIEW_FACILITY_NAME',
  SET_CONFLICT_BOOKINGS = 'FACILITY_ACTIONS.SET_CONFLICT_BOOKINGS',
  SET_TIME_BLOCKS = 'FACILITY_ACTIONS.SET_TIME_BLOCKS',
  SET_SELECTED_DAY_BOOKINGS = 'FACILITY_ACTIONS.SET_SELECTED_DAY_BOOKINGS',
  SET_CLICKED_DATE = 'CALENDAR_ACTIONS.SET_CLICKED_DATE',
}

type SetViewFacilityName = {
  type: typeof FACILITY_ACTIONS.SET_VIEW_FACILITY_NAME
  selectedFacilityName: string
}

type GetFacilityList = {
  type: typeof FACILITY_ACTIONS.GET_FACILITY_LIST
  facilityList: Facility[]
  locationList: string[]
}

type GetFacilityListWithinTime = {
  type: typeof FACILITY_ACTIONS.GET_FACILITY_LIST_WITHIN_TIME
  facilityListWithinTime: Facility[]
  locationListWithinTime: string[]
}

type GetMyBookings = {
  type: typeof FACILITY_ACTIONS.GET_MY_BOOKINGS
  myBookings: Booking[]
}

type SetIsDeleteMyBooking = {
  type: typeof FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING
  isDeleteMyBooking: number
}

type DeleteMyBooking = {
  type: typeof FACILITY_ACTIONS.DELETE_MY_BOOKING
  myBookings: Booking[]
}

type SetSearchMode = {
  type: typeof FACILITY_ACTIONS.SET_SEARCH_MODE
  searchMode: SearchMode
}

type SetViewFacilityStartDate = {
  type: typeof FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE
  ViewStartDate: Date
}

type SetViewFacilityEndDate = {
  type: typeof FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE
  ViewEndDate: Date
}

type setViewFacilityMode = {
  type: typeof FACILITY_ACTIONS.SET_VIEW_FACILITY_MODE
  ViewFacilityMode: string
}

type HandleCreateBooking = {
  type: typeof FACILITY_ACTIONS.HANDLE_CREATE_BOOKING
  createSuccess: boolean
  createFailure: boolean
}

type PopulateFacilityBookings = {
  type: typeof FACILITY_ACTIONS.POPULATE_FACILITY_BOOKINGS
  bookings: Booking[]
}

type SetFacilityDetails = {
  type: typeof FACILITY_ACTIONS.SET_FACILITY_DETAILS
  selectedFacility: Facility
}

type SetViewBooking = {
  type: typeof FACILITY_ACTIONS.SET_VIEW_BOOKING
  selectedBooking: Booking
}

type SetIsLoading = {
  type: typeof FACILITY_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type SetBlockOutIsOpen = {
  type: typeof FACILITY_ACTIONS.SET_BLOCK_OUT_IS_OPEN
  blockOutIsOpen: boolean
}

type SetIsJcrc = {
  type: typeof FACILITY_ACTIONS.SET_IS_JCRC
  isJcrc: boolean
}

type SetSelectedFacility = {
  type: typeof FACILITY_ACTIONS.SET_SELECTED_FACILITY
  selectedFacilityId: number
}

type GetAllCCA = {
  type: typeof FACILITY_ACTIONS.GET_ALL_CCA
  ccaList: userCCA[]
}

type SetFacilityBookings = {
  type: typeof FACILITY_ACTIONS.SET_FACILITY_BOOKINGS
  facilityBookings: Booking[]
}

type SetBooking = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING
  booking: Booking | null
}

type SetBookingStatus = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_STATUS
  bookingStatus: BookingStatus
  bookingErrorMessage?: string
}

type SetSelectedBlockTimestamp = {
  type: typeof FACILITY_ACTIONS.SET_SELECTED_BLOCK_TIMESTAMP
  selectedBlockTimestamp: number
}

type SetSelectedStartTime = {
  type: typeof FACILITY_ACTIONS.SET_SELECTED_START_TIME
  selectedStartTime: number
}

type SetSelectedEndTime = {
  type: typeof FACILITY_ACTIONS.SET_SELECTED_END_TIME
  selectedEndTime: number
}

type SetBookingStartTime = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_START_TIME
  bookingStartTime: number
}

type SetBookingEndTime = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_END_TIME
  bookingEndTime: number
}

type SetBookingEndDate = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_END_DATE
  bookingEndDate: number
}

export enum BookingStatus {
  SUCCESS = 'success',
  FAILURE = 'failure',
  CONFLICT = 'conflict',
  INITIAL = 'initial',
}

type dayNumber = { [dayString: string]: number }
export const DAY_STRING_TO_NUMBER: dayNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}

type SetConflictBookings = {
  type: typeof FACILITY_ACTIONS.SET_CONFLICT_BOOKINGS
  conflictBookings: Booking[]
}

type SetTimeBlock = {
  type: typeof FACILITY_ACTIONS.SET_TIME_BLOCKS
  timeBlocks: TimeBlock[]
}

type SetSelectedDayBookings = {
  type: typeof FACILITY_ACTIONS.SET_SELECTED_DAY_BOOKINGS
  selectedDayBookings: Booking[]
}

type SetIsClicked = {
  type: typeof FACILITY_ACTIONS.SET_CLICKED_DATE
  clickedDate: Date
}

// Reverse lookup map of DAY_STRING_TO_NUMBER
export const DAY_NUMBER_TO_STRING: { [dayNumber: number]: string } = invert(DAY_STRING_TO_NUMBER)

export type ActionTypes =
  | GetFacilityList
  | GetFacilityListWithinTime
  | GetMyBookings
  | SetIsDeleteMyBooking
  | DeleteMyBooking
  | SetSearchMode
  | SetViewFacilityStartDate
  | SetViewFacilityEndDate
  | setViewFacilityMode
  | HandleCreateBooking
  | PopulateFacilityBookings
  | SetFacilityDetails
  | SetViewBooking
  | SetIsLoading
  | SetBlockOutIsOpen
  | SetSelectedFacility
  | GetAllCCA
  | SetFacilityBookings
  | SetViewFacilityName
  | SetIsJcrc
  | SetBooking
  | SetBookingStatus
  | SetSelectedBlockTimestamp
  | SetSelectedStartTime
  | SetSelectedEndTime
  | SetBookingStartTime
  | SetBookingEndTime
  | SetBookingEndDate
  | SetConflictBookings
  | SetTimeBlock
  | SetSelectedDayBookings
  | SetIsClicked
