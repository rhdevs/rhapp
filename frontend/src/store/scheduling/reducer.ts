import { Reducer } from 'redux'
import { ActionTypes, CCADetails, Profile, SchedulingEvent, SCHEDULING_ACTIONS, TimetableEvent } from './types'
import { Friend } from '../social/types'
import { userCCA } from '../facilityBooking/types'

const initialState = {
  isLoading: true,
  userCurrentEvents: [],
  userCurrentEventsList: [],
  userAllEventsList: [],
  userNusModsEventsList: [],
  userCurrentEventsStartTime: 1000,
  userCurrentEventsEndTime: 1800,
  shareSearchResults: [],
  searchedEvents: [],
  allPublicEvents: [],
  userNusModsEvents: [],
  nusModsIsSuccessful: false,
  nusModsIsFailure: false,
  eventAttendanceIsSuccessful: false,
  eventAttendanceIsFailure: false,

  // Create new event states
  newEventName: '',
  newEventLocation: '',
  newEventFromDate: new Date(),
  newEventToDate: new Date(),
  newTargetAudience: '',
  newDescription: '',
  newHallEventType: '',
  hallEventTypes: [],
  targetAudienceList: [],

  //view event state
  selectedEvent: null,
  ccaDetails: null,
  deletedEventIsSuccess: false,
  deletedEventIsFailure: false,

  ccaList: [],
  profileList: [],
  selectedProfileIds: [],
  selectedProfileEvents: [],
  selectedProfileNusModsEvents: [],
  selectedCCAIds: [],
  selectedCCAEvents: [],
}

type State = {
  isLoading: boolean
  userCurrentEvents: TimetableEvent[][][]
  userCurrentEventsList: TimetableEvent[]
  userAllEventsList: TimetableEvent[]
  userNusModsEventsList: TimetableEvent[]
  userCurrentEventsStartTime: number
  userCurrentEventsEndTime: number
  shareSearchResults: Friend[]
  searchedEvents: SchedulingEvent[]
  allPublicEvents: SchedulingEvent[]
  userNusModsEvents: TimetableEvent[]
  nusModsIsSuccessful: boolean
  nusModsIsFailure: boolean
  eventAttendanceIsSuccessful: boolean
  eventAttendanceIsFailure: boolean
  newEventName: string
  newEventLocation: string
  newEventFromDate: Date
  newEventToDate: Date
  newTargetAudience: string
  newDescription: string
  hallEventTypes: string[]
  newHallEventType: string
  targetAudienceList: userCCA[]
  selectedEvent: TimetableEvent | null
  ccaDetails: CCADetails | null
  deletedEventIsSuccess: boolean
  deletedEventIsFailure: boolean
  ccaList: CCADetails[]
  profileList: Profile[]
  selectedProfileIds: string[]
  selectedProfileEvents: SchedulingEvent[]
  selectedProfileNusModsEvents: TimetableEvent[]
  selectedCCAIds: number[]
  selectedCCAEvents: SchedulingEvent[]
}

export const scheduling: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SCHEDULING_ACTIONS.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      }
    }
    case SCHEDULING_ACTIONS.HANDLE_NUSMODS_STATUS: {
      return {
        ...state,
        nusModsIsSuccessful: action.nusModsIsSuccessful,
        nusModsIsFailure: action.nusModsIsFailure,
      }
    }
    case SCHEDULING_ACTIONS.HANDLE_EVENT_ATTENDANCE_STATUS: {
      return {
        ...state,
        eventAttendanceIsSuccessful: action.eventAttendanceIsSuccessful,
        eventAttendanceIsFailure: action.eventAttendanceIsFailure,
      }
    }
    case SCHEDULING_ACTIONS.GET_ALL_PUBLIC_EVENTS: {
      return {
        ...state,
        allPublicEvents: action.allPublicEvents,
      }
    }
    case SCHEDULING_ACTIONS.GET_CURRENT_USER_EVENTS: {
      return {
        ...state,
        userCurrentEvents: action.userCurrentEvents,
        userCurrentEventsList: action.userCurrentEventsList,
        userCurrentEventsStartTime: action.userCurrentEventsStartTime,
        userCurrentEventsEndTime: action.userCurrentEventsEndTime,
      }
    }
    case SCHEDULING_ACTIONS.GET_ALL_USER_EVENTS: {
      return {
        ...state,
        userAllEventsList: action.userAllEventsList,
      }
    }
    case SCHEDULING_ACTIONS.GET_USER_NUSMODS_EVENTS: {
      return {
        ...state,
        userNusModsEventsList: action.userNusModsEventsList,
      }
    }
    case SCHEDULING_ACTIONS.EDIT_USER_NUSMODS_EVENTS: {
      return {
        ...state,
        userNusModsEvents: action.userNusModsEvents,
      }
    }
    case SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS: {
      return {
        ...state,
        shareSearchResults: action.shareSearchResults,
      }
    }
    case SCHEDULING_ACTIONS.GET_SEARCHED_EVENTS: {
      return {
        ...state,
        searchedEvents: action.searchedEvents,
      }
    }
    case SCHEDULING_ACTIONS.SET_EVENT_NAME: {
      return {
        ...state,
        newEventName: action.newEventName,
      }
    }
    case SCHEDULING_ACTIONS.SET_EVENT_LOCATION: {
      return {
        ...state,
        newEventLocation: action.newEventLocation,
      }
    }
    case SCHEDULING_ACTIONS.SET_EVENT_FROM_DATE: {
      return {
        ...state,
        newEventFromDate: action.newEventFromDate,
      }
    }
    case SCHEDULING_ACTIONS.SET_EVENT_TO_DATE: {
      return {
        ...state,
        newEventToDate: action.newEventToDate,
      }
    }
    case SCHEDULING_ACTIONS.SET_TARGET_AUDIENCE: {
      return {
        ...state,
        newTargetAudience: action.newTargetAudience,
      }
    }
    case SCHEDULING_ACTIONS.SET_DESCRIPTION: {
      return {
        ...state,
        newDescription: action.newDescription,
      }
    }
    case SCHEDULING_ACTIONS.GET_HALL_EVENT_TYPES: {
      return {
        ...state,
        hallEventTypes: action.hallEventTypes,
      }
    }
    case SCHEDULING_ACTIONS.SET_HALL_EVENT_TYPE: {
      return {
        ...state,
        newHallEventType: action.newHallEventType,
      }
    }
    case SCHEDULING_ACTIONS.GET_TARGET_AUDIENCE_LIST: {
      return {
        ...state,
        targetAudienceList: action.targetAudienceList,
      }
    }
    case SCHEDULING_ACTIONS.SET_SELECTED_EVENT: {
      return {
        ...state,
        selectedEvent: action.selectedEvent,
      }
    }
    case SCHEDULING_ACTIONS.GET_CCA_DETAILS: {
      return {
        ...state,
        ccaDetails: action.ccaDetails,
      }
    }
    case SCHEDULING_ACTIONS.GET_ALL_CCA: {
      return {
        ...state,
        ccaList: action.ccaList,
      }
    }
    case SCHEDULING_ACTIONS.GET_ALL_PROFILES: {
      return {
        ...state,
        profileList: action.profileList,
      }
    }
    case SCHEDULING_ACTIONS.SET_SELECTED_PROFILE_IDS: {
      return {
        ...state,
        selectedProfileIds: action.selectedProfileIds,
      }
    }
    case SCHEDULING_ACTIONS.GET_SELECTED_PROFILE_EVENTS: {
      return {
        ...state,
        selectedProfileEvents: action.selectedProfileEvents,
      }
    }
    case SCHEDULING_ACTIONS.GET_SELECTED_PROFILE_NUSMODS_EVENTS: {
      return {
        ...state,
        selectedProfileNusModsEvents: action.selectedProfileNusModsEvents,
      }
    }
    case SCHEDULING_ACTIONS.SET_SELECTED_CCA_IDS: {
      return {
        ...state,
        selectedCCAIds: action.selectedCCAIds,
      }
    }
    case SCHEDULING_ACTIONS.GET_SELECTED_CCA_EVENTS: {
      return {
        ...state,
        selectedCCAEvents: action.selectedCCAEvents,
      }
    }
    case SCHEDULING_ACTIONS.SET_DELETED_EVENT_STATUS: {
      return {
        ...state,
        deletedEventIsSuccess: action.deletedEventIsSuccess,
        deletedEventIsFailure: action.deletedEventIsFailure,
      }
    }
    default:
      return state
  }
}
