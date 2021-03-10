import { Dispatch, GetState } from '../types'
import { ActionTypes, Booking, Facility, FACILITY_ACTIONS } from './types'
import { ENDPOINTS, DOMAINS, get, post, DOMAIN_URL } from '../endpoints'
import dayjs from 'dayjs'

export const SetCreateBookingError = (newError: string) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_CREATE_BOOKING_ERROR,
    createBookingError: newError,
  })
}

export const getFacilityList = () => async (dispatch: Dispatch<ActionTypes>) => {
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

export const getAllBookingsForFacility = (ViewStartDate: Date, ViewEndDate: Date, selectedFacilityId: number) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  const querySubString =
    selectedFacilityId +
    '/' +
    '?startDate=' +
    parseInt((ViewStartDate.getTime() / 1000).toFixed(0)) +
    '&endDate=' +
    parseInt((ViewEndDate.getTime() / 1000).toFixed(0))
  let updatedFB: Booking[] = []
  await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.FACILITY_BOOKING + '/' + querySubString, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then(async (data) => {
      updatedFB = await data.map((booking: Booking) => {
        fetch(DOMAIN_URL.EVENT + ENDPOINTS.CCA_DETAILS + '/' + booking.ccaID, {
          method: 'GET',
          mode: 'cors',
        })
          .then((resp) => resp.json())
          .then(async (cca) => {
            booking.ccaName = cca[0].ccaName
          })
        return booking
      })
    })

  dispatch({
    type: FACILITY_ACTIONS.SET_FACILITY_BOOKINGS,
    facilityBookings: updatedFB,
  })
  dispatch(SetIsLoading(false))
}

export const getMyBookings = (userId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  let newList: Booking[] = []
  await get(ENDPOINTS.USER_BOOKINGS, DOMAINS.FACILITY, '/' + userId)
    .then((resp) => resp)
    .then((bookingList) => {
      const fetchedList: Booking[] = bookingList
      newList = fetchedList.map((booking) => {
        fetch(DOMAIN_URL.EVENT + ENDPOINTS.CCA_DETAILS + '/' + booking.ccaID, {
          method: 'GET',
          mode: 'cors',
        })
          .then((resp) => resp.json())
          .then(async (userCCA) => {
            booking.ccaName = userCCA[0].ccaName
            await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.FACILITY + '/' + booking.facilityID, {
              method: 'GET',
              mode: 'cors',
            })
              .then((resp) => resp.json())
              .then((facility) => {
                booking.facilityName = facility[0].facilityName
              })
          })
        return booking
      })
    })
  dispatch({
    type: FACILITY_ACTIONS.GET_MY_BOOKINGS,
    myBookings: newList as Booking[],
  })
}

// -1 stands for closed, any others means open for that specific ID.
export const setIsDeleteMyBooking = (isDeleteMyBooking: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING, isDeleteMyBooking: isDeleteMyBooking })
}

export const deleteMyBooking = (bookingId: number) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.BOOKING + '/' + bookingId.toString(), {
    method: 'DELETE',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then(() => {
      const { myBookings } = getState().facilityBooking
      dispatch({
        type: FACILITY_ACTIONS.DELETE_MY_BOOKING,
        myBookings: myBookings.filter((booking) => booking.bookingID !== bookingId),
      })
      setIsDeleteMyBooking(-1)
    })
}

export const editMyBooking = (oldBooking: Booking) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.EDIT_MY_BOOKING,
    newBooking: oldBooking,
  })
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING_FACILITY,
    newBookingFacilityName: oldBooking.facilityName ? oldBooking.facilityName : '',
  })
}

export const changeTab = (newTab: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.CHANGE_TAB, newTab: newTab })
}

export const editBookingName = (newBookingName: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_NAME, newBookingName: newBookingName })
}

export const editBookingToDate = (newBookingToDate: Date) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_TO_DATE, newBookingToDate: newBookingToDate })
  const { newBookingFromDate } = getState().facilityBooking
  dispatch(checkForDurationError(newBookingToDate, newBookingFromDate))
}

export const editBookingFromDate = (newBookingFromDate: Date) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FROM_DATE, newBookingFromDate: newBookingFromDate })
  const { newBookingToDate } = getState().facilityBooking
  dispatch(checkForDurationError(newBookingToDate, newBookingFromDate))
}

const checkForDurationError = (toDate: Date, fromdate: Date) => (dispatch: Dispatch<ActionTypes>) => {
  const duration = dayjs(toDate).diff(dayjs(fromdate), 'hour', true)
  let newError = ''
  if (duration > 4) {
    newError = 'Exceeded Maximum Booking Duration of 4 hours!'
  } else if (duration < 0) {
    newError = 'End Date is before Start Date!'
  } else if (duration === 0) {
    newError = 'End Date is the Same as Start Date!'
  }

  dispatch({
    type: FACILITY_ACTIONS.SET_CREATE_BOOKING_ERROR,
    createBookingError: newError,
  })
}

export const editBookingCCA = (newBookingCCA: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_CCA, newBookingCCA: newBookingCCA })
}

export const editBookingDescription = (newBookingDescription: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_DESCRIPTION, newBookingDescription: newBookingDescription })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setViewDates = (newDates: any, selectedFacilityId: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE, ViewStartDate: newDates.ViewDateSelection.startDate })
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE, ViewEndDate: newDates.ViewDateSelection.endDate })
  dispatch(
    getAllBookingsForFacility(
      newDates.ViewDateSelection.startDate,
      newDates.ViewDateSelection.endDate,
      selectedFacilityId,
    ),
  )
}

// currentMode TRUE == view bookings || FALSE == view availabilities
export const setViewFacilityMode = (currentMode: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  const ViewFacilityMode = currentMode ? 'Bookings' : 'Availabilities'
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_MODE, ViewFacilityMode: ViewFacilityMode })
}

export const createNewBookingFromFacility = (
  startDate: Date,
  endDate: Date,
  facilityName: string,
  facilityId: string,
) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FROM_DATE, newBookingFromDate: startDate })
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_TO_DATE, newBookingToDate: endDate })
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FACILITY, newBookingFacilityName: facilityName })
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FACILITY_ID, newBookingFacilityId: facilityId })

  dispatch(SetIsLoading(false))
}

export const setNewBookingFacilityName = (name: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FACILITY, newBookingFacilityName: name })
}

export const fetchAllCCAs = () => (dispatch: Dispatch<ActionTypes>) => {
  get(ENDPOINTS.ALL_CCAS, DOMAINS.EVENT).then(async (resp) => {
    dispatch({ type: FACILITY_ACTIONS.GET_ALL_CCA, ccaList: resp })
  })

  dispatch(SetIsLoading(false))
}

export const fetchFacilityNameFromID = (id: number) => async (dispatch: Dispatch<ActionTypes>) => {
  await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.FACILITY + '/' + id, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((facility) => {
      dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_NAME, selectedFacilityName: facility[0].facilityName })
    })
}

export const handleCreateBooking = (isEdit: boolean) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
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
    userID: localStorage.getItem('userID'),
    ccaID: ccaList.find((cca) => cca.ccaName === newBookingCCA)?.ccaID,
    startTime: parseInt((newBookingFromDate.getTime() / 1000).toFixed(0)),
    endTime: parseInt((newBookingToDate.getTime() / 1000).toFixed(0)),
    description: newBookingDescription,
  }
  if (selectedFacilityId === 0) {
    dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
    return
  }
  if (!isEdit) {
    post(ENDPOINTS.BOOKING, DOMAINS.FACILITY, requestBody)
      .then((resp) => {
        if (resp.status >= 400) {
          dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
        } else {
          dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: false, createSuccess: true })
          dispatch({
            type: FACILITY_ACTIONS.EDIT_MY_BOOKING,
            newBooking: undefined,
          })
        }
      })
      .catch(() => {
        dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
      })
  } else {
    fetch(DOMAIN_URL.FACILITY + ENDPOINTS.BOOKING + '/' + selectedFacilityId, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
      .then((resp) => {
        if (resp.status >= 400) {
          dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
        } else {
          dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: false, createSuccess: true })
          dispatch({
            type: FACILITY_ACTIONS.EDIT_MY_BOOKING,
            newBooking: undefined,
          })
        }
      })
      .catch(() => {
        dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
      })
  }
}

export const SetIsLoading = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_LOADING, isLoading: desiredState })
}

export const setSelectedFacility = (facilityID: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_SELECTED_FACILITY, selectedFacilityId: facilityID })
}

export const resetNewBooking = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.EDIT_MY_BOOKING,
    newBooking: undefined,
  })
}

export const fetchSelectedFacility = (bookingId: number) => async (dispatch: Dispatch<ActionTypes>) => {
  await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.VIEW_BOOKING + '/' + bookingId, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then(async (booking) => {
      await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.FACILITY + '/' + booking[0].facilityID, {
        method: 'GET',
        mode: 'cors',
      })
        .then((resp) => resp.json())
        .then(async (facility) => {
          booking[0].facilityName = facility[0].facilityName
          await fetch(DOMAIN_URL.EVENT + ENDPOINTS.CCA_DETAILS + '/' + booking[0].ccaID, {
            method: 'GET',
            mode: 'cors',
          })
            .then((resp) => resp.json())
            .then((cca) => {
              booking[0].ccaName = cca[0].ccaName
            })
        })

      dispatch({ type: FACILITY_ACTIONS.SET_VIEW_BOOKING, selectedBooking: booking[0] })
      return booking[0]
    })
  // await fetch(DOMAIN_URL.EVENT + ENDPOINTS.CCA_DETAILS + '/' + booking.ccaID, { method: 'GET', mode: 'cors' })
}
