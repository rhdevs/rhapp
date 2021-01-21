import { invert } from 'lodash'
import { userCCA } from '../facilityBooking/types'
import { Friend } from '../social/types'

type lessonTypeAbbrev = { [abbrevLessonType: string]: string }
export const ABBREV_TO_LESSON: lessonTypeAbbrev = {
  DLEC: 'Design Lecture',
  LAB: 'Laboratory',
  LEC: 'Lecture',
  PLEC: 'Packaged Lecture',
  PTUT: 'Packaged Tutorial',
  REC: 'Recitation',
  SEC: 'Sectional Teaching',
  SEM: 'Seminar-Style Module Class',
  TUT: 'Tutorial',
  TUT2: 'Tutorial Type 2',
  TUT3: 'Tutorial Type 3',
  WS: 'Workshop',
}

// Reverse lookup map of ABBREV_TO_LESSON
export const LESSON_TO_ABBREV: { [lessonType: string]: string } = invert(ABBREV_TO_LESSON)

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

export type TimetableEvent = {
  eventID: number
  eventName: string
  startTime: string
  endTime: string
  location: string
  day: string
  hasOverlap: boolean
  eventType: string
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
  isPrivate: boolean
}

/** Actions' types */

export enum SCHEDULING_ACTIONS {
  SET_IS_LOADING = 'SCHEDULING_ACTIONS.SET_IS_LOADING',
  GET_ALL_EVENTS = 'SCHEDULING_ACTIONS.GET_ALL_EVENTS',
  GET_USER_EVENTS = 'SCHEDULING_ACTIONS.GET_USER_EVENTS',
  EDIT_USER_EVENTS = 'SCHEDULING_ACTIONS.EDIT_USER_EVENTS',
  EDIT_USER_NUSMODS_EVENTS = 'SCHEDULING_ACTIONS.EDIT_USER_NUSMODS_EVENTS',
  GET_SEARCHED_EVENTS = 'SCHEDULING_ACTIONS.GET_SEARCHED_EVENTS',
  GET_SHARE_SEARCH_RESULTS = 'SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS',
  SET_EVENT_NAME = 'SCHEDULING_ACTIONS.SET_EVENT_NAME',
  SET_EVENT_LOCATION = 'SCHEDULING_ACTIONS.SET_EVENT_LOCATION',
  SET_EVENT_FROM_DATE = 'SCHEDULING_ACTIONS.SET_EVENT_FROM_DATE',
  SET_EVENT_TO_DATE = 'SCHEDULING_ACTIONS.SET_EVENT_TO_DATE',
  SET_TARGET_AUDIENCE = 'SCHEDULING_ACTIONS.SET_TARGET_AUDIENCE',
  SET_DESCRIPTION = 'SCHEDULING_ACTIONS.SET_DESCRIPTION',
  GET_HALL_EVENT_TYPES = 'SCHEDULING_ACTIONS.GET_HALL_EVENT_TYPES',
  SET_HALL_EVENT_TYPE = 'SCHEDULING_ACTIONS.SET_HALL_EVENT_TYPE',
  GET_TARGET_AUDIENCE_LIST = 'SCHEDULING_ACTIONS.GET_TARGET_AUDIENCE_LIST',
  HANDLE_NUSMODS_STATUS = 'SCHEDULING_ACTIONS.HANDLE_NUSMODS_STATUS',
}

/** Actions */

type getHallEventTypes = {
  type: typeof SCHEDULING_ACTIONS.GET_HALL_EVENT_TYPES
  hallEventTypes: string[]
}

type getTargetAudienceList = {
  type: typeof SCHEDULING_ACTIONS.GET_TARGET_AUDIENCE_LIST
  targetAudienceList: userCCA[]
}

type GetAllEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_ALL_EVENTS
  allEvents: SchedulingEvent[]
}

type GetUserEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_USER_EVENTS
  userEvents: TimetableEvent[][][]
  userEventsStartTime: number
  userEventsEndTime: number
  userEventsList: TimetableEvent[]
}

type EditUserEvents = {
  type: typeof SCHEDULING_ACTIONS.EDIT_USER_EVENTS
  newUserEvents: TimetableEvent[]
}

type EditUserNusMods = {
  type: typeof SCHEDULING_ACTIONS.EDIT_USER_NUSMODS_EVENTS
  userNusModsEvents: TimetableEvent[]
}

type GetSearchedEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_SEARCHED_EVENTS
  searchedEvents: SchedulingEvent[]
}

type GetShareSearchResults = {
  type: typeof SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS
  shareSearchResults: Friend[]
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

type SetTargetAudience = {
  type: typeof SCHEDULING_ACTIONS.SET_TARGET_AUDIENCE
  newTargetAudience: string
}

type SetDescription = {
  type: typeof SCHEDULING_ACTIONS.SET_DESCRIPTION
  newDescription: string
}

type SetHallEventType = {
  type: typeof SCHEDULING_ACTIONS.SET_HALL_EVENT_TYPE
  newHallEventType: string
}

type HandleNusModsStatus = {
  type: typeof SCHEDULING_ACTIONS.HANDLE_NUSMODS_STATUS
  isSuccessful: boolean
  isFailure: boolean
}

export type ActionTypes =
  | GetAllEvents
  | GetUserEvents
  | EditUserEvents
  | EditUserNusMods
  | SetEventName
  | SetEventLocation
  | SetEventFromDate
  | SetEventToDate
  | SetTargetAudience
  | SetDescription
  | GetShareSearchResults
  | GetSearchedEvents
  | SetIsLoading
  | getHallEventTypes
  | getTargetAudienceList
  | SetHallEventType
  | HandleNusModsStatus
