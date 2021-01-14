import axios from 'axios'
import { isEmpty, last } from 'lodash'
import { getHallEventTypesStub, targetAudienceListStub, userRhEventsDummy } from '../stubs'
import { Dispatch, GetState } from '../types'
import {
  ActionTypes,
  UserEvent,
  SchedulingEvent,
  SCHEDULING_ACTIONS,
  LESSON_TO_ABBREV,
  ABBREV_TO_LESSON,
} from './types'

export const fetchUserEvents = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const fetchedData = userEventsDummy
  const formattedEvents: UserEvent[] = transformScheduleTypeToRhEvent(fetchedData)

  dispatch({
    type: SCHEDULING_ACTIONS.GET_USER_EVENTS,
    userEvents: transformInformationToTimetableFormat(formattedEvents),
    userEventsStartTime: Number(getTimetableStartTime(formattedEvents)),
    userEventsEndTime: Number(getTimetableEndTime(formattedEvents)),
    userEventsList: formattedEvents,
  })
  dispatch(setIsLoading(false))
}

const transformScheduleTypeToRhEvent = (scheduleTypeData: SchedulingEvent[]) => {
  const formattedEvents: UserEvent[] = []
  scheduleTypeData.forEach((data) => {
    formattedEvents.push({
      eventID: data.eventID,
      eventName: data.eventName,
      location: data.location,
      day: getDayStringFromUNIX(data.startDateTime),
      date: getDate(data.startDateTime),
      endTime: getTimeStringFromUNIX(data.endDateTime),
      startTime: getTimeStringFromUNIX(data.startDateTime),
      hasOverlap: false,
    })
  })
  return formattedEvents
}

export const getHallEventTypes = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  dispatch({
    type: SCHEDULING_ACTIONS.GET_HALL_EVENT_TYPES,
    hallEventTypes: getHallEventTypesStub,
  })
}

const sortEvents = (events: RHEvent[]) => {
  return events.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })
}

const getDate = (unixDate: number) => {
  const date = new Date(unixDate * 1000).getDate()
  return String(date)
}

const getTimetableStartTime = (formattedEvents: UserEvent[]) => {
  const sortedEvents = sortEvents(formattedEvents)
  return sortedEvents[0]?.startTime
}

const getTimetableEndTime = (formattedEvents: UserEvent[]) => {
  const sortByEndTime = (events: UserEvent[]) => {
    return events.sort((a, b) => {
      return b.endTime.localeCompare(a.endTime)
    })
  }
  return sortByEndTime(formattedEvents)[0].endTime
}

/**
 * Returns a 2d array containing arrays of respective days filled with UserEvents
 * [
 *    [Monday events],
 *    [Tuesday events], ..
 * ]
 *
 * @param formattedEvents events in UserEvent format (transformed from data retrieved from backend)
 */
const splitEventsByDay = (formattedEvents: UserEvent[]) => {
  const dayArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const eventsArr: UserEvent[][] = []
  dayArr.map((day, index) => {
    eventsArr[index] = formattedEvents.filter((indivEvent) => {
      return indivEvent.day === day
    })
  })
  return eventsArr
}

const arrangeEventsForWeek = (eventsArr: UserEvent[][]) => {
  return eventsArr.map((dayArr) => {
    return arrangeEventsWithinDay(dayArr)
  })
}

/**
 * Converts formatted events retrieved from backend into a 3d array arranged by day and rows
 * where events do not overlap
 * [
 *    [
 *      [monEvent1, monEvent2, ..],
 *      [monEvent10, monEvent20, ..], ..
 *    ],
 *    [
 *      [tueEvent1, tueEvent2, ..], ..
 *    ], ..
 * ]
 *
 * @param formattedEvents events in UserEvent format (transformed from data retrieved from backend)
 */
const transformInformationToTimetableFormat = (formattedEvents: UserEvent[]) => {
  const eventsArr = splitEventsByDay(formattedEvents)
  const transformedEventsArr = arrangeEventsForWeek(eventsArr)
  return transformedEventsArr
}

/**
 * Converts a flat array of events for ONE day into rows of events within that day row
 * to ensure no events overlap within each row of events
 * [event1, event2, ..] to
 * [
 *    [event1, event2, ..],
 *    [event10, event20, ..], ..
 * ]
 *
 * @param events array of events for a specific day
 */
const arrangeEventsWithinDay = (events: UserEvent[]) => {
  const rows: UserEvent[][] = []
  if (isEmpty(events)) {
    return rows
  }

  const sortedEvents = sortEvents(events)

  sortedEvents.forEach((event: UserEvent) => {
    for (let i = 0; i < rows.length; i++) {
      const rowEvents: UserEvent[] = rows[i]
      const previousEvents = last(rowEvents)
      if (!previousEvents || !doEventsOverlap(previousEvents, event)) {
        rowEvents.push(event)
        return
      } else {
        previousEvents.hasOverlap = true
        event.hasOverlap = true
      }
    }
    rows.push([event])
  })
  return rows
}

// Determines if two events overlap
const doEventsOverlap = (event1: UserEvent, event2: UserEvent) => {
  return event1.day === event2.day && event1.startTime < event2.endTime && event2.startTime < event1.endTime
}

// Converts a unix string into date format and returns the day in string
const getDayStringFromUNIX = (unixDate: number) => {
  const dayInInt = new Date(unixDate * 1000).getDay()
  switch (dayInInt) {
    case 0:
      return 'Sunday'
    case 1:
      return 'Monday'
    case 2:
      return 'Tuesday'
    case 3:
      return 'Wednesday'
    case 4:
      return 'Thursday'
    case 5:
      return 'Friday'
    default:
      return 'Saturday'
  }
}

// Converts a unix string into date format and returns the time of string type in 24hour format
const getTimeStringFromUNIX = (unixDate: number) => {
  const date = new Date(unixDate * 1000)
  const hours = '0' + date.getHours()
  const minutes = '0' + date.getMinutes()

  const formattedTime = hours.substr(-2) + minutes.substr(-2)

  return formattedTime
}

export const getShareSearchResults = (query: string) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(query, dispatch)
  // Uncomment when endpoint for share search is obtained from backend
  // get(ENDPOINTS.SHARE_SEARCH).then((results) => {
  //   dispatch({
  //     type: SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS,
  //     shareSearchResults: results,
  //   })
  // })
  dispatch(setIsLoading(false))
}

export const setIsLoading = (desiredState?: boolean) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isLoading } = getState().scheduling
  dispatch({ type: SCHEDULING_ACTIONS.SET_IS_LOADING, isLoading: desiredState ? desiredState : !isLoading })
}

export const getSearchedEvents = (query: string) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(query, dispatch)
  // Uncomment when endpoint for share search is obtained from backend
  // get(ENDPOINTS.SEARCH_EVENTS).then((results) => {
  //   dispatch({
  //     type: SCHEDULING_ACTIONS.GET_SEARCHED_EVENTS,
  //     searchedEvents: results,
  //   })
  // })
  dispatch(setIsLoading(false))
}

export const editUserEvents = (action: string, selectedEventName: string) => (dispatch: Dispatch<ActionTypes>) => {
  const fetchedUserData = transformScheduleTypeToRhEvent(userEventsDummy)
  const fetchedEventsData = transformScheduleTypeToRhEvent(eventsDummy)
  let newUserEvents: UserEvent[] = []

  if (action === 'remove') {
    newUserEvents = fetchedUserData.filter((userEvent) => {
      return userEvent.eventName !== selectedEventName
    })
    console.log(newUserEvents)
  } else if (action === 'add') {
    newUserEvents = fetchedUserData.concat(
      fetchedEventsData.filter((event) => {
        return event.eventName === selectedEventName
      }),
    )
    console.log(newUserEvents)
  }
  dispatch({ type: SCHEDULING_ACTIONS.EDIT_USER_EVENTS, newUserEvents: newUserEvents })
}

export const setUserNusModsLink = (userNusModsLink: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_USER_NUSMODS_LINK, userNusModsLink: userNusModsLink })
}

export const getUserNusModsEvents = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const currentYear = new Date().getFullYear()
  const academicYear = String(currentYear - 1) + '-' + String(currentYear)
  const userNusModsLink = dummyNusModsLink

  const dataFromLink = extractDataFromLink(userNusModsLink)
  let retrivedEventInformation: UserEvent[] = []
  const temporaryData: UserEvent[][] = []

  dataFromLink.map(async (oneModuleData) => {
    temporaryData.push(await fetchDataFromNusMods(academicYear, oneModuleData))
    retrivedEventInformation = temporaryData.flat()
    dispatch({
      type: SCHEDULING_ACTIONS.GET_NUSMODS_EVENTS,
      userNusModsEvents: retrivedEventInformation,
    })
  })

  dispatch(setIsLoading(false))
}

/**
 * Returns a 2D array, containing module code and lesson information of each module
 *
 * @param link NUSMods share link
 */
const extractDataFromLink = (link: string) => {
  const timetableInformation = link.split('?')[1]
  const timetableData = timetableInformation.split('&')
  const data: string[][] = []
  let count = 0

  timetableData.forEach((moduleInformation) => {
    const moduleCode = moduleInformation.split('=')[0]
    data[count] = []
    data[count].push(moduleCode)
    moduleInformation = moduleInformation.split('=')[1]
    const moduleLessons = moduleInformation.split(',')
    moduleLessons.forEach((classes) => {
      data[count].push(classes)
    })
    count++
  })

  return data
}

/**
 * Fetches data from NUSMods API, reformats lesson information to RHEvents and pushes events into respective day arrays
 *
 * @param acadYear academicYear of the lesson information is retrieved from NUSMods API
 * @param moduleArray array of lessons selected by user (from link provided)
 * @param events array of information retrieved from NUSMods of selected events
 */
const fetchDataFromNusMods = async (acadYear: string, moduleArray: string[]) => {
  const moduleCode = moduleArray[0]
  const returnEventsArray = await axios
    .get(`https://api.nusmods.com/v2/${acadYear}/modules/${moduleCode}.json`)
    .then((res) => {
      const events: UserEvent[] = []
      const moduleData = res.data.semesterData[0].timetable
      moduleArray = moduleArray.splice(1)
      for (let i = 0; i < moduleArray.length; i++) {
        const lessonType = moduleArray[i].split(':')[0]
        const classNo = moduleArray[i].split(':')[1]
        const correspondingClassInformationArray = moduleData.filter(
          (moduleClass: { classNo: string; lessonType: string }) => {
            return moduleClass.classNo === classNo && moduleClass.lessonType === ABBREV_TO_LESSON[lessonType]
          },
        )
        correspondingClassInformationArray.map((classInformation) => {
          const newEvent: UserEvent = {
            eventName: moduleCode + ' ' + LESSON_TO_ABBREV[classInformation.lessonType],
            location: classInformation.venue,
            day: classInformation.day,
            date: null,
            endTime: classInformation.endTime,
            startTime: classInformation.startTime,
            hasOverlap: false,
            eventType: 'private',
            eventID: 1,
          }
          events.push(newEvent)
        })
      }
      return events
    })

  return returnEventsArray
}

export const editEventName = (newEventName: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_EVENT_NAME, newEventName: newEventName })
}

export const editEventLocation = (newEventLocation: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_EVENT_LOCATION, newEventLocation: newEventLocation })
}

export const editEventFromDate = (newEventFromDate: Date) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_EVENT_FROM_DATE, newEventFromDate: newEventFromDate })
}

export const editEventToDate = (newEventToDate: Date) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_EVENT_TO_DATE, newEventToDate: newEventToDate })
}

export const editDescription = (newDescription: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_DESCRIPTION, newDescription: newDescription })
}

export const handleSubmitCreateEvent = () => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { newDescription } = getState().scheduling
  console.log(newDescription)
}

export const editHallEventType = (newHallEventType: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_HALL_EVENT_TYPE, newHallEventType: newHallEventType })
}

export const getTargetAudienceList = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(SetIsLoading(true))
  dispatch({
    type: SCHEDULING_ACTIONS.GET_TARGET_AUDIENCE_LIST,
    targetAudienceList: targetAudienceListStub,
  })
}

export const editTargetAudience = (newTargetAudience: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_TARGET_AUDIENCE, newTargetAudience: newTargetAudience })
}
