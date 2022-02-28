import { Dispatch } from '../types'
import { ActionTypes, CALENDAR_ACTIONS, Booking } from './types'
import { ENDPOINTS, DOMAIN_URL } from '../endpoints'
import { unixToCalendarFormat } from '../../common/unixToCalendarFormat'

export const SetClickedDate = (newClickedDate: number) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: CALENDAR_ACTIONS.SET_CLICKED_DATE,
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

  rawBookingsDetails.forEach((booking) => unixToCalendarFormat(booking.startTime, newProcessedDates))
  rawBookingsDetails.forEach((booking) => unixToCalendarFormat(booking.endTime, newProcessedDates))
  dispatch({
    type: CALENDAR_ACTIONS.SET_PROCESSED_DATES,
    processedDates: newProcessedDates,
  })
}
