import axios from 'axios'
import { isEmpty, last } from 'lodash'
import { getHallEventTypesStub, targetAudienceListStub } from '../stubs'
import { Dispatch, GetState } from '../types'
import {
  ActionTypes,
  SchedulingEvent,
  SCHEDULING_ACTIONS,
  LESSON_TO_ABBREV,
  ABBREV_TO_LESSON,
  TimetableEvent,
} from './types'
import { ENDPOINTS, DOMAIN_URL, DOMAINS, put } from '../endpoints'

// ---------------------- GET ----------------------
const getFromBackend = async (endpoint, methods) => {
  const resp = await fetch(DOMAIN_URL.EVENT + endpoint, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => {
      return resp.json()
    })
    .then(async (data) => {
      if (methods) await methods(data)
      return data
    })
  return resp
}
// ---------------------- GET ----------------------

// ---------------------- POST/DELETE ----------------------
const postToBackend = (endpoint, method, body, functions) => {
  fetch(DOMAIN_URL.EVENT + endpoint, {
    method: method,
    mode: 'cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
    .then((resp) => resp)
    .then((data) => {
      // if (data.ok) {
      //   console.log('success')
      // }
      // console.log(data)
      functions(data)
    })
}
// ---------------------- POST/DELETE ----------------------

export const fetchAllPublicEvents = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const sortDataByDate = (a: SchedulingEvent, b: SchedulingEvent) => {
    return a.startDateTime - b.startDateTime
  }

  const dispatchData = (data) => {
    console.log(data.sort(sortDataByDate))
    dispatch({
      type: SCHEDULING_ACTIONS.GET_ALL_PUBLIC_EVENTS,
      allPublicEvents: data.sort(sortDataByDate),
    })
    dispatch(setIsLoading(false))
  }

  getFromBackend(ENDPOINTS.ALL_PUBLIC_EVENTS, dispatchData)
}

// ---------------------- TIMETABLE ----------------------
export const fetchUserEvents = (userId: string, isSearchEventsPage: boolean) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(setIsLoading(true))
  const userNusModsEvents = await dispatch(getUserNusModsEvents(userId))

  const manipulateData = (data) => {
    const timetableFormatEvents: TimetableEvent[] = data.map((singleEvent) => {
      return convertSchedulingEventToTimetableEvent(singleEvent)
    })

    const allEvents: TimetableEvent[] = userNusModsEvents
      ? timetableFormatEvents.concat(userNusModsEvents)
      : timetableFormatEvents

    console.log(allEvents)
    dispatch({
      type: SCHEDULING_ACTIONS.GET_USER_EVENTS,
      userEvents: transformInformationToTimetableFormat(allEvents),
      userEventsStartTime: Number(getTimetableStartTime(allEvents)),
      userEventsEndTime: Number(getTimetableEndTime(allEvents)),
      userEventsList: allEvents,
    })
    if (isSearchEventsPage) dispatch(setIsLoading(false))
  }

  const currentUNIXDate = Date.now()

  getFromBackend(ENDPOINTS.USER_EVENT + userId + '/' + currentUNIXDate, manipulateData)
  dispatch(setIsLoading(false))
}

const convertSchedulingEventToTimetableEvent = (singleEvent: SchedulingEvent) => {
  const startTime = getTimeStringFromUNIX(singleEvent.startDateTime)
  let endTime = getTimeStringFromUNIX(singleEvent.endDateTime)
  if (startTime > endTime) {
    endTime = '2400'
    console.log(singleEvent)
  }
  if (endTime > '2400') {
    endTime = '2400'
    console.log(singleEvent)
  }
  return {
    eventID: singleEvent.eventID,
    eventName: singleEvent.eventName,
    startTime: startTime,
    endTime: endTime,
    location: singleEvent.location,
    day: getDayStringFromUNIX(singleEvent.startDateTime),
    hasOverlap: false,
    eventType: singleEvent.isPrivate ? 'private' : 'public', //change!
  }
}

/**
 * Returns the events in the current week
 *
 * @param events array of events of type TimetableEvents
 */
// const filterCurrentWeekEvents = (events : TimetableEvent) => {
//   const currentYear = new Date().getFullYear()

// }

const sortEvents = (events: TimetableEvent[]) => {
  return events.sort((a, b) => {
    return a.startTime.localeCompare(b.startTime)
  })
}

const getTimetableStartTime = (formattedEvents: TimetableEvent[]) => {
  const sortedEvents = sortEvents(formattedEvents)
  return sortedEvents[0].startTime
}

const getTimetableEndTime = (formattedEvents: TimetableEvent[]) => {
  const sortByEndTime = (events: TimetableEvent[]) => {
    return events.sort((a, b) => {
      return b.endTime.localeCompare(a.endTime)
    })
  }
  return sortByEndTime(formattedEvents)[0].endTime
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
 * @param formattedEvents events in TimetableEvent format (transformed from data retrieved from backend)
 */
const transformInformationToTimetableFormat = (formattedEvents: TimetableEvent[]) => {
  const eventsArr = splitEventsByDay(formattedEvents)
  const transformedEventsArr = arrangeEventsForWeek(eventsArr)
  return transformedEventsArr
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
const splitEventsByDay = (formattedEvents: TimetableEvent[]) => {
  const dayArr = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  const eventsArr: TimetableEvent[][] = []
  dayArr.map((day, index) => {
    eventsArr[index] = formattedEvents.filter((indivEvent) => {
      return indivEvent.day === day
    })
  })
  return eventsArr
}

const arrangeEventsForWeek = (eventsArr: TimetableEvent[][]) => {
  return eventsArr.map((dayArr) => {
    return arrangeEventsWithinDay(dayArr)
  })
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
const arrangeEventsWithinDay = (events: TimetableEvent[]) => {
  const rows: TimetableEvent[][] = []
  if (isEmpty(events)) {
    return rows
  }

  const sortedEvents = sortEvents(events)

  sortedEvents.forEach((event: TimetableEvent) => {
    for (let i = 0; i < rows.length; i++) {
      const rowEvents: TimetableEvent[] = rows[i]
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
const doEventsOverlap = (event1: TimetableEvent, event2: TimetableEvent) => {
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
// ---------------------- TIMETABLE ----------------------

// ---------------------- NUSMODS ----------------------
export const setUserNusMods = (userId: string, userNusModsLink: string) => async (dispatch: Dispatch<ActionTypes>) => {
  const currentYear = new Date().getFullYear()
  const academicYear = String(currentYear - 1) + '-' + String(currentYear)

  const dataFromLink = extractDataFromLink(userNusModsLink)
  let retrivedEventInformation: TimetableEvent[] = []
  const temporaryData: TimetableEvent[][] = []
  let userNusMods: TimetableEvent[] = []

  dataFromLink.map(async (oneModuleData) => {
    temporaryData.push(await fetchDataFromNusMods(academicYear, oneModuleData))
    retrivedEventInformation = temporaryData.flat()
    if (oneModuleData === last(dataFromLink)) {
      userNusMods = retrivedEventInformation

      const requestBody = {
        userID: userId,
        mods: userNusMods,
      }

      const resp = await put(ENDPOINTS.ADD_MODS, DOMAINS.EVENT, requestBody)
        .then((resp) => {
          return resp
        })
        .catch(() => {
          dispatch(setNusModsStatus(false, true))
          console.log('CATCH FAILURE')
        })

      if (resp.status >= 400) {
        dispatch(setNusModsStatus(false, true))
        console.log('FAILURE')
      } else {
        console.log('SUCCESS')
        dispatch(fetchUserEvents(userId, false))
        dispatch(setNusModsStatus(true, false))
      }
    }
  })
}

const setNusModsStatus = (isSuccessful: boolean, isFailure: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SCHEDULING_ACTIONS.HANDLE_NUSMODS_STATUS,
    isSuccessful: isSuccessful,
    isFailure: isFailure,
  })
}

export const getUserNusModsEvents = (userId: string) => async () => {
  const resp = await getFromBackend(ENDPOINTS.NUSMODS + userId, null)
  console.log(resp)
  return resp[0].mods
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
      const events: TimetableEvent[] = []
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
          const newEvent: TimetableEvent = {
            eventName: moduleCode + ' ' + LESSON_TO_ABBREV[classInformation.lessonType],
            location: classInformation.venue,
            day: classInformation.day,
            endTime: classInformation.endTime,
            startTime: classInformation.startTime,
            hasOverlap: false,
            eventID: 1, //change!
            eventType: 'mods', //change!
          }
          events.push(newEvent)
        })
      }
      return events
    })

  return returnEventsArray
}
// ---------------------- NUSMODS ----------------------

// ---------------------- SHARE SEARCH ----------------------
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
// ---------------------- SHARE SEARCH ----------------------

// ---------------------- SEARCH EVENTS ----------------------
export const getSearchedEvents = (query: string) => async (dispatch: Dispatch<ActionTypes>) => {
  console.log(query, dispatch)
  dispatch(setIsLoading(true))
  const dispatchData = (data) => {
    dispatch({
      type: SCHEDULING_ACTIONS.GET_SEARCHED_EVENTS,
      searchedEvents: data.filter((event) => {
        return event.eventName.toLowerCase().includes(query)
      }),
    })
    dispatch(setIsLoading(false))
  }
  getFromBackend(ENDPOINTS.ALL_EVENTS, dispatchData)
}

export const editUserEvents = (action: string, event: SchedulingEvent) => (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = {
    userID: event.userID,
    eventID: event.eventID,
  }

  if (action === 'remove') {
    const updateEventStatus = (data) => {
      if (data.ok) {
        console.log('SUCCESSFULY REMOVED: eventId - ' + event.eventID + 'for userId: ' + event.userID)
      } else {
        console.log('FAILURE!!!! ' + data.status)
      }
    }
    postToBackend(ENDPOINTS.RSVP_EVENT, 'DELETE', requestBody, updateEventStatus)
  } else if (action === 'add') {
    const updateEventStatus = (data) => {
      if (data.ok) {
        console.log('SUCCESSFULY ADDED: eventId - ' + event.eventID + 'for userId: ' + event.userID)
      } else {
        console.log('FAILURE!!!! ' + data.status)
      }
    }

    postToBackend(ENDPOINTS.RSVP_EVENT, 'POST', requestBody, updateEventStatus)
  }
  // dispatch({ type: SCHEDULING_ACTIONS.EDIT_USER_EVENTS, newUserEvents: newUserEvents })
}
// ---------------------- SEARCH EVENTS ----------------------

// ---------------------- CREATE EVENTS ----------------------
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
  dispatch(setIsLoading(true))
  dispatch({
    type: SCHEDULING_ACTIONS.GET_TARGET_AUDIENCE_LIST,
    targetAudienceList: targetAudienceListStub,
  })
}

export const editTargetAudience = (newTargetAudience: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_TARGET_AUDIENCE, newTargetAudience: newTargetAudience })
}
// ---------------------- CREATE EVENTS ----------------------

export const getHallEventTypes = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  dispatch({
    type: SCHEDULING_ACTIONS.GET_HALL_EVENT_TYPES,
    hallEventTypes: getHallEventTypesStub,
  })
}

export const setIsLoading = (desiredState?: boolean) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isLoading } = getState().scheduling
  dispatch({ type: SCHEDULING_ACTIONS.SET_IS_LOADING, isLoading: desiredState ? desiredState : !isLoading })
}
