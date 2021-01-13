import { Dispatch, GetState } from '../types'
import { ActionTypes, Booking, Facility, FACILITY_ACTIONS } from './types'
import { ENDPOINTS, DOMAINS, get, post, del } from '../endpoints'
import axios from 'axios'

export const getFacilityList = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetIsLoading(true))
  get(ENDPOINTS.FACILITY_LIST, DOMAINS.FACILITY).then(async (resp) => {
    const uniqueLocationList = [...new Set(resp.map((item: Facility) => item.facilityLocation))]

    dispatch({
      type: FACILITY_ACTIONS.GET_FACILITY_LIST,
      facilityList: resp,
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
  console.log('hello')
  console.log(querySubString)

  axios
    .get('https://rhappfacilities.rhdevs.repl.co/bookings/facility/12/?startDate=1610510547&endDate=1610769747', {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    })
    .then((response) => {
      dispatch({
        type: FACILITY_ACTIONS.SET_FACILITY_BOOKINGS,
        facilityBookings: response.data,
      })
      dispatch(SetIsLoading(false))
    })

  // get(ENDPOINTS.FACILITY_BOOKING, DOMAINS.FACILITY, querySubString).then((resp) => {
  //   console.log(resp.data)
  //   dispatch(SetIsLoading(false))
  // })
}

export const getMyBookings = (userId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetIsLoading(true))
  get(ENDPOINTS.USER_BOOKINGS, DOMAINS.FACILITY, userId).then((resp) => {
    const fetchedList: Booking[] = resp.data
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

export const deleteMyBooking = (bookingId: number) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(SetIsLoading(true))
  del(ENDPOINTS.BOOKING, DOMAINS.FACILITY, {}, bookingId.toString()).then(() => {
    const { myBookings } = getState().facilityBooking
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
  dispatch(getAllBookingsForFacility())
}

export const editBookingFromDate = (newBookingFromDate: Date) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FROM_DATE, newBookingFromDate: newBookingFromDate })
  dispatch(getAllBookingsForFacility())
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
  //   {
  //     "ccaID": 2,
  //     "description": "123",
  //     "endTime": 1610185978,
  //     "eventName": "123",
  //     "facilityID": 1,
  //     "startTime": 1610175978,
  //     "userID": 1
  // }
  post(ENDPOINTS.BOOKING, DOMAINS.FACILITY, requestBody)
    .then((resp) => {
      console.log(resp)
      resp.info
      // dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: false, createSuccess: true })
      // dispatch(SetIsLoading(false))
    })
    .catch(() => {
      // dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
    })
}

export const setSelectedBooking = (bookingId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetIsLoading(true))
  const selectedBooking: Booking = {
    bookingID: parseInt(bookingId),
    startTime: new Date(),
    endTime: new Date(),
    eventName: 'Training',
    ccaID: 122,
    userID: 'you',
    facilityID: 223,
    description: 'Backup location! Feel free to PM me',
  }

  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_BOOKING, selectedBooking: selectedBooking })
  dispatch(SetIsLoading(false))
}

export const SetIsLoading = (desiredState?: boolean) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isLoading } = getState().facilityBooking
  dispatch({ type: FACILITY_ACTIONS.SET_IS_LOADING, isLoading: desiredState ? desiredState : !isLoading })
}

export const setSelectedFacility = (facilityID: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_SELECTED_FACILITY, selectedFacilityId: facilityID })
}
