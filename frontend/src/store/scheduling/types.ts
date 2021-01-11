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
  hasOverlap: boolean
}

// type lessonTypeAbbrev = { [abbrevLessonType: string]: string }

/** Actions' types */

export enum SCHEDULING_ACTIONS {
  SET_IS_LOADING = 'SCHEDULING_ACTIONS.SET_IS_LOADING',
  GET_RH_EVENTS = 'SCHEDULING_ACTIONS.GET_RH_EVENTS',
  GET_SHARE_SEARCH_RESULTS = 'SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS',
  GET_SEARCHED_RH_EVENT = 'SCHEDULING_ACTIONS.GET_SEARCHED_RH_EVENT',
}

/** Actions */

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

type GetSearchedRhEvent = {
  type: typeof SCHEDULING_ACTIONS.GET_SEARCHED_RH_EVENT
  searchedRhEvent: RHEvent
}

export type ActionTypes = GetRhEvents | GetShareSearchResults | SetIsLoading | GetSearchedRhEvent
