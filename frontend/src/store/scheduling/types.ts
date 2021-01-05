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

// type lessonTypeAbbrev = { [abbrevLessonType: string]: string }

/** Actions' types */

export enum SCHEDULING_ACTIONS {
  GET_RH_EVENTS = 'SCHEDULING_ACTIONS.GET_RH_EVENTS',
  GET_SHARE_SEARCH_RESULTS = 'SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS',
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

export type ActionTypes = GetRhEvents | GetShareSearchResults
