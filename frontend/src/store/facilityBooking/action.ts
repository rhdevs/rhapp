import { Dispatch, GetState } from '../types'
import { ActionTypes, Booking, Facility, FACILITY_ACTIONS } from './types'
import { ENDPOINTS, DOMAINS, get, DOMAIN_URL } from '../endpoints'
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
  const adjustedStart = new Date(
    ViewStartDate.getFullYear(),
    ViewStartDate.getMonth(),
    ViewStartDate.getDate(),
    0,
    0,
    0,
    0,
  )
  const adjustedEnd = new Date(
    ViewEndDate.getFullYear(),
    ViewEndDate.getMonth(),
    ViewEndDate.getDate(),
    23,
    59,
    59,
    999,
  )
  const querySubString =
    selectedFacilityId +
    '/' +
    '?startDate=' +
    parseInt((adjustedStart.getTime() / 1000).toFixed(0)) +
    '&endDate=' +
    parseInt((adjustedEnd.getTime() / 1000).toFixed(0))
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
            booking.ccaName = cca[0]?.ccaName
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

export const checkForDurationError = (toDate: Date, fromdate: Date) => (dispatch: Dispatch<ActionTypes>) => {
  const duration = dayjs(toDate).diff(dayjs(fromdate), 'hour', true)
  let newError = ''
  if (duration > 4) {
    newError = 'Exceeded Maximum Booking Duration of 4 hours!'
  } else if (duration < 0) {
    newError = 'End Date is before Start Date!'
  } else if (duration === 0) {
    newError = 'End Date is the Same as Start Date!'
  } else {
    newError = ''
  }

  dispatch({
    type: FACILITY_ACTIONS.SET_CREATE_BOOKING_ERROR,
    createBookingError: newError,
  })
}

export const clearErrors = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_CREATE_BOOKING_ERROR,
    createBookingError: '',
  })
}

export const setDefaultError = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_CREATE_BOOKING_ERROR,
    createBookingError: 'Your Event is now 0 minutes long!',
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
  const startDate = newDates.ViewDateSelection.startDate
  const endDate =
    startDate === newDates.ViewDateSelection.endDate
      ? dayjs(startDate).add(1, 'day').toDate()
      : newDates.ViewDateSelection.endDate

  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE, ViewStartDate: startDate })
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE, ViewEndDate: endDate })
  dispatch(getAllBookingsForFacility(startDate, endDate, selectedFacilityId))
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

  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_NAME, newBookingName: '' })
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_CCA, newBookingCCA: '' })
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_DESCRIPTION, newBookingDescription: '' })

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

/*success && failure -> Success Message shown
success && !failure -> When in createbooking, redirect to viewbooking with success message
!success && failure -> Failure Message shown
!success && !failure -> Normal state no error shown*/
export const resetCreateBookingSuccessFailure = (failureBoolean: boolean, successBoolean: boolean) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING,
    createFailure: failureBoolean,
    createSuccess: successBoolean,
  })
}

export const handleCreateBooking = (isEdit: boolean) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
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
    dispatch(SetCreateBookingError('Try reentering facility name!'))
    return
  } else if (dayjs(newBookingFromDate).diff(dayjs(new Date()), 'week') > 2) {
    //More than 2 weeks in advance
    dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
    dispatch(SetCreateBookingError('You cannot create a booking more than 2 weeks in advance!'))
    return
  } else if (new Date().getTime() > newBookingFromDate.getTime()) {
    //Creating a booking in the past
    dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
    dispatch(SetCreateBookingError('You cannot create a booking on a date that has already past.'))
    return
  }
  if (!isEdit) {
    const response = await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.BOOKING, {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (response.status >= 400) {
      const body = await response.json()
      dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
      if (body.err == 'End time eariler than start time') {
        dispatch(SetCreateBookingError('End time is earlier than start time!'))
      } else if (body.err == 'Conflict Booking') {
        dispatch(SetCreateBookingError('There is already a booking that exists at specified timing'))
      } else {
        dispatch(
          SetCreateBookingError(
            'Check your fields again! All fields should be filled up, and event should be <4 hours!',
          ),
        )
      }
    } else {
      dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FACILITY_ID, newBookingFacilityId: selectedFacilityId.toString() })
      dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: false, createSuccess: true })
      dispatch({
        type: FACILITY_ACTIONS.EDIT_MY_BOOKING,
        newBooking: undefined,
      })
    }
  } else {
    const { newBooking } = getState().facilityBooking
    const response = await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.BOOKING + '/' + newBooking?.bookingID, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    if (response.status >= 400) {
      const body = await response.json()
      dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
      if (body.err == 'End time eariler than start time') {
        dispatch(SetCreateBookingError('End time is earlier than start time!'))
      } else if (body.err == 'Conflict Booking') {
        dispatch(SetCreateBookingError('There is already a booking that exists at specified timing'))
      } else {
        dispatch(
          SetCreateBookingError(
            'Check your fields again! All fields should be filled up, and event should be <4 hours!',
          ),
        )
      }
    } else {
      dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FACILITY_ID, newBookingFacilityId: selectedFacilityId.toString() })
      dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: false, createSuccess: true })
      dispatch({
        type: FACILITY_ACTIONS.EDIT_MY_BOOKING,
        newBooking: undefined,
      })
    }
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
