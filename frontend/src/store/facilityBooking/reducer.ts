import dayjs from 'dayjs'
import { Reducer } from 'redux'
import { ActionTypes, FACILITY_ACTIONS, Facility, Booking } from './types'

const initialState = {
  // MAIN PAGE
  facilityList: [],
  locationList: [],
  selectedTab: '',
  myBookings: [],
  isDeleteMyBooking: -1,
  newBooking: undefined,
  // CREATE NEW BOOKING STATES
  newBookingName: '',
  newBookingFromDate: new Date(),
  newBookingToDate: dayjs(new Date()).add(1, 'hour').toDate(),
  newBookingCCA: '',
  newBookingDescription: '',
}

type State = {
  facilityList: Facility[]
  locationList: string[]
  selectedTab: string
  myBookings: Booking[]
  isDeleteMyBooking: number
  newBooking: Booking | undefined
  newBookingName: string
  newBookingFromDate: Date
  newBookingToDate: Date
  newBookingCCA: string
  newBookingDescription: string
}

export const facilityBooking: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case FACILITY_ACTIONS.GET_FACILITY_LIST: {
      return {
        ...state,
        facilityList: action.facilityList,
        locationList: action.locationList,
      }
    }
    case FACILITY_ACTIONS.GET_MY_BOOKINGS: {
      return {
        ...state,
        myBookings: action.myBookings,
      }
    }
    case FACILITY_ACTIONS.CHANGE_TAB: {
      return {
        ...state,
        selectedTab: action.newTab,
      }
    }
    case FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING: {
      return {
        ...state,
        isDeleteMyBooking: action.isDeleteMyBooking,
      }
    }
    case FACILITY_ACTIONS.DELETE_MY_BOOKING: {
      return {
        ...state,
        myBookings: action.myBookings,
      }
    }
    case FACILITY_ACTIONS.EDIT_MY_BOOKING: {
      return {
        ...state,
        newBooking: action.newBooking,
      }
    }

    case FACILITY_ACTIONS.SET_BOOKING_NAME: {
      return {
        ...state,
        newBookingName: action.newBookingName,
      }
    }

    case FACILITY_ACTIONS.SET_BOOKING_FROM_DATE: {
      return {
        ...state,
        newBookingFromDate: action.newBookingFromDate,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_TO_DATE: {
      return {
        ...state,
        newBookingToDate: action.newBookingToDate,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_CCA: {
      return {
        ...state,
        newBookingCCA: action.newBookingCCA,
      }
    }

    case FACILITY_ACTIONS.SET_BOOKING_DESCRIPTION: {
      return {
        ...state,
        newBookingDescription: action.newBookingDescription,
      }
    }

    default:
      return state
  }
}
