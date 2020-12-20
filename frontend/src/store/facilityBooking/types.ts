export type Facility = {
  facilityID: number
  facilityName: string
  facilityLocation: string
}

export type Booking = {
  bookingID: number
  eventName: string
  facilityID: number
  userID: string
  ccaID: number
  startTime: Date
  endTime: Date
  description: string
}

export enum FACILITY_ACTIONS {
  GET_FACILITY_LIST = 'FACILITY_ACTIONS.GET_FACILITY_LIST',
  CHANGE_TAB = 'FACILITY_ACTIONS.CHANGE_TAB',
  GET_MY_BOOKINGS = 'FACILITY_ACTIONS.GET_MY_BOOKINGS',
  SET_IS_DELETE_MY_BOOKING = 'FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING',
  DELETE_MY_BOOKING = 'FACILITY_ACTIONS.DELETE_MY_BOOKING',
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

export type ActionTypes = GetFacilityList | ChangeTab | GetMyBookings | SetIsDeleteMyBooking | DeleteMyBooking
