import { Dispatch, GetState } from '../types'
import { ActionTypes, Booking, Facility, FACILITY_ACTIONS } from './types'
import { ENDPOINTS, DOMAINS, get, post, DOMAIN_URL } from '../endpoints'

export const getFacilityList = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetIsLoading(true))
  await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.FACILITY_LIST, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((data) => {
      const uniqueLocationList = [...new Set(data.map((item: Facility) => item.facilityLocation))]
      dispatch({
        type: FACILITY_ACTIONS.GET_FACILITY_LIST,
        facilityList: data,
        locationList: ['All'].concat(uniqueLocationList as string[]),
      })
      dispatch(SetIsLoading(false))
    })
}

export const getAllBookingsForFacility = () => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(SetIsLoading(true))
  const { ViewEndDate, ViewStartDate, selectedFacilityId } = getState().facilityBooking
  const querySubString =
    '/' +
    selectedFacilityId +
    '?startDate=' +
    parseInt((ViewStartDate.getTime() / 1000).toFixed(0)) +
    '&endDate=' +
    parseInt((ViewEndDate.getTime() / 1000).toFixed(0))

  await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.FACILITY_BOOKING + querySubString, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((data) => {
      dispatch({
        type: FACILITY_ACTIONS.SET_FACILITY_BOOKINGS,
        facilityBookings: data,
      })
      console.log(data)
      dispatch(SetIsLoading(false))
    })
}

export const getMyBookings = (userId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetIsLoading(true))
  await get(ENDPOINTS.USER_BOOKINGS, DOMAINS.FACILITY, '/' + userId)
    .then((resp) => resp)
    .then((data) => {
      const fetchedList: Booking[] = data
      console.log(fetchedList)
      dispatch({
        type: FACILITY_ACTIONS.GET_MY_BOOKINGS,
        myBookings: fetchedList,
      })
      dispatch(SetIsLoading(false))
    })
}

// -1 stands for closed, any others means open for that specific ID.
export const setIsDeleteMyBooking = (isDeleteMyBooking: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING, isDeleteMyBooking: isDeleteMyBooking })
}

export const deleteMyBooking = (bookingId: number) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(SetIsLoading(true))
  await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.BOOKING + '/' + bookingId.toString(), {
    method: 'DELETE',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((data) => {
      const { myBookings } = getState().facilityBooking
      console.log(data)
      dispatch({
        type: FACILITY_ACTIONS.DELETE_MY_BOOKING,
        myBookings: myBookings.filter((booking) => booking.bookingID !== bookingId),
      })
      setIsDeleteMyBooking(-1)
      dispatch(SetIsLoading(false))
    })
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
  getAllBookingsForFacility()
}

export const editBookingFromDate = (newBookingFromDate: Date) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FROM_DATE, newBookingFromDate: newBookingFromDate })
  getAllBookingsForFacility()
}

export const editBookingCCA = (newBookingCCA: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_CCA, newBookingCCA: newBookingCCA })
}

export const editBookingDescription = (newBookingDescription: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_DESCRIPTION, newBookingDescription: newBookingDescription })
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
  SetIsLoading(true)
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FROM_DATE, newBookingFromDate: startDate })
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_TO_DATE, newBookingToDate: endDate })
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FACILITY, newBookingFacilityName: facilityName })
  dispatch(SetIsLoading(false))
}

export const fetchAllCCAs = () => (dispatch: Dispatch<ActionTypes>) => {
  get(ENDPOINTS.ALL_CCAS, DOMAINS.EVENT).then(async (resp) => {
    dispatch({ type: FACILITY_ACTIONS.GET_ALL_CCA, ccaList: resp })
    dispatch(SetIsLoading(false))
  })
}

export const handleCreateBooking = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(SetIsLoading(true))
  const {
    newBookingName,
    selectedFacilityId,
    newBookingFromDate,
    newBookingToDate,
    newBookingCCA,
    newBookingDescription,
    ccaList,
  } = getState().facilityBooking

  const requestBody = {
    facilityID: selectedFacilityId,
    eventName: newBookingName,
    userID: '1',
    ccaID: ccaList.find((cca) => cca.ccaName === newBookingCCA)?.ccaID,
    startTime: parseInt((newBookingFromDate.getTime() / 1000).toFixed(0)),
    endTime: parseInt((newBookingToDate.getTime() / 1000).toFixed(0)),
    description: newBookingDescription,
  }
  console.log(requestBody)
  post(ENDPOINTS.BOOKING, DOMAINS.FACILITY, requestBody)
    .then((resp) => {
      if (resp.status >= 400) {
        dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
      } else {
        console.log(resp)
        dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: false, createSuccess: true })
        dispatch(SetIsLoading(false))
      }
    })
    .catch(() => {
      dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
    })
}

export const setSelectedBooking = (bookingId: number) => async (dispatch: Dispatch<ActionTypes>) => {
  console.log(bookingId)
  await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.BOOKING + '/' + bookingId, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data)
      dispatch({ type: FACILITY_ACTIONS.SET_VIEW_BOOKING, selectedBooking: data })
      dispatch(SetIsLoading(false))
    })
}

export const SetIsLoading = (desiredState?: boolean) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isLoading } = getState().facilityBooking
  dispatch({ type: FACILITY_ACTIONS.SET_IS_LOADING, isLoading: desiredState ? desiredState : !isLoading })
}

export const setSelectedFacility = (facilityID: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_SELECTED_FACILITY, selectedFacilityId: facilityID })
}
