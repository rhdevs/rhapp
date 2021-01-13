import { Reducer } from 'redux'
import { ActionTypes, UserEvent, SchedulingEvent, SCHEDULING_ACTIONS } from './types'
import { SearchResult } from '../types'

const initialState = {
  isLoading: true,
  userEvents: [],
  userEventsList: [],
  newUserEvents: [],
  userEventsStartTime: 0,
  userEventsEndTime: 2400,
  shareSearchResults: [],
  searchedEvents: [],
  userNusModsLink: '',
  userNusModsEvents: [],

  // Create new event states
  newEventName: '',
  newEventLocation: '',
  newEventFromDate: new Date(),
  newEventToDate: new Date(),
  newCca: '',
  newDescription: '',
  newHallEventType: '',
  hallEventTypes: [],
}

type State = {
  isLoading: boolean
  userEvents: UserEvent[][][]
  userEventsList: UserEvent[]
  newUserEvents: UserEvent[]
  userEventsStartTime: number
  userEventsEndTime: number
  shareSearchResults: SearchResult[]
  searchedEvents: SchedulingEvent[]
  userNusModsLink: string
  userNusModsEvents: UserEvent[]
  newEventName: string
  newEventLocation: string
  newEventFromDate: Date
  newEventToDate: Date
  newCca: string
  newDescription: string
  hallEventTypes: string[]
  newHallEventType: string
}

export const scheduling: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SCHEDULING_ACTIONS.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
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
    case SCHEDULING_ACTIONS.SET_USER_NUSMODS_LINK: {
      return {
        ...state,
        userNusModsLink: action.userNusModsLink,
      }
    }
    case SCHEDULING_ACTIONS.GET_NUSMODS_EVENTS: {
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
    case SCHEDULING_ACTIONS.SET_CCA: {
      return {
        ...state,
        newCca: action.newCca,
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
    default:
      return state
  }
}
