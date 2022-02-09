export type Booking = {
  bookingID: number
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
  repeat?: number
}

export type Facility = {
  facilityID: number
  facilityName: string
  facilityLocation: string
}

export enum CALENDAR_ACTIONS {
  SET_IS_CLICKED = 'CALENDAR_ACTIONS.SET_IS_CLICKED',
  SET_IS_LOADING = 'CALENDAR_ACTIONS.SET_IS_LOADING',
  SET_CALENDAR_VIEW_FACILITY_START_DATE = 'CALENDAR_ACTIONS.SET_CALENDAR_VIEW_FACILITY_START_DATE',
  SET_FACILITY_BOOKINGS = 'FACILITY_ACTION.SET_FACILITY_BOOKINGS',
}

type SetIsClicked = {
  type: typeof CALENDAR_ACTIONS.SET_IS_CLICKED
  newIsClicked: boolean
  newClickedDate: number
}

type SetIsLoading = {
  type: typeof CALENDAR_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type SetCalendarViewFacilityStartDate = {
  type: typeof CALENDAR_ACTIONS.SET_CALENDAR_VIEW_FACILITY_START_DATE
  CalendarViewFacilityStartDate: Date
}

type SetFacilityBookings = {
  type: typeof CALENDAR_ACTIONS.SET_FACILITY_BOOKINGS
  facilityBookings: Booking[]
}

export type ActionTypes = SetIsClicked | SetIsLoading | SetCalendarViewFacilityStartDate | SetFacilityBookings
