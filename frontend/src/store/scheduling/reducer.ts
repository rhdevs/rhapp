import { Reducer } from 'redux'
import { ActionTypes, SchedulingEvent, SCHEDULING_ACTIONS, TimetableEvent } from './types'
import { SearchResult } from '../types'
import { userCCA } from '../facilityBooking/types'

const initialState = {
  isLoading: true,
  userEvents: [],
  userEventsList: [],
  newUserEvents: [],
  userEventsStartTime: 0,
  userEventsEndTime: 2400,
  shareSearchResults: [],
  searchedEvents: [],
  allPublicEvents: [],
  userNusModsEvents: [],
  isSuccessful: false,
  isFailure: false,

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
}

type State = {
  isLoading: boolean
  userEvents: TimetableEvent[][][]
  userEventsList: TimetableEvent[]
  newUserEvents: TimetableEvent[]
  userEventsStartTime: number
  userEventsEndTime: number
  shareSearchResults: SearchResult[]
  searchedEvents: SchedulingEvent[]
  allPublicEvents: SchedulingEvent[]
  userNusModsEvents: TimetableEvent[]
  isSuccessful: boolean
  isFailure: boolean
  newEventName: string
  newEventLocation: string
  newEventFromDate: Date
  newEventToDate: Date
  newTargetAudience: string
  newDescription: string
  hallEventTypes: string[]
  newHallEventType: string
  targetAudienceList: userCCA[]
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
        isSuccessful: action.isSuccessful,
        isFailure: action.isFailure,
      }
    }
    case SCHEDULING_ACTIONS.GET_ALL_PUBLIC_EVENTS: {
      return {
        ...state,
        allPublicEvents: action.allPublicEvents,
      }
    }
    case SCHEDULING_ACTIONS.GET_USER_EVENTS: {
      return {
        ...state,
        userEvents: action.userEvents,
        userEventsList: action.userEventsList,
        userEventsStartTime: action.userEventsStartTime,
        userEventsEndTime: action.userEventsEndTime,
      }
    }
    case SCHEDULING_ACTIONS.EDIT_USER_EVENTS: {
      return {
        ...state,
        newUserEvents: action.newUserEvents,
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
    default:
      return state
  }
}
