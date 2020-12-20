import { Reducer } from 'redux'
import { ActionTypes, FACILITY_ACTIONS, Facility, Booking } from './types'

const initialState = {
  facilityList: [],
  locationList: [],
  selectedTab: '',
  myBookings: [],
  isDeleteMyBooking: -1,
}

type State = {
  facilityList: Facility[]
  locationList: string[]
  selectedTab: string
  myBookings: Booking[]
  isDeleteMyBooking: number
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
    default:
      return state
  }
}
