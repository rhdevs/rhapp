import { Reducer } from 'redux'
import { ActionTypes, Booking, CALENDAR_ACTIONS } from './types'

const initialState = {
  clickedDate: new Date(),
  isLoading: false,
  CalendarViewFacilityStartDate: new Date(),
  facilityBookings: [],
  processedDates: [],
}

type State = {
  clickedDate: Date
  isLoading: boolean
  CalendarViewFacilityStartDate: Date
  facilityBookings: Booking[]
  processedDates: Date[]
}

export const calendar: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case CALENDAR_ACTIONS.SET_CLICKED_DATE: {
      return {
        ...state,
        clickedDate: action.newClickedDate,
      }
    }
    case CALENDAR_ACTIONS.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      }
    }
    case CALENDAR_ACTIONS.SET_CALENDAR_VIEW_FACILITY_START_DATE: {
      return {
        ...state,
        CalendarViewFacilityStartDate: action.CalendarViewFacilityStartDate,
      }
    }
    case CALENDAR_ACTIONS.SET_FACILITY_BOOKINGS: {
      return {
        ...state,
        facilityBookings: action.facilityBookings,
      }
    }
    case CALENDAR_ACTIONS.SET_PROCESSED_DATES: {
      return {
        ...state,
        processedDates: action.processedDates,
      }
    }
    default:
      return state
  }
}
