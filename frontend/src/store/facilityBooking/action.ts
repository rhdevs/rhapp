import { Dispatch, GetState } from '../types'
import { ActionTypes, Booking, Facility, FACILITY_ACTIONS } from './types'
import { ENDPOINTS, DOMAINS, get, del, DOMAIN_URL, put } from '../endpoints'
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
      const facilityList = data.data
      const commHallBack = facilityList.pop() // Move Comm Hall (Back) to be beside Comm Hall (Front)
      facilityList.splice(6, 0, commHallBack)
      const uniqueLocationList = [...new Set(facilityList.map((item: Facility) => item.facilityLocation))]
      dispatch({
        type: FACILITY_ACTIONS.GET_FACILITY_LIST,
        facilityList: facilityList,
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
    '?startTime=' +
    parseInt((adjustedStart.getTime() / 1000).toFixed(0)) +
    '&endTime=' +
    parseInt((adjustedEnd.getTime() / 1000).toFixed(0))
  let updatedFB: Booking[] = []
  await fetch(DOMAIN_URL.FACILITY + ENDPOINTS.FACILITY_BOOKING + '/' + querySubString, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then(async (res) => {
      updatedFB = res.data
    })

  dispatch({
    type: FACILITY_ACTIONS.SET_FACILITY_BOOKINGS,
    facilityBookings: updatedFB,
  })
  dispatch(SetIsLoading(false))
}

export const getMyBookings = (userId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  let newList: Booking[] = []
  const TokenId = localStorage.getItem('token')
  await get(ENDPOINTS.USER_BOOKINGS, DOMAINS.FACILITY, `/${userId}?token=${TokenId}`).then((bookingList) => {
    newList = bookingList.data
  })
  dispatch({
    type: FACILITY_ACTIONS.GET_MY_BOOKINGS,
    myBookings: newList as Booking[],
  })
  dispatch(SetIsLoading(false))
}

// -1 stands for closed, any others means open for that specific ID.
export const setIsDeleteMyBooking = (isDeleteMyBooking: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING, isDeleteMyBooking: isDeleteMyBooking })
}

export const deleteMyBooking = (bookingId: number) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const TokenId = localStorage.getItem('token')
  await del(ENDPOINTS.BOOKING, DOMAINS.FACILITY, {}, `/${bookingId.toString()}?token=${TokenId}`).then(() => {
    const { myBookings } = getState().facilityBooking
    dispatch({
      type: FACILITY_ACTIONS.DELETE_MY_BOOKING,
      myBookings: myBookings.filter((booking) => booking.bookingID !== bookingId),
    })
    dispatch(setIsDeleteMyBooking(-1))
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
  let newError: string
  if (duration === 0) {
    newError = 'End Date is the Same as Start Date!'
  } else if (duration < 0) {
    newError = 'End Date is before Start Date!'
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
export const setViewDates = (newDate: any, selectedFacilityId: number) => (dispatch: Dispatch<ActionTypes>) => {
  const startDate = newDate
  const endDate = newDate

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
    dispatch({ type: FACILITY_ACTIONS.GET_ALL_CCA, ccaList: resp.data })
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
      dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_NAME, selectedFacilityName: facility.data[0].facilityName })
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
    newBookingFacilityName,
    facilityList,
    ccaList,
    numRepeatWeekly,
  } = getState().facilityBooking

  const requestBody = {
    facilityID: selectedFacilityId,
    eventName: newBookingName,
    userID: localStorage.getItem('userID'),
    ccaID: ccaList.find((cca) => cca.ccaName === newBookingCCA)?.ccaID,
    startTime: parseInt((newBookingFromDate.getTime() / 1000).toFixed(0)),
    endTime: parseInt((newBookingToDate.getTime() / 1000).toFixed(0)),
    description: newBookingDescription,
    repeat: numRepeatWeekly,
  }
  if (selectedFacilityId === 0) {
    //validate if selected facility id is zero
    const newSelectedFacilityId = facilityList.find((facility) => facility.facilityName === newBookingFacilityName)
      ?.facilityID
    if (newSelectedFacilityId) {
      dispatch(setSelectedFacility(newSelectedFacilityId))
    } else {
      dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
      dispatch(SetCreateBookingError('Try reentering facility name!'))
      return
    }
  }
  if (new Date().getTime() > newBookingFromDate.getTime()) {
    //Creating a booking in the past
    dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
    dispatch(SetCreateBookingError('You cannot create a booking on a date that has already past.'))
    return
  }
  if (!isEdit) {
    const TokenId = localStorage.getItem('token')
    const response = await fetch(
      DOMAIN_URL.FACILITY + ENDPOINTS.BOOKING + '?token=' + TokenId + '&userID=' + localStorage.getItem('userID'),
      {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      },
    )
    if (response.status >= 400) {
      const body = await response.json()
      dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
      if (body.err === 'End time earlier than start time') {
        dispatch(SetCreateBookingError('End time is earlier than start time!'))
      } else if (body.err === 'Conflict Booking') {
        dispatch(SetCreateBookingError('There is already a booking that exists at specified timing'))
      } else if (body.err === 'You must be in RH Dance to make this booking') {
        // As of this version, Dance Studio can only be booked by people who are in RH Dance.
        dispatch(SetCreateBookingError('You must be in RH Dance to make this booking'))
      } else {
        dispatch(SetCreateBookingError('Check your fields again! All fields should be filled up!'))
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
    const TokenId = localStorage.getItem('token')
    requestBody.facilityID = newBooking?.facilityID ?? requestBody.facilityID
    const response = await put(
      ENDPOINTS.BOOKING,
      DOMAINS.FACILITY,
      requestBody,
      {},
      `/${newBooking?.bookingID}?token=${TokenId}`,
    )

    if (response.status >= 400) {
      const body = await response.json()
      dispatch({ type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING, createFailure: true, createSuccess: false })
      if (body.err === 'End time eariler than start time') {
        dispatch(SetCreateBookingError('End time is earlier than start time!'))
      } else if (body.err === 'Conflict Booking') {
        dispatch(SetCreateBookingError('There is already a booking that exists at specified timing'))
      } else {
        dispatch(SetCreateBookingError('Check your fields again! All fields should be filled up!'))
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

export const SetBlockOutIsOpen = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BLOCK_OUT_IS_OPEN, blockOutIsOpen: desiredState })
}

export const SetIsJcrc = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_JCRC, isJcrc: desiredState })
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
      dispatch({ type: FACILITY_ACTIONS.SET_VIEW_BOOKING, selectedBooking: booking.data })
      dispatch(SetIsLoading(false))
      return booking.data
    })
  // await fetch(DOMAIN_URL.EVENT + ENDPOINTS.CCA_DETAILS + '/' + booking.ccaID, { method: 'GET', mode: 'cors' })
}

export const setBookingRepeat = (numRepeatWeekly: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_REPEAT_WEEKLY,
    numRepeatWeekly: numRepeatWeekly,
  })
}
