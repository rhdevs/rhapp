import { Reducer } from 'redux'
import { defaultTimeBlocks, myBookingsStub } from '../stubs'
import { ActionTypes, FACILITY_ACTIONS, Facility, Booking, userCCA, BookingStatus, TimeBlock } from './types'

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
  booking: null,
  bookingStatus: BookingStatus.INITIAL,
  selectedBlockTimestamp: 0,
  selectedStartTime: 0,
  selectedEndTime: 0,
  bookingStartTime: 0,
  bookingEndTime: 0,
  bookingEndDate: 0,
  conflictBookings: [],
  timeBlocks: defaultTimeBlocks,
  selectedDayBookings: myBookingsStub,
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
  booking: Booking | null
  bookingStatus: BookingStatus
  message?: string
  selectedBlockTimestamp: number
  selectedStartTime: number
  selectedEndTime: number
  bookingStartTime: number
  bookingEndTime: number
  bookingEndDate: number
  conflictBookings: Booking[]
  timeBlocks: TimeBlock[]
  selectedDayBookings: Booking[]
}

export const facilityBooking: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
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
    case FACILITY_ACTIONS.SET_BOOKING: {
      return {
        ...state,
        booking: action.booking,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_STATUS: {
      return {
        ...state,
        bookingStatus: action.bookingStatus,
        message: action.message,
      }
    }

    case FACILITY_ACTIONS.SET_SELECTED_BLOCK_TIMESTAMP: {
      return {
        ...state,
        selectedBlockTimestamp: action.selectedBlockTimestamp,
      }
    }
    case FACILITY_ACTIONS.SET_SELECTED_START_TIME: {
      return {
        ...state,
        selectedStartTime: action.selectedStartTime,
      }
    }
    case FACILITY_ACTIONS.SET_SELECTED_END_TIME: {
      return {
        ...state,
        selectedEndTime: action.selectedEndTime,
      }
    }

    case FACILITY_ACTIONS.SET_BOOKING_START_TIME: {
      return {
        ...state,
        bookingStartTime: action.bookingStartTime,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_END_TIME: {
      return {
        ...state,
        bookingEndTime: action.bookingEndTime,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_END_DATE: {
      return {
        ...state,
        bookingEndDate: action.bookingEndDate,
      }
    }
    case FACILITY_ACTIONS.SET_CONFLICT_BOOKINGS: {
      return {
        ...state,
        conflictBookings: action.conflictBookings,
      }
    }
    case FACILITY_ACTIONS.SET_TIME_BLOCKS: {
      return {
        ...state,
        timeBlocks: action.timeBlocks,
      }
    }
    case FACILITY_ACTIONS.SET_SELECTED_DAY_BOOKINGS: {
      return {
        ...state,
        selectedDayBookings: action.selectedDayBookings,
      }
    }
    default:
      return state
  }
}
