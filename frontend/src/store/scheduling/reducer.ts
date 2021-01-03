import { Reducer } from 'redux'
import { ActionTypes, RHEvent, SCHEDULING_ACTIONS } from './types'

const initialState = {
  userRhEvents: [],
  userEventsStartTime: 0,
  userEventsEndTime: 2400,

  // Create new event states
  newEventName: '',
  newEventLocation: '',
  newEventFromDate: new Date(),
}

type State = {
  userRhEvents: RHEvent[][][]
  userEventsStartTime: number
  userEventsEndTime: number
  newEventName: string
  newEventLocation: string
  newEventFromDate: Date
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
    default:
      return state
  }
}
