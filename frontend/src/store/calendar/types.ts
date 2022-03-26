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
  SET_CLICKED_DATE = 'CALENDAR_ACTIONS.SET_CLICKED_DATE',
  SET_IS_LOADING = 'CALENDAR_ACTIONS.SET_IS_LOADING',
  SET_CALENDAR_VIEW_FACILITY_START_DATE = 'CALENDAR_ACTIONS.SET_CALENDAR_VIEW_FACILITY_START_DATE',
  SET_FACILITY_BOOKINGS = 'CALENDAR_ACTION.SET_FACILITY_BOOKINGS',
  SET_PROCESSED_DATES = 'CALENDAR_ACTION.SET_PROCESSED_DATES',
}

type SetIsClicked = {
  type: typeof CALENDAR_ACTIONS.SET_CLICKED_DATE
  newClickedDate: Date
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

type SetProcessedDates = {
  type: typeof CALENDAR_ACTIONS.SET_PROCESSED_DATES
  processedDates: Date[]
}

export type ActionTypes =
  | SetIsClicked
  | SetIsLoading
  | SetCalendarViewFacilityStartDate
  | SetFacilityBookings
  | SetProcessedDates
