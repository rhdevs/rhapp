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
  startDateTime: number
  endDateTime: number
  description: string
  location: string
  ccaID: number
  userID: string
  image: null | string

  weeks?: number[]
  startTime: string
  endTime: string
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
  GET_ALL_PUBLIC_EVENTS = 'SCHEDULING_ACTIONS.GET_ALL_PUBLIC_EVENTS',
  GET_CURRENT_USER_EVENTS = 'SCHEDULING_ACTIONS.GET_CURRENT_USER_EVENTS',
  GET_ALL_USER_EVENTS = 'SCHEDULING_ACTIONS.GET_ALL_USER_EVENTS',
  GET_USER_NUSMODS_EVENTS = 'SCHEDULING_ACTIONS.GET_USER_NUSMODS_EVENTS',
  EDIT_USER_NUSMODS_EVENTS = 'SCHEDULING_ACTIONS.EDIT_USER_NUSMODS_EVENTS',
  DELETE_USER_NUSMODS_EVENTS = 'SCHEDULING_ACTIONS.DELETE_USER_NUSMODS_EVENTS',
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
  HANDLE_EVENT_ATTENDANCE_STATUS = 'SCHEDULING_ACTIONS.HANDLE_EVENT_ATTENDANCE_STATUS',
  SET_SELECTED_EVENT = 'SCHEDULING_ACTIONS.SET_SELECTED_EVENT',
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

type GetAllPublicEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_ALL_PUBLIC_EVENTS
  allPublicEvents: SchedulingEvent[]
}

type GetCurrentUserEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_CURRENT_USER_EVENTS
  userCurrentEvents: TimetableEvent[][][]
  userCurrentEventsStartTime: number
  userCurrentEventsEndTime: number
  userCurrentEventsList: TimetableEvent[]
}

type GetAllUserEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_ALL_USER_EVENTS
  userAllEventsList: TimetableEvent[]
}

type GetUserNusModsEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_USER_NUSMODS_EVENTS
  userNusModsEventsList: TimetableEvent[]
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
  nusModsIsSuccessful: boolean
  nusModsIsFailure: boolean
}

type HandleEventAttendanceStatus = {
  type: typeof SCHEDULING_ACTIONS.HANDLE_EVENT_ATTENDANCE_STATUS
  eventAttendanceIsSuccessful: boolean
  eventAttendanceIsFailure: boolean
}

type SetSelectedEvent = {
  type: typeof SCHEDULING_ACTIONS.SET_SELECTED_EVENT
  selectedEvent: TimetableEvent | null
}
export type ActionTypes =
  | GetAllPublicEvents
  | GetAllUserEvents
  | GetUserNusModsEvents
  | GetCurrentUserEvents
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
  | HandleEventAttendanceStatus
  | SetSelectedEvent
