import { Reducer } from 'redux'
import { ActionTypes, RHEvent, SCHEDULING_ACTIONS } from './types'
import { SearchResult } from '../types'

const initialState = {
  isLoading: true,
  userRhEvents: [],
  userEventsStartTime: 0,
  userEventsEndTime: 2400,
  shareSearchResults: [],
  searchedEvents: [],
}

type State = {
  isLoading: boolean
  userRhEvents: RHEvent[][][]
  userEventsStartTime: number
  userEventsEndTime: number
  shareSearchResults: SearchResult[]
  searchedEvents: RHEvent[]
}

export const scheduling: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SCHEDULING_ACTIONS.SET_IS_LOADING: {
      return {
        ...state,
        isLoading: action.isLoading,
      }
    }
    case SCHEDULING_ACTIONS.GET_RH_EVENTS: {
      return {
        ...state,
        userRhEvents: action.userRhEvents,
        userEventsStartTime: action.userEventsStartTime,
        userEventsEndTime: action.userEventsEndTime,
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
