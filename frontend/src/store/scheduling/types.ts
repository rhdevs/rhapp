import { invert } from 'lodash'
import { userCCA } from '../facilityBooking/types'
import { Friend } from '../social/types'

type dayNumber = { [dayString: string]: number }
export const DAY_STRING_TO_NUMBER: dayNumber = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}
// Reverse lookup map of DAY_STRING_TO_NUMBER
export const DAY_NUMBER_TO_STRING: { [dayNumber: number]: string } = invert(DAY_STRING_TO_NUMBER)

/** Types */

export type TimetableEvent = {
  eventID: string
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
  CCADetails?: CCADetails
}

export type SchedulingEvent = {
  eventID: string
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

export type CCADetails = {
  category: string
  ccaID: number
  ccaName: string
}

export type Profile = {
  bio: string
  block: string
  displayName: string
  profilePictureURI: string
  telegramHandle: string
  userID: string
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
  GET_CCA_DETAILS = 'SCHEDULING_ACTIONS.GET_CCA_DETAILS',
  GET_ALL_CCA = 'SCHEDULING_ACTIONS.GET_ALL_CCA',
  GET_ALL_PROFILES = 'SCHEDULING_ACTIONS.GET_ALL_PROFILES',
  SET_SELECTED_PROFILE_IDS = 'SCHEDULING_ACTIONS.SET_SELECTED_PROFILE_IDS',
  GET_SELECTED_PROFILE_EVENTS = 'SCHEDULING_ACTIONS.GET_SELECTED_PROFILE_EVENTS',
  SET_SELECTED_CCA_IDS = 'SCHEDULING_ACTIONS.SET_SELECTED_CCA_IDS',
  GET_SELECTED_CCA_EVENTS = 'SCHEDULING_ACTIONS.GET_SELECTED_CCA_EVENTS',
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

type GetCCADetails = {
  type: typeof SCHEDULING_ACTIONS.GET_CCA_DETAILS
  ccaDetails: CCADetails
}

type GetAllCCA = {
  type: typeof SCHEDULING_ACTIONS.GET_ALL_CCA
  ccaList: CCADetails[]
}

type GetAllProfiles = {
  type: typeof SCHEDULING_ACTIONS.GET_ALL_PROFILES
  profileList: Profile[]
}

type SetSelectedProfileIds = {
  type: typeof SCHEDULING_ACTIONS.SET_SELECTED_PROFILE_IDS
  selectedProfileIds: string[]
}

type GetSelectedProfileEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_SELECTED_PROFILE_EVENTS
  selectedProfileEvents: SchedulingEvent[]
}

type SetSelectedCCAIds = {
  type: typeof SCHEDULING_ACTIONS.SET_SELECTED_CCA_IDS
  selectedCCAIds: number[]
}

type GetSelectedCCAEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_SELECTED_CCA_EVENTS
  selectedCCAEvents: SchedulingEvent[]
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
  | GetCCADetails
  | GetAllCCA
  | GetAllProfiles
  | SetSelectedProfileIds
  | GetSelectedProfileEvents
  | SetSelectedCCAIds
  | GetSelectedCCAEvents
