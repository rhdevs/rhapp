import { Dispatch } from '../types'
import { ActionTypes, Booking, FACILITY_ACTIONS } from './types'
import { facilityListStub, myBookingsStub } from '../stubs'

export const getFacilityList = () => (dispatch: Dispatch<ActionTypes>) => {
  // get(ENDPOINTS.FACILITY_LIST).then((resp) => {
  //   const fetchedList: Facility[] = resp.data
  //   dispatch({
  //     type: FACILITY_ACTIONS.GET_FACILITY_LIST,
  //     facilityList: facilityListStub,
  //   })
  // })

  // filters through all locations and gives a unique list
  const uniqueLocationList = [...new Set(facilityListStub.map((item) => item.facilityLocation))]
  dispatch({
    type: FACILITY_ACTIONS.GET_FACILITY_LIST,
    facilityList: facilityListStub,
    locationList: uniqueLocationList,
  })
}

export const getMyBookings = (userId: string) => (dispatch: Dispatch<ActionTypes>) => {
  // GET('user/event/booking/userid')
  // get(ENDPOINTS.USER_BOOKINGS + '/' + userId).then((resp) => {
  //   const fetchedList: Booking[] = resp.data
  //   dispatch({
  //     type: FACILITY_ACTIONS.GET_MY_BOOKINGS,
  //     myBookings: fetchedList,
  //   })
  // })

  // When backend is up, need to fetch cca name and facility name via ID
  console.log('getting bookings for ' + userId)
  dispatch({
    type: FACILITY_ACTIONS.GET_MY_BOOKINGS,
    myBookings: myBookingsStub,
  })
}

// -1 stands for closed, any others means open for that specific ID.
export const setIsDeleteMyBooking = (isDeleteMyBooking: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING, isDeleteMyBooking: isDeleteMyBooking })
}

export const deleteMyBooking = (bookingId: number) => (dispatch: Dispatch<ActionTypes>) => {
  // DELETE call to backend
  dispatch({
    type: FACILITY_ACTIONS.DELETE_MY_BOOKING,
    myBookings: myBookingsStub.filter((booking) => booking.bookingID !== bookingId),
  })
  setIsDeleteMyBooking(-1)
}

export const editMyBooking = (oldBooking: Booking) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.EDIT_MY_BOOKING,
    newBooking: oldBooking,
  })
}

export const changeTab = (newTab: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.CHANGE_TAB, newTab: newTab })
}

export const editBookingName = (newBookingName: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_NAME, newBookingName: newBookingName })
}

export const editBookingToDate = (newBookingToDate: Date) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_TO_DATE, newBookingToDate: newBookingToDate })
}

export const editBookingFromDate = (newBookingFromDate: Date) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FROM_DATE, newBookingFromDate: newBookingFromDate })
}

export const editBookingCCA = (newBookingCCA: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_CCA, newBookingCCA: newBookingCCA })
}

export const editBookingDescription = (newBookingDescription: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_DESCRIPTION, newBookingDescription: newBookingDescription })
}

export const getAllEventsForFacility = (facilityName: string) => () => {
  //get facility id from name
  //call to api to fetch all events
  console.log(facilityName)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setViewDates = (newDates: any) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE, ViewStartDate: newDates.ViewDateSelection.startDate })
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE, ViewEndDate: newDates.ViewDateSelection.endDate })
}

// currentMode TRUE == view bookings || FALSE == view availabilities
export const setViewFacilityMode = (currentMode: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  const ViewFacilityMode = currentMode ? 'Bookings' : 'Availabilities'
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_MODE, ViewFacilityMode: ViewFacilityMode })
}

export const createNewBookingFromFacility = (startDate: Date, endDate: Date, facilityName: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FROM_DATE, newBookingFromDate: startDate })
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_TO_DATE, newBookingToDate: endDate })
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FACILITY, newBookingFacilityName: facilityName })
}

export const handleCreateBooking = () => (dispatch: Dispatch<ActionTypes>) => {
  const success = true
  if (success) {
    dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: false, createSuccess: true })
  } else {
    dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
  }
}
