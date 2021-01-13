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
  bookingID: number
  eventName: string
  facilityID: number
  userID: string
  ccaID: number
  startTime: number
  endTime: number
  description: string
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

export enum FACILITY_ACTIONS {
  SET_IS_LOADING = 'FACILITY_ACTIONS.SET_IS_LOADING',
  GET_FACILITY_LIST = 'FACILITY_ACTIONS.GET_FACILITY_LIST',
  CHANGE_TAB = 'FACILITY_ACTIONS.CHANGE_TAB',
  GET_MY_BOOKINGS = 'FACILITY_ACTIONS.GET_MY_BOOKINGS',
  SET_IS_DELETE_MY_BOOKING = 'FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING',
  DELETE_MY_BOOKING = 'FACILITY_ACTIONS.DELETE_MY_BOOKING',
  EDIT_MY_BOOKING = 'FACILITY_ACTIONS.EDIT_MY_BOOKING',
  HANDLE_BOOKING_NAME = 'FACILITY_ACTIONS.HANDLE_BOOKING_NAME',
  SET_BOOKING_NAME = 'FACILITY_ACTIONS.SET_BOOKING_NAME',
  SET_BOOKING_FACILITY = 'FACILITY_ACTIONS.SET_BOOKING_FACILITY',
  SET_BOOKING_TO_DATE = 'FACILITY_ACTIONS.SET_BOOKING_TO_DATE',
  SET_BOOKING_FROM_DATE = 'FACILITY_ACTIONS.SET_BOOKING_FROM_DATE',
  SET_BOOKING_CCA = 'FACILITY_ACTIONS.SET_BOOKING_CCA',
  SET_BOOKING_DESCRIPTION = 'FACILITY_ACTIONS.SET_BOOKING_DESCRIPTION',
  SET_VIEW_FACILITY_START_DATE = 'FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE',
  SET_VIEW_FACILITY_END_DATE = 'FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE',
  SET_VIEW_FACILITY_MODE = 'FACILITY_ACTIONS.VIEW_FACILITY_MODE',
  HANDLE_CREATE_BOOKING = 'FACILITY_ACTIONS.HANDLE_CREATE_BOOKING',
  POPULATE_FACILITY_BOOKINGS = 'FACILITY_ACTIONS.POPULATE_FACILITY_BOOKINGS',
  SET_FACILITY_DETAILS = 'FACILITY_ACTIONS.SET_FACILITY_DETAILS',
  SET_VIEW_BOOKING = 'FACILITY_ACTIONS.SET_VIEW_BOOKING',
  SET_SELECTED_FACILITY = 'FACILITY_ACTIONS.SET_SELECTED_FACILITY',
  GET_ALL_CCA = 'FACILITY_ACTIONS.GET_ALL_CCA',
  SET_FACILITY_BOOKINGS = 'FACILITY_ACTION.SET_FACILITY_BOOKINGS',
}

type GetFacilityList = {
  type: typeof FACILITY_ACTIONS.GET_FACILITY_LIST
  facilityList: Facility[]
  locationList: string[]
}
type GetMyBookings = {
  type: typeof FACILITY_ACTIONS.GET_MY_BOOKINGS
  myBookings: Booking[]
}

type ChangeTab = {
  type: typeof FACILITY_ACTIONS.CHANGE_TAB
  newTab: string
}

type SetIsDeleteMyBooking = {
  type: typeof FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING
  isDeleteMyBooking: number
}

type DeleteMyBooking = {
  type: typeof FACILITY_ACTIONS.DELETE_MY_BOOKING
  myBookings: Booking[]
}

type EditMyBooking = {
  type: typeof FACILITY_ACTIONS.EDIT_MY_BOOKING
  newBooking: Booking
}

type SetBookingName = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_NAME
  newBookingName: string
}

type SetFacilityName = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_FACILITY
  newBookingFacilityName: string
}

type SetBookingFromDate = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_FROM_DATE
  newBookingFromDate: Date
}

type SetBookingToDate = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_TO_DATE
  newBookingToDate: Date
}

type SetBookingCCA = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_CCA
  newBookingCCA: string
}

type SetBookingDescription = {
  type: typeof FACILITY_ACTIONS.SET_BOOKING_DESCRIPTION
  newBookingDescription: string
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

export type ActionTypes =
  | GetFacilityList
  | ChangeTab
  | GetMyBookings
  | SetIsDeleteMyBooking
  | DeleteMyBooking
  | EditMyBooking
  | SetBookingName
  | SetBookingFromDate
  | SetBookingToDate
  | SetBookingCCA
  | SetBookingDescription
  | SetViewFacilityStartDate
  | SetViewFacilityEndDate
  | setViewFacilityMode
  | SetFacilityName
  | HandleCreateBooking
  | PopulateFacilityBookings
  | SetFacilityDetails
  | SetViewBooking
  | SetIsLoading
  | SetSelectedFacility
  | GetAllCCA
  | SetFacilityBookings
