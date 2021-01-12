import { Reducer } from 'redux'
import { ActionTypes, RHEvent, SchedulingEvent, SCHEDULING_ACTIONS } from './types'
import { SearchResult } from '../types'

const initialState = {
  isLoading: true,
  userRhEvents: [],
  userRhEventsList: [],
  newUserRhEvents: [],
  userEventsStartTime: 0,
  userEventsEndTime: 2400,
  shareSearchResults: [],
  searchedEvents: [],
}

type State = {
  isLoading: boolean
  userRhEvents: RHEvent[][][]
  userRhEventsList: RHEvent[]
  newUserRhEvents: RHEvent[]
  userEventsStartTime: number
  userEventsEndTime: number
  shareSearchResults: SearchResult[]
  searchedEvents: SchedulingEvent[]
}

export const scheduling: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SCHEDULING_ACTIONS.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      }
    }
    case SCHEDULING_ACTIONS.GET_USER_RH_EVENTS: {
      return {
        ...state,
        userRhEvents: action.userRhEvents,
        userRhEventsList: action.userRhEventsList,
        userEventsStartTime: action.userEventsStartTime,
        userEventsEndTime: action.userEventsEndTime,
      }
    }
    case SCHEDULING_ACTIONS.EDIT_USER_RH_EVENTS: {
      return {
        ...state,
        newUserRhEvents: action.newUserRhEvents,
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
