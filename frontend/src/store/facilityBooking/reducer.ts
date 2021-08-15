import dayjs from 'dayjs'
import { Reducer } from 'redux'
import { ActionTypes, FACILITY_ACTIONS, Facility, Booking, userCCA } from './types'

const initialState = {
  // MAIN PAGE
  isLoading: false,
  blockOutIsOpen: false,
  isJcrc: false,
  facilityList: [],
  locationList: [],
  selectedTab: '',
  selectedFacility: null,
  selectedBooking: null,
  myBookings: [],
  isDeleteMyBooking: -1,
  newBooking: undefined,
  // CREATE NEW BOOKING STATES
  newBookingName: '',
  newBookingFacilityName: '',
  newBookingFacilityId: '',
  newBookingFromDate: new Date(),
  newBookingToDate: dayjs(new Date()).add(1, 'hour').toDate(),
  newBookingCCA: '',
  newBookingDescription: '',
  createSuccess: false,
  createFailure: false,
  createBookingError: '',
  // VIEW FACILITY PARAMS
  ViewStartDate: new Date(),
  ViewEndDate: new Date(),
  ViewFacilityMode: 'Bookings',
  selectedFacilityId: 0,
  ccaList: [],
  facilityBookings: [],
  selectedFacilityName: '',
  numRepeatWeekly: 1,
}

type State = {
  isLoading: boolean
  blockOutIsOpen: boolean
  isJcrc: boolean
  facilityList: Facility[]
  locationList: string[]
  selectedTab: string
  selectedFacility: Facility | null
  selectedBooking: Booking | null
  myBookings: Booking[]
  isDeleteMyBooking: number
  newBooking: Booking | undefined
  newBookingFacilityName: string
  newBookingFacilityId: string
  newBookingName: string
  newBookingFromDate: Date
  newBookingToDate: Date
  newBookingCCA: string
  newBookingDescription: string
  createSuccess: boolean
  createFailure: boolean
  ViewStartDate: Date
  ViewEndDate: Date
  selectedFacilityId: number
  ccaList: userCCA[]
  facilityBookings: Booking[]
  selectedFacilityName: string
  createBookingError: string
  numRepeatWeekly: number
}

export const facilityBooking: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case FACILITY_ACTIONS.SET_BOOKING_FACILITY_ID: {
      return {
        ...state,
        newBookingFacilityId: action.newBookingFacilityId,
      }
    }
    case FACILITY_ACTIONS.SET_VIEW_FACILITY_NAME: {
      return {
        ...state,
        selectedFacilityName: action.selectedFacilityName,
      }
    }
    case FACILITY_ACTIONS.SET_CREATE_BOOKING_ERROR: {
      return {
        ...state,
        createBookingError: action.createBookingError,
      }
    }
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

    case FACILITY_ACTIONS.SET_VIEW_FACILITY_START_DATE: {
      return {
        ...state,
        ViewStartDate: action.ViewStartDate,
      }
    }

    case FACILITY_ACTIONS.SET_VIEW_FACILITY_END_DATE: {
      return {
        ...state,
        ViewEndDate: action.ViewEndDate,
      }
    }

    case FACILITY_ACTIONS.SET_VIEW_FACILITY_MODE: {
      return {
        ...state,
        ViewFacilityMode: action.ViewFacilityMode,
      }
    }

    case FACILITY_ACTIONS.SET_BOOKING_FACILITY: {
      return {
        ...state,
        newBookingFacilityName: action.newBookingFacilityName,
      }
    }

    case FACILITY_ACTIONS.HANDLE_CREATE_BOOKING: {
      return {
        ...state,
        createFailure: action.createFailure,
        createSuccess: action.createSuccess,
      }
    }

    case FACILITY_ACTIONS.POPULATE_FACILITY_BOOKINGS: {
      return {
        ...state,
        bookings: action.bookings,
      }
    }

    case FACILITY_ACTIONS.SET_FACILITY_DETAILS: {
      return {
        ...state,
        selectedFacility: action.selectedFacility,
      }
    }

    case FACILITY_ACTIONS.SET_VIEW_BOOKING: {
      return {
        ...state,
        selectedBooking: action.selectedBooking,
      }
    }

    case FACILITY_ACTIONS.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      }
    }

    case FACILITY_ACTIONS.SET_BLOCK_OUT_IS_OPEN: {
      return {
        ...state,
        blockOutIsOpen: action.blockOutIsOpen,
      }
    }

    case FACILITY_ACTIONS.SET_IS_JCRC: {
      return {
        ...state,
        isJcrc: action.isJcrc,
      }
    }

    case FACILITY_ACTIONS.SET_SELECTED_FACILITY: {
      return {
        ...state,
        selectedFacilityId: action.selectedFacilityId,
      }
    }

    case FACILITY_ACTIONS.GET_ALL_CCA: {
      return {
        ...state,
        ccaList: action.ccaList,
      }
    }

    case FACILITY_ACTIONS.SET_FACILITY_BOOKINGS: {
      return {
        ...state,
        facilityBookings: action.facilityBookings,
      }
    }

    case FACILITY_ACTIONS.SET_REPEAT_WEEKLY: {
      return {
        ...state,
        numRepeatWeekly: action.numRepeatWeekly,
      }
    }
    default:
      return state
  }
}
