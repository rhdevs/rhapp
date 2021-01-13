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
      }
    }
    default:
      return state
  }
}
