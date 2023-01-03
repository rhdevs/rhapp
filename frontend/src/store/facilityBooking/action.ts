import { now } from 'lodash'
import { Dispatch, GetState } from '../types'
import { ENDPOINTS, DOMAINS, get, del, DOMAIN_URL } from '../endpoints'
import { defaultTimeBlocks } from '../stubs'
import {
  ActionTypes,
  Booking,
  BookingStatus,
  Facility,
  FACILITY_ACTIONS,
  SearchMode,
  TimeBlock,
  TimeBlockType,
} from './types'

/**
 *
 * @param date
 * @param selectedFacilityId
 * @returns updates `selectedDayBookings`, `timeBlocks`, `isLoading`
 *
 * @remarks
 */
export const updateBookingDailyView = (date: Date, selectedFacilityId: number) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  const updatedTB: TimeBlock[] = [...defaultTimeBlocks]

  const adjustedStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  const adjustedEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, 23, 59, 59, 999)

  //set all elements in TB to available
  for (let i = 0; i < 24; i++) {
    updatedTB[i] = {
      id: i,
      timestamp: adjustedStart.getTime() / 1000 + i * 3600,
      type: TimeBlockType.AVAILABLE,
    }
  }
  fetch(
    `${DOMAIN_URL.FACILITY}${ENDPOINTS.FACILITY_BOOKING}/${selectedFacilityId}/?` +
      new URLSearchParams({
        startTime: (adjustedStart.getTime() / 1000).toFixed(0),
        endTime: (adjustedEnd.getTime() / 1000).toFixed(0),
      }),
    {
      method: 'GET',
      mode: 'cors',
    },
  )
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

/**
 *
 * @param date
 * @param selectedFacilityId
 * @returns updates `timeBlocks`
 *
 * @remarks
 */
export const updateSearchDailyView = (date: Date) => (dispatch: Dispatch<ActionTypes>) => {
  const updatedTB: TimeBlock[] = [...defaultTimeBlocks]
  const adjustedStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
  const currentTimestamp = now() / 1000

  //set all elements in TB to available, if time is after now
  for (let i = 0; i < 24; i++) {
    const timestamp = adjustedStart.getTime() / 1000 + i * 3600
    const isAvailable = timestamp >= currentTimestamp - 3600
    updatedTB[i] = {
      id: i,
      timestamp: timestamp,
      type: isAvailable ? TimeBlockType.AVAILABLE : TimeBlockType.UNAVAILABLE,
    }
  }
  dispatch(setTimeBlocks(updatedTB))
}

/**
 *
 * @param facilityList (Facility[])
 * @returns sorted facility list by alphabetical order
 */
export const sortFacilitiesAlphabetically = (facilityList: Facility[]) => {
  return facilityList.sort((a, b) => {
    if (a.facilityName < b.facilityName) return -1
    if (a.facilityName > b.facilityName) return 1
    return 0
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
      // const commHallBack = facilityList.pop() // Move Comm Hall (Back) to be beside Comm Hall (Front)
      // facilityList.splice(6, 0, commHallBack)
      const uniqueLocationList = [...new Set(facilityList.map((item: Facility) => item.facilityLocation))]
      const locationList = ['All'].concat(uniqueLocationList as string[])
      dispatch({
        type: FACILITY_ACTIONS.GET_FACILITY_LIST,
        facilityList: facilityList,
        locationList: locationList,
      })
      dispatch(setIsLoading(false))
    })
}

/**
 *
 * @param facilityList (Facility[])
 * @param locationList (string[])
 * @returns updates `facilityListWithinTime`, `locationListWithinTime`
 *
 * @remarks
 */
const setFacilityListWithinTime = (facilityList: Facility[], locationList: string[]) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: FACILITY_ACTIONS.GET_FACILITY_LIST_WITHIN_TIME,
    facilityListWithinTime: facilityList,
    locationListWithinTime: locationList,
  })
}

/**
 *
 * Updates time search facility list with facilities that are available within the time range
 *
 * @param startTime (number) - unix timestamp
 * @param endTime (number) - unix timestamp
 * @returns updates `facilityListWithinTime`, `locationListWithinTime`
 *
 * @remarks
 *
 */
export const getFacilityListWithinTime = (startTime: number, endTime: number) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  await fetch(
    `${DOMAIN_URL.FACILITY}${ENDPOINTS.FACILITY_LIST_WITHIN_TIME}?` +
      new URLSearchParams({
        startTime: `${startTime}`,
        endTime: `${endTime}`,
      }),
    {
      method: 'GET',
      mode: 'cors',
    },
  )
    .then((resp) => resp.json())
    .then((data) => {
      console.log(
        `${DOMAIN_URL.FACILITY}${ENDPOINTS.FACILITY_LIST_WITHIN_TIME}?` +
          new URLSearchParams({
            startTime: `${startTime}`,
            endTime: `${endTime}`,
          }),
      )
      const facilityList = data.available_facilities
      if (facilityList) {
        const uniqueLocationList = [...new Set(facilityList.map((item: Facility) => item.facilityLocation))]
        const locationList = ['All'].concat(uniqueLocationList as string[])
        dispatch(setFacilityListWithinTime(facilityList, locationList))
      } else {
        dispatch(setFacilityListWithinTime([], []))
      }
      dispatch(setIsLoading(false))
    })
}

/**
 *
 * Takes in the user's ID and fetches an array of Booking objects that belongs to the user
 *
 * @param userId (string)
 * @returns updates `myBookings`, `isLoading`
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
 * Takes in a booking ID, and closes it by passing -1 to `setIsDeleteMyBooking`
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
 * @params
 * @returns updates `searchMode`
 *
 * @remarks
 * <any remarks on this function put here>
 */
export const setSearchMode = (newSearchMode: SearchMode) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_SEARCH_MODE,
    searchMode: newSearchMode,
  })
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
  // TODO unused
  // dispatch({
  //   type: FACILITY_ACTIONS.EDIT_MY_BOOKING,
  //   newBooking: oldBooking,
  // })
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

/**
 * Sets the current viewing mode in facilities
 * @param currentMode (boolean) TRUE -> view bookings, FALSE -> view availabilities
 * @returns updates `viewFacilityModeState` according to `currentMode`
 */
export const setViewFacilityMode = (currentMode: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  const ViewFacilityMode = currentMode ? 'Bookings' : 'Availabilities'
  dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_MODE, ViewFacilityMode: ViewFacilityMode })
}

/**
 * Fetches all the CCAs from the endpoint
 * @returns sets `ccaList`, `isLoading`
 */
export const fetchAllCCAs = () => (dispatch: Dispatch<ActionTypes>) => {
  get(ENDPOINTS.ALL_CCAS, DOMAINS.EVENT).then(async (resp) => {
    dispatch({ type: FACILITY_ACTIONS.GET_ALL_CCA, ccaList: resp.data })
  })

  dispatch(setIsLoading(false))
}

/**
 *
 * Takes in facility ID and sends a GET request to get the facility's name
 *
 * @param id (number)
 * @returns updates `selectedFacilityName`
 * @remarks
 */
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

/**
 *
 * @param isFailure (boolean)
 * @param isSuccess (boolean)
 * @returns updates `createFailure`, `createSuccess`
 *
 * @remarks
 * // TODO THIS FUNCTION, AND ITS VALUES, ARE NOT USED!
 * `success && failure` -> Success Message shown \
 * `success && !failure` -> When in createbooking, redirect to viewbooking with success message \
 * `!success && failure` -> Failure Message shown \
 * `!success && !failure` -> Normal state no error
 */

export const resetCreateBookingSuccessFailure = (isFailure: boolean, isSuccess: boolean) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: FACILITY_ACTIONS.HANDLE_CREATE_BOOKING,
    createFailure: isFailure,
    createSuccess: isSuccess,
  })
}

/**
 *
 * @param desiredState (boolean)
 * @returns sets `isloading` according to `desiredState`
 */
export const setIsLoading = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_LOADING, isLoading: desiredState })
}

/**
 * @param desiredState (boolean)
 * @returns sets `blockOutIsOpen` state according to `desiredState`
 */
export const SetBlockOutIsOpen = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_BLOCK_OUT_IS_OPEN, blockOutIsOpen: desiredState })
}

/**
 * Sets TRUE if JCRC
 * @param desiredState (boolean)
 * @returns sets `isJCRC` according to `desiredState`
 */
export const SetIsJcrc = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_IS_JCRC, isJcrc: desiredState })
}

/**
 * Sets the selected facility ID
 * @param facilityID (number)
 * @returns updates `selectedFacilityId`
 */
export const setSelectedFacility = (facilityID: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: FACILITY_ACTIONS.SET_SELECTED_FACILITY, selectedFacilityId: facilityID })
}

/**
 * Takes in `bookingId` and updates `selectedBooking` for the `EditBooking` and `ViewBooking` pages.
 * @param bookingId (number)
 * @returns updates `selectedBooking`, `isLoading`
 *
 * @remarks <insert remarks here>
 */

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

/**
 *
 * @param booking (Booking)
 * @returns updates `booking`
 */

export const setBooking = (booking: Booking) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING,
    booking: booking,
  })
}

/**
 *
 * @returns sets `booking` to `null`
 */

export const resetBooking = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING,
    booking: null,
  })
}

/**
 *
 * Resets user's selection on the `TimeSelector`
 * @returns sets `selectedBlockTimestamp`, `selectedStartTime` and `selectedEndTime` to `0`
 */
export const resetTimeSelectorSelection = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setSelectedBlockTimestamp(0))
  dispatch(setSelectedStartTime(0))
  dispatch(setSelectedEndTime(0))
}

/**
 *
 * Given booking details, create booking in database and update bookingStatus in store.
 * Throw errors if creation of booking fails.
 *
 * @param facilityID (number | undefined)
 * @param eventName (string | undefined)
 * @param startTime (number | null)
 * @param endTime (number | null)
 * @param endDate (number) [optional]
 * @param ccaID (number) [optional]
 * @param description (string) [optional]
 * @param forceBook (boolean) [optional]
 *
 * @returns upon successful booking, reset variables in store used for booking.
 *
 * @remarks
 * TODO: What is the purpose of endDate??
 */
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
          if (body.err === 'End time earlier than start time') {
            dispatch(setBookingStatus(BookingStatus.FAILURE, 'End time is earlier than start time!'))
          } else if (body.err === 'Conflict Booking') {
            dispatch(
              setBookingStatus(BookingStatus.FAILURE, 'There is already a booking that exists at specified timing'),
            )
          } else if (body.err === 'You must be in RH Dance to make this booking') {
            // As of this version, Dance Studio can only be booked by people who are in RH Dance.
            dispatch(setBookingStatus(BookingStatus.FAILURE, 'You must be in RH Dance to make this booking'))
          } else {
            dispatch(setBookingStatus(BookingStatus.FAILURE, 'An error has occurred. Please try again later'))
          }
        })
      }
    })
    dispatch(resetTimeSelectorSelection())
    dispatch(setBookingStartTime(0))
    dispatch(setBookingEndTime(0))
  }
}

/**
 *
 * @param bookingStatus (BookingStatus)
 * @param bookingErrorMessage (string: optional) error message to display
 * @returns sets `bookingStatus`, `bookingErrorMessage`
 */

export const setBookingStatus = (bookingStatus: BookingStatus, bookingErrorMessage?: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING_STATUS,
    bookingStatus: bookingStatus,
    bookingErrorMessage: bookingErrorMessage,
  })
}

/**
 *
 * @param timeStamp (number)
 * @returns updates `selectedBlockTimestamp`
 *
 * @remarks <insert remarks here>
 */
export const setSelectedBlockTimestamp = (timeStamp: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_SELECTED_BLOCK_TIMESTAMP,
    selectedBlockTimestamp: timeStamp,
  })
}

/**
 *
 * @param startTime (number)
 * @returns updates `selectedStartTime`
 *
 * @remarks <insert remarks here>
 */
export const setSelectedStartTime = (startTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_SELECTED_START_TIME,
    selectedStartTime: startTime,
  })
}

/**
 *
 * @param endTime (number)
 * @returns updates `selectedEndTime`
 *
 * @remarks <insert remarks here>
 */
export const setSelectedEndTime = (endTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_SELECTED_END_TIME,
    selectedEndTime: endTime,
  })
}

/**
 *
 * @param startTime (number)
 * @returns updates `bookingStartTime`
 *
 * @remarks <insert remarks here>
 */

export const setBookingStartTime = (startTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING_START_TIME,
    bookingStartTime: startTime,
  })
}

/**
 *
 * @param endTime (number)
 * @returns updates `bookingEndTime`
 *
 * @remarks <insert remarks here>
 */

export const setBookingEndTime = (endTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING_END_TIME,
    bookingEndTime: endTime,
  })
}

/**
 *
 * @param endDate (number)
 * @returns updates `bookingEndDate`
 *
 * @remarks
 */
export const setBookingEndDate = (endDate: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_BOOKING_END_DATE,
    bookingEndDate: endDate,
  })
}

/**
 *
 * @param conflictBookings (Booking[])
 * @returns updates `conflictBookings`
 *
 * @remarks
 */
export const setConflictBookings = (conflictBookings: Booking[]) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_CONFLICT_BOOKINGS,
    conflictBookings: conflictBookings,
  })
}

/**
 *
 * @param newTimeBlocks (TimeBlock[])
 * @returns updates `timeBlocks`
 *
 * @remarks
 */
export const setTimeBlocks = (newTimeBlocks: TimeBlock[]) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_TIME_BLOCKS,
    timeBlocks: newTimeBlocks,
  })
}

/**
 *
 * @param selectedDayBookings (Booking[])
 * @returns updates `selectedDayBookings`
 *
 * @remarks
 */
export const setSelectedDayBookings = (selectedDayBookings: Booking[]) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_SELECTED_DAY_BOOKINGS,
    selectedDayBookings: selectedDayBookings,
  })
}

// TODO check if really need
export const setClickedDate = (newClickedDate: Date) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: FACILITY_ACTIONS.SET_CLICKED_DATE,
    clickedDate: newClickedDate,
  })
}
