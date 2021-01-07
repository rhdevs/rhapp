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
  startDateTime: Date
  endDateTime: Date
  description: string
  location: string
  ccaID: number
  userID: string
  image: string
}

export enum SCHEDULING_ACTIONS {
  GET_RH_EVENTS = 'SCHEDULING_ACTIONS.GET_RH_EVENTS',
  SET_EVENT_NAME = 'SCHEDULING_ACTIONS.SET_EVENT_NAME',
  SET_EVENT_LOCATION = 'SCHEDULING_ACTIONS.SET_EVENT_LOCATION',
  SET_EVENT_FROM_DATE = 'SCHEDULING_ACTIONS.SET_EVENT_FROM_DATE',
  SET_CCA = 'SCHEDULING_ACTIONS.SET_CCA',
  SET_DESCRIPTION = 'SCHEDULING_ACTIONS.SET_DESCRIPTION',
}

type GetRhEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_RH_EVENTS
  userRhEvents: RHEvent[][][]
  userEventsStartTime: number
  userEventsEndTime: number
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

export type ActionTypes = GetRhEvents | SetEventName | SetEventLocation | SetEventFromDate | SetCca | SetDescription
