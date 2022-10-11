import dayjs from 'dayjs'
import { Dispatch, GetState } from '../types'
import { ENDPOINTS, DOMAINS, get, del, DOMAIN_URL } from '../endpoints'
import { defaultTimeBlocks } from '../stubs'
import { ActionTypes, Booking, BookingStatus, Facility, FACILITY_ACTIONS, TimeBlock, TimeBlockType } from './types'

/**
 *
 * @param newError
 * @returns updates `createBookingError`
 *
 * @remarks this function is currently unused! `createBookingError` is unused as well
 */
export const SetCreateBookingError = (newError: string) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_CREATE_BOOKING_ERROR,
    createBookingError: newError,
  })
}

/**
 *
 * @param date
 * @param selectedFacilityId
 * @returns updates `selectedDayBookings`, `timeBlocks`, `isLoading`
 *
 * @remarks <insert remarks here>
 */
export const updateDailyView = (date: Date, selectedFacilityId: number) => async (dispatch: Dispatch<ActionTypes>) => {
  const updatedTB: TimeBlock[] = [...defaultTimeBlocks]

  const adjustedStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  const adjustedEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 23, 59, 59, 999)
  const querySubString =
    selectedFacilityId +
    '/' +
    '?startTime=' +
    parseInt((adjustedStart.getTime() / 1000).toFixed(0)) +
    '&endTime=' +
    parseInt((adjustedEnd.getTime() / 1000).toFixed(0))

  //set all elements in TB to available
  for (let i = 0; i < 24; i++) {
    updatedTB[i] = {
      id: i,
      timestamp: adjustedStart.getTime() / 1000 + i * 3600,
      type: TimeBlockType.AVAILABLE,
    }
  }
  fetch(DOMAIN_URL.FACILITY + ENDPOINTS.FACILITY_BOOKING + '/' + querySubString, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((res) => {
      const updatedDayBookings: Booking[] = res.data
      for (let i = 0; i < updatedDayBookings.length; i++) {
        if (new Date(updatedDayBookings[i].startTime * 1000).getDate() == date.getDate()) {
          const starthour = new Date(updatedDayBookings[i].startTime * 1000).getHours()
          const endhour =
            new Date(updatedDayBookings[i].endTime * 1000).getHours() < starthour
              ? 24
              : new Date(updatedDayBookings[i].endTime * 1000).getHours()
          for (let hour = starthour; hour < endhour; hour++) {
            updatedTB[hour] = {
              id: hour,
              timestamp: updatedDayBookings[i].startTime,
              type: TimeBlockType.OCCUPIED,
              ccaName: updatedDayBookings[i].ccaName,
              eventName: updatedDayBookings[i].eventName,
              booking: updatedDayBookings[i],
            }
          }
        }

        if (new Date(updatedDayBookings[i].startTime * 1000).getDate() < date.getDate()) {
          const starthour = 0
          const endhour = new Date(updatedDayBookings[i].endTime * 1000).getHours()
          for (let hour = starthour; hour < endhour; hour++) {
            updatedTB[hour] = {
              id: hour,
              timestamp: updatedDayBookings[i].startTime,
              type: TimeBlockType.OCCUPIED,
              ccaName: updatedDayBookings[i].ccaName,
              eventName: updatedDayBookings[i].eventName,
              booking: updatedDayBookings[i],
            }
          }
        }
      }

      dispatch(setSelectedDayBookings(updatedDayBookings))
      dispatch(setTimeBlocks(updatedTB))
      dispatch(setIsLoading(false))
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
      dispatch(setIsLoading(false))
    })
}
/**
 *
 * Takes in the user's ID and fetches an array of Booking objects that belongs to the user
 *
 * @params userID (string)
 * @returns updates `MyBookings`, `isLoading`
 *
 * @remarks
 * <any remarks on this function put here>
 */
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
  dispatch(setIsLoading(false))
}

/**
 *
 * Takes in `isDeleteMyBooking` and closes the booking if it equals -1
 *
 * @params isDeleteMyBooking (number, optional)
 * @returns updates `isDeleteMyBooking`
 *
 * @remarks
 * -1 stands for closed, any others means open for that specific ID.
 * // TODO shouldn't `isDeleteMyBooking` be a boolean value ??
 */

export const setIsDeleteMyBooking = (isDeleteMyBooking?: number) => (dispatch: Dispatch<ActionTypes>) => {
  if (isDeleteMyBooking !== undefined) {
    dispatch({ type: FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING, isDeleteMyBooking: isDeleteMyBooking })
  }
}

/**
 *
 * Takes in a booking ID and closes it (by passing arg of -1 to setIsDeleteMyBooking)
 *
 * @params bookingID (number, optional)
 * @returns updates `MyBookings`
 *
 * @remarks
 * <any remarks on this function put here>
 */
export const deleteMyBooking = (bookingId?: number) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const TokenId = localStorage.getItem('token')
  if (bookingId !== undefined) {
    await del(ENDPOINTS.BOOKING, DOMAINS.FACILITY, {}, `/${bookingId.toString()}?token=${TokenId}`).then(() => {
      const { myBookings } = getState().facilityBooking
      dispatch({
        type: FACILITY_ACTIONS.DELETE_MY_BOOKING,
        myBookings: myBookings.filter((booking) => booking.bookingID !== bookingId),
      })
      dispatch(setIsDeleteMyBooking(-1))
    })
  }
}

/**
 *
 *
 * @params oldBooking (Booking)
 * @returns updates `newBooking`, `newBookingFacilityName`
 *
 * @remarks
 * <any remarks on this function put here>
 */
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
/**
 *
 * @params newTab (string)
 * @returns updates `newTab`
 *
 * @remarks
 * <any remarks on this function put here>
 */

export const changeTab = (newTab: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.CHANGE_TAB, newTab: newTab })
}

//TODO: Remove when edit booking is completed
export const editBookingName = (newBookingName: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_NAME, newBookingName: newBookingName })
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

//TODO: Remove when edit booking is completed
export const clearErrors = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_CREATE_BOOKING_ERROR,
    createBookingError: '',
  })
}

/**
 *
 * @returns updates `createBookingError`
 *
 * @remarks
 * <any remarks on this function put here>
 */
export const setDefaultError = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_CREATE_BOOKING_ERROR,
    createBookingError: 'Your Event is now 0 minutes long!',
  })
}

//TODO: Remove when edit booking is completed
export const editBookingCCA = (newBookingCCA: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_CCA, newBookingCCA: newBookingCCA })
}

//TODO: Remove when edit booking is completed
export const editBookingDescription = (newBookingDescription: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_DESCRIPTION, newBookingDescription: newBookingDescription })
}

/**
 *
 * Takes in `newDate` and updates both `ViewStartDate` and `ViewEndDate` to that date.
 *
 * @params newDate (Date)
 * @returns updates `ViewStartDate`, `ViewEndDate`
 *
 * @remarks
 * <any remarks on this function put here>
 */
export const setViewDates = (newDate: Date) => (dispatch: Dispatch<ActionTypes>) => {
  const startDate = newDate
  const endDate = newDate

  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE, ViewStartDate: startDate })
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE, ViewEndDate: endDate })
}

// currentMode TRUE == view bookings || FALSE == view availabilities
export const setViewFacilityMode = (currentMode: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  const ViewFacilityMode = currentMode ? 'Bookings' : 'Availabilities'
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_MODE, ViewFacilityMode: ViewFacilityMode })
}

// TODO: Remove when edit booking is done
export const setNewBookingFacilityName = (name: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BOOKING_FACILITY, newBookingFacilityName: name })
}

export const fetchAllCCAs = () => (dispatch: Dispatch<ActionTypes>) => {
  get(ENDPOINTS.ALL_CCAS, DOMAINS.EVENT).then(async (resp) => {
    dispatch({ type: FACILITY_ACTIONS.GET_ALL_CCA, ccaList: resp.data })
  })

  dispatch(setIsLoading(false))
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

export const setIsLoading = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_LOADING, isLoading: desiredState })
}

export const SetBlockOutIsOpen = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BLOCK_OUT_IS_OPEN, blockOutIsOpen: desiredState })
}

export const SetIsJcrc = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_JCRC, isJcrc: desiredState })
}

//TODO: Remove when edit booking is done
export const setSelectedFacility = (facilityID: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_SELECTED_FACILITY, selectedFacilityId: facilityID })
}

//TODO: Remove when edit booking is done
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
      dispatch(setIsLoading(false))
      return booking.data
    })
  // await fetch(DOMAIN_URL.EVENT + ENDPOINTS.CCA_DETAILS + '/' + booking.ccaID, { method: 'GET', mode: 'cors' })
}

//TODO: Remove when edit booking is done
export const setBookingRepeat = (numRepeatWeekly: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_REPEAT_WEEKLY,
    numRepeatWeekly: numRepeatWeekly,
  })
}

export const setBooking = (booking: Booking) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING,
    booking: booking,
  })
}

export const resetBooking = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING,
    booking: null,
  })
}

// TODO: What is the purpose of endDate??
export const handleCreateNewBooking = (
  facilityID: number | undefined,
  eventName: string | undefined,
  startTime: number | null,
  endTime: number | null,
  endDate?: number,
  ccaID?: number,
  description?: string,
  forceBook?: boolean,
) => async (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = {
    facilityID: facilityID,
    eventName: eventName,
    userID: localStorage.getItem('userID'),
    ccaID: ccaID,
    startTime: startTime,
    endTime: endTime,
    bookUntil: endDate,
    description: description,
    forceBook: forceBook,
  }
  dispatch(
    setBooking({
      eventName: eventName ?? '',
      facilityID: facilityID ?? -1,
      userID: localStorage.getItem('userID') ?? '',
      ccaID: ccaID ?? -1,
      startTime: startTime ?? Math.round(Date.now() / 1000),
      endTime: endTime ?? Math.round(Date.now() / 1000),
      description: description ?? '',
      endDate: endDate,
    }),
  )
  if (startTime === null || endTime === null) {
    dispatch(setBookingStatus(BookingStatus.FAILURE, 'Please select a start and end time!'))
  } else {
    const tokenId = localStorage.getItem('token')
    fetch(DOMAIN_URL.FACILITY + ENDPOINTS.BOOKING + '?token=' + tokenId + '&userID=' + localStorage.getItem('userID'), {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    }).then((resp) => {
      if (resp.status === 200) {
        dispatch(setBookingStatus(BookingStatus.SUCCESS))
      } else if (resp.status === 409) {
        dispatch(setBookingStatus(BookingStatus.CONFLICT))
        resp.json().then((body) => {
          dispatch(setConflictBookings(body.conflict_bookings))
        })
      } else {
        resp.json().then((body) => {
          if (body.err == 'End time earlier than start time') {
            dispatch(setBookingStatus(BookingStatus.FAILURE, 'End time is earlier than start time!'))
          } else if (body.err == 'Conflict Booking') {
            dispatch(
              setBookingStatus(BookingStatus.FAILURE, 'There is already a booking that exists at specified timing'),
            )
          } else if (body.err == 'You must be in RH Dance to make this booking') {
            // As of this version, Dance Studio can only be booked by people who are in RH Dance.
            dispatch(setBookingStatus(BookingStatus.FAILURE, 'You must be in RH Dance to make this booking'))
          } else {
            dispatch(
              setBookingStatus(BookingStatus.FAILURE, 'Check your fields again! All fields should be filled up!'),
            )
          }
        })
      }
    })
    dispatch(setSelectedBlockTimestamp(0))
    dispatch(setSelectedStartTime(0))
    dispatch(setSelectedEndTime(0))
    dispatch(setBookingStartTime(0))
    dispatch(setBookingEndTime(0))
  }
}

export const setBookingStatus = (bookingStatus: BookingStatus, message?: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING_STATUS,
    bookingStatus: bookingStatus,
    message: message,
  })
}

export const setSelectedBlockTimestamp = (timeStamp: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_SELECTED_BLOCK_TIMESTAMP,
    selectedBlockTimestamp: timeStamp,
  })
}

export const setSelectedStartTime = (startTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_SELECTED_START_TIME,
    selectedStartTime: startTime,
  })
}

export const setSelectedEndTime = (endTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_SELECTED_END_TIME,
    selectedEndTime: endTime,
  })
}

export const setBookingStartTime = (startTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING_START_TIME,
    bookingStartTime: startTime,
  })
}

export const setBookingEndTime = (endTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING_END_TIME,
    bookingEndTime: endTime,
  })
}
export const setBookingEndDate = (endDate: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING_END_DATE,
    bookingEndDate: endDate,
  })
}

export const setConflictBookings = (conflictBookings: Booking[]) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_CONFLICT_BOOKINGS,
    conflictBookings: conflictBookings,
  })
}

export const setTimeBlocks = (newTimeBlocks: TimeBlock[]) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_TIME_BLOCKS,
    timeBlocks: newTimeBlocks,
  })
}

export const setSelectedDayBookings = (selectedDayBookings: Booking[]) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_SELECTED_DAY_BOOKINGS,
    selectedDayBookings: selectedDayBookings,
  })
}
