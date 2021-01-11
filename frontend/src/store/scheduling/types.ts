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
  date?: string
  endTime: string
  startTime: string
  hasOverlap?: boolean
}

export type SchedulingEvent = {
  eventID: number
  eventName: string
  startDateTime: Date
  endDateTime: Date
  description: string
  location: string
  ccaID: number
  userID: string
  image: string
}

/** Actions' types */

export enum SCHEDULING_ACTIONS {
  SET_IS_LOADING = 'SCHEDULING_ACTIONS.SET_IS_LOADING',
  GET_RH_EVENTS = 'SCHEDULING_ACTIONS.GET_RH_EVENTS',
  GET_SEARCHED_EVENTS = 'SCHEDULING_ACTIONS.GET_SEARCHED_EVENTS',
  GET_SHARE_SEARCH_RESULTS = 'SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS',
  SET_EVENT_NAME = 'SCHEDULING_ACTIONS.SET_EVENT_NAME',
  SET_EVENT_LOCATION = 'SCHEDULING_ACTIONS.SET_EVENT_LOCATION',
  SET_EVENT_FROM_DATE = 'SCHEDULING_ACTIONS.SET_EVENT_FROM_DATE',
  SET_CCA = 'SCHEDULING_ACTIONS.SET_CCA',
  SET_DESCRIPTION = 'SCHEDULING_ACTIONS.SET_DESCRIPTION',
}

/** Actions */

type GetRhEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_RH_EVENTS
  userRhEvents: RHEvent[][][]
  userEventsStartTime: number
  userEventsEndTime: number
}

type GetSearchedEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_SEARCHED_EVENTS
  searchedEvents: SchedulingEvent[]
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

type SetCca = {
  type: typeof SCHEDULING_ACTIONS.SET_CCA
  newCca: string
}

type SetDescription = {
  type: typeof SCHEDULING_ACTIONS.SET_DESCRIPTION
  newDescription: string
}

export type ActionTypes =
  | GetRhEvents
  | SetEventName
  | SetEventLocation
  | SetEventFromDate
  | SetCca
  | SetDescription
  | GetShareSearchResults
  | SetIsLoading
  | GetSearchedEvents
