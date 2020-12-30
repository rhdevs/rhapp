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

export enum SCHEDULING_ACTIONS {
  GET_RH_EVENTS = 'SCHEDULING_ACTIONS.GET_RH_EVENTS',
}

type GetRhEvents = {
  type: typeof SCHEDULING_ACTIONS.GET_RH_EVENTS
  userRhEvents: RHEvent[][][]
  userEventsStartTime: number
  userEventsEndTime: number
}

export type ActionTypes = GetRhEvents
