import { Reducer } from 'redux'
import { defaultTimeBlocks, myBookingsStub } from '../stubs'
import {
  ActionTypes,
  FACILITY_ACTIONS,
  Facility,
  Booking,
  userCCA,
  BookingStatus,
  TimeBlock,
  SearchMode,
} from './types'

const initialState: State = {
  // MAIN PAGE
  isLoading: false,
  blockOutIsOpen: false,
  isJcrc: false,
  facilityList: [],
  facilityListWithinTime: [],
  locationList: [],
  locationListWithinTime: [],
  selectedFacility: null,
  selectedBookingToView: null,
  selectedBookingToEdit: null,
  myBookings: [],
  bookingIdToDelete: -1,
  searchMode: SearchMode.NONE,
  // VIEW FACILITY PARAMS
  ViewStartDate: new Date(),
  ViewEndDate: new Date(),
  selectedFacilityId: 0,
  ccaList: [],
  facilityBookings: [],
  selectedFacilityName: '',
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
  clickedDate: new Date(),
  bookingFormName: '',
  bookingFormCCA: '',
  bookingFormDescription: '',
}

type State = {
  // MAIN PAGE
  isLoading: boolean
  blockOutIsOpen: boolean
  isJcrc: boolean
  facilityList: Facility[]
  facilityListWithinTime: Facility[]
  locationList: string[]
  locationListWithinTime: string[]
  selectedFacility: Facility | null
  selectedBookingToView: Booking | null
  selectedBookingToEdit: Booking | null
  myBookings: Booking[]
  bookingIdToDelete: number
  searchMode: SearchMode
  // VIEW FACILITY PARAMS
  ViewStartDate: Date
  ViewEndDate: Date
  selectedFacilityId: number
  ccaList: userCCA[]
  facilityBookings: Booking[]
  selectedFacilityName: string
  booking: Booking | null
  bookingStatus: BookingStatus
  bookingErrorMessage?: string
  selectedBlockTimestamp: number
  selectedStartTime: number
  selectedEndTime: number
  bookingStartTime: number
  bookingEndTime: number
  bookingEndDate: number
  conflictBookings: Booking[]
  timeBlocks: TimeBlock[]
  selectedDayBookings: Booking[]
  clickedDate: Date
  bookingFormName: string
  bookingFormCCA: string
  bookingFormDescription: string
}

export const facilityBooking: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case FACILITY_ACTIONS.SET_VIEW_FACILITY_NAME: {
      return {
        ...state,
        selectedFacilityName: action.selectedFacilityName,
      }
    }
    case FACILITY_ACTIONS.GET_FACILITY_LIST: {
      return {
        ...state,
        facilityList: action.facilityList,
        locationList: action.locationList,
      }
    }
    case FACILITY_ACTIONS.GET_FACILITY_LIST_WITHIN_TIME: {
      return {
        ...state,
        facilityListWithinTime: action.facilityListWithinTime,
        locationListWithinTime: action.locationListWithinTime,
      }
    }
    case FACILITY_ACTIONS.GET_MY_BOOKINGS: {
      return {
        ...state,
        myBookings: action.myBookings,
      }
    }
    case FACILITY_ACTIONS.SET_IS_DELETE_MY_BOOKING: {
      return {
        ...state,
        bookingIdToDelete: action.bookingIdToDelete,
      }
    }
    case FACILITY_ACTIONS.DELETE_MY_BOOKING: {
      return {
        ...state,
        myBookings: action.myBookings,
      }
    }
    case FACILITY_ACTIONS.SET_SEARCH_MODE: {
      return {
        ...state,
        searchMode: action.searchMode,
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
        selectedBookingToView: action.selectedBookingToView,
      }
    }

    case FACILITY_ACTIONS.SET_EDIT_BOOKING: {
      return {
        ...state,
        selectedBookingToEdit: action.selectedBookingToEdit,
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
        bookingErrorMessage: action.bookingErrorMessage,
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
    case FACILITY_ACTIONS.SET_CLICKED_DATE: {
      return {
        ...state,
        clickedDate: action.clickedDate,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_FORM_NAME: {
      return {
        ...state,
        bookingFormName: action.bookingFormName,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_FORM_CCA: {
      return {
        ...state,
        bookingFormCCA: action.bookingFormCCA,
      }
    }
    case FACILITY_ACTIONS.SET_BOOKING_FORM_DESCRIPTION: {
      return {
        ...state,
        bookingFormDescription: action.bookingFormDescription,
      }
    }
    default:
      return state
  }
}
