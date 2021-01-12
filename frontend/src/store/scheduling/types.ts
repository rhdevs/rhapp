import { SearchResult } from '../types'

/** Types */

// type NUSModsEvent = {
//   classNo: string
//   covidZone: string
//   day: string
//   endTime: string
//   lessonType: string
//   size: number
//   startTime: string
//   venue: string
//   weeks: number[]
// }

export type RHEvent = {
  eventName: string
  location: string
  day: string
  endTime: string
  startTime: string
}

export type SchedulingEvent = {
  eventID: number
  eventName: string
  startDateTime: number
  endDateTime: number
  description: string
  location: string
  ccaID: number
  userID: string
  image: null | string
}

/** Actions' types */

export enum SCHEDULING_ACTIONS {
  SET_IS_LOADING = 'SCHEDULING_ACTIONS.SET_IS_LOADING',
  GET_RH_EVENTS = 'SCHEDULING_ACTIONS.GET_RH_EVENTS',
  GET_SHARE_SEARCH_RESULTS = 'SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS',
  SET_EVENT_NAME = 'SCHEDULING_ACTIONS.SET_EVENT_NAME',
  SET_EVENT_LOCATION = 'SCHEDULING_ACTIONS.SET_EVENT_LOCATION',
  SET_EVENT_FROM_DATE = 'SCHEDULING_ACTIONS.SET_EVENT_FROM_DATE',
  SET_EVENT_TO_DATE = 'SCHEDULING_ACTIONS.SET_EVENT_TO_DATE',
  SET_CCA = 'SCHEDULING_ACTIONS.SET_CCA',
  SET_DESCRIPTION = 'SCHEDULING_ACTIONS.SET_DESCRIPTION',
  GET_HALL_EVENT_TYPES = 'SCHEDULING_ACTIONS.GET_HALL_EVENT_TYPES',
  SET_HALL_EVENT_TYPE = 'SCHEDULING_ACTIONS.SET_HALL_EVENT_TYPE',
}

/** Actions */

type getHallEventTypes = {
  type: typeof SCHEDULING_ACTIONS.GET_HALL_EVENT_TYPES
  hallEventTypes: string[]
}

type GetRhEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_RH_EVENTS
  userRhEvents: RHEvent[][][]
  userEventsStartTime: number
  userEventsEndTime: number
}

type GetShareSearchResults = {
  type: typeof SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS
  shareSearchResults: SearchResult[]
}

type SetIsLoading = {
  type: typeof SCHEDULING_ACTIONS.SET_IS_LOADING
  isLoading: boolean
}

type SetEventName = {
  type: typeof SCHEDULING_ACTIONS.SET_EVENT_NAME
  newEventName: string
}

type SetEventLocation = {
  type: typeof SCHEDULING_ACTIONS.SET_EVENT_LOCATION
  newEventLocation: string
}

type SetEventFromDate = {
  type: typeof SCHEDULING_ACTIONS.SET_EVENT_FROM_DATE
  newEventFromDate: Date
}

type SetEventToDate = {
  type: typeof SCHEDULING_ACTIONS.SET_EVENT_TO_DATE
  newEventToDate: Date
}

type SetCca = {
  type: typeof SCHEDULING_ACTIONS.SET_CCA
  newCca: string
}

type SetDescription = {
  type: typeof SCHEDULING_ACTIONS.SET_DESCRIPTION
  newDescription: string
}

type SetHallEventType = {
  type: typeof SCHEDULING_ACTIONS.SET_HALL_EVENT_TYPE
  newHallEventType: string
}

export type ActionTypes =
  | GetRhEvents
  | SetEventName
  | SetEventLocation
  | SetEventFromDate
  | SetEventToDate
  | SetCca
  | SetDescription
  | GetShareSearchResults
  | SetIsLoading
  | getHallEventTypes
  | SetHallEventType
