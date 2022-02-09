import { Dispatch, GetState } from '../types'
import { ActionTypes, CALENDAR_ACTIONS, Booking } from './types'
import { ENDPOINTS, DOMAINS, get, del, DOMAIN_URL, put } from '../endpoints'

export const SetIsClicked = (newClickedDate: number) => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isClicked, clickedDate } = getState().calendar
  if (isClicked) {
    if (newClickedDate !== clickedDate) {
      return
    } else {
      dispatch({
        type: CALENDAR_ACTIONS.SET_IS_CLICKED,
        newIsClicked: false,
        newClickedDate: 0,
      })
      return
    }
  }
  dispatch({
    type: CALENDAR_ACTIONS.SET_IS_CLICKED,
    newIsClicked: true,
    newClickedDate: newClickedDate,
  })
}

export const getAllBookingsForFacility = (ViewStartDate: Date, selectedFacilityId: number) => async (
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
  // need to adjust this to set it as 5 months away from starting date
  const adjustedEnd = new Date(ViewStartDate.getFullYear(), ViewStartDate.getMonth() + 5, 0, 23, 59, 59, 999)
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
    type: CALENDAR_ACTIONS.SET_FACILITY_BOOKINGS,
    facilityBookings: updatedFB,
  })
  dispatch(UpdateProcessedDates(updatedFB))
  dispatch(SetIsLoading(false))
}

export const SetIsLoading = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: CALENDAR_ACTIONS.SET_IS_LOADING, isLoading: desiredState })
}

export const UpdateProcessedDates = (rawBookingsDetails: Booking[]) => async (dispatch: Dispatch<ActionTypes>) => {
  const newProcessedDates: number[] = []
  const convertDates = (unprocessedDate: number) => {
    const month = new Date(unprocessedDate * 1000).getMonth() + 1
    const day = new Date(unprocessedDate * 1000).getDate()
    const processedDate = month * 100 + day
    newProcessedDates.push(processedDate)
    return
  }

  rawBookingsDetails.forEach((booking) => convertDates(booking.startTime))
  rawBookingsDetails.forEach((booking) => convertDates(booking.endTime))
  dispatch({
    type: CALENDAR_ACTIONS.SET_PROCESSED_DATES,
    processedDates: newProcessedDates,
  })
}

export const setViewDates = (newDate: any, selectedFacilityId: number) => (dispatch: Dispatch<ActionTypes>) => {
  const startDate = newDate
  const endDate = newDate

  // dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE, ViewStartDate: startDate })
  // dispatch({ type: FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE, ViewEndDate: endDate })
  // dispatch(getAllBookingsForFacility(startDate, endDate, selectedFacilityId))
}
