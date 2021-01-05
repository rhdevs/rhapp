import { Reducer } from 'redux'
import { ActionTypes, RHEvent, SCHEDULING_ACTIONS } from './types'
import { SearchResult } from '../types'

const initialState = {
  userRhEvents: [],
  userEventsStartTime: 0,
  userEventsEndTime: 2400,
  shareSearchResults: [],
}

type State = {
  userRhEvents: RHEvent[][][]
  userEventsStartTime: number
  userEventsEndTime: number
  shareSearchResults: SearchResult[]
}

export const scheduling: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
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
    default:
      return state
  }
}
