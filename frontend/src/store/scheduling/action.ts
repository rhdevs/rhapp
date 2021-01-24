import { isEmpty, last } from 'lodash'
import { dummyUserId, getHallEventTypesStub } from '../stubs'
import { Dispatch, GetState } from '../types'
import { ActionTypes, SchedulingEvent, SCHEDULING_ACTIONS, TimetableEvent } from './types'
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
  if (body) {
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
  } else {
    fetch(DOMAIN_URL.EVENT + endpoint, {
      method: method,
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
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

export const fetchAllUserEvents = (userId: string, withNusModsEvents: boolean) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  const manipulateData = async (data) => {
    const timetableFormatEvents: TimetableEvent[] = data.map((singleEvent) => {
      return convertSchedulingEventToTimetableEvent(singleEvent)
    })
    let allEvents: TimetableEvent[] = []
    if (withNusModsEvents) {
      const userNusModsEvents = await dispatch(getUserNusModsEvents(userId))
      allEvents = userNusModsEvents ? timetableFormatEvents.concat(userNusModsEvents) : timetableFormatEvents
    } else {
      allEvents = timetableFormatEvents
    }

    console.log(allEvents)
    dispatch({
      type: SCHEDULING_ACTIONS.GET_ALL_USER_EVENTS,
      userAllEventsList: allEvents,
    })
  }

  getFromBackend(ENDPOINTS.USER_EVENT + userId + '/all', manipulateData)
}

// ---------------------- TIMETABLE ----------------------
export const fetchCurrentUserEvents = (userId: string, stopIsLoading: boolean) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(setIsLoading(true))
  const manipulateData = async (data) => {
    const timetableFormatEvents: TimetableEvent[] = data.map((singleEvent) => {
      return convertSchedulingEventToTimetableEvent(singleEvent)
    })
    const userNusModsEvents = await dispatch(getUserNusModsEvents(userId))

    const allEvents: TimetableEvent[] = userNusModsEvents
      ? timetableFormatEvents.concat(userNusModsEvents)
      : timetableFormatEvents

    console.log(allEvents)
    dispatch({
      type: SCHEDULING_ACTIONS.GET_CURRENT_USER_EVENTS,
      userCurrentEvents: transformInformationToTimetableFormat(allEvents),
      userCurrentEventsStartTime: Number(getTimetableStartTime(allEvents)),
      userCurrentEventsEndTime: Number(getTimetableEndTime(allEvents)),
      userCurrentEventsList: allEvents,
    })
    if (stopIsLoading) dispatch(setIsLoading(false))
  }

  const currentUNIXDate = Math.round(Date.now() / 1000)

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
  const lasPositionOfWordSem = userNusModsLink.indexOf('sem-') + 'sem-'.length
  const currentSemester = Number(userNusModsLink.substring(lasPositionOfWordSem, lasPositionOfWordSem + 1))

  const requestBody = {
    userID: userId,
    url: userNusModsLink,
    academicYear: academicYear,
    currentSemester: currentSemester,
  }

  console.log(requestBody)
  const resp = await put(ENDPOINTS.ADD_MODS, DOMAINS.EVENT, requestBody)
    .then((resp) => {
      return resp
    })
    .catch(() => {
      dispatch(setNusModsStatus(false, true))
      console.log('CATCH FAILURE')
    })
  console.log(resp)

  if (resp.status >= 400) {
    dispatch(setNusModsStatus(false, true))
    console.log('FAILURE')
  } else {
    console.log('SUCCESS')
    dispatch(fetchCurrentUserEvents(userId, false))
    dispatch(setNusModsStatus(true, false))
  }
}

export const setNusModsStatus = (nusModsIsSuccessful: boolean, nusModsIsFailure: boolean) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: SCHEDULING_ACTIONS.HANDLE_NUSMODS_STATUS,
    nusModsIsSuccessful: nusModsIsSuccessful,
    nusModsIsFailure: nusModsIsFailure,
  })
}

const getUserNusModsEvents = (userId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const dispatchData = (data) => {
    dispatch({
      type: SCHEDULING_ACTIONS.GET_USER_NUSMODS_EVENTS,
      userNusModsEventsList: data,
    })
  }
  const resp = await getFromBackend(ENDPOINTS.NUSMODS + userId, dispatchData)
  console.log(resp)
  dispatch(setIsLoading(false))
  if (resp.length === 0) return null
  else return resp[0].mods
}

export const deleteUserNusModsEvents = (userId: string) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const updateDeleteStatus = (data) => {
    if (data.ok) {
      console.log('SUCCESSFULY DELETED')
      dispatch(setIsLoading(false))
      dispatch(fetchCurrentUserEvents(userId, false))
    } else {
      console.log('FAILURE!!!! ' + data.status)
    }
  }

  const { userNusModsEventsList } = getState().scheduling

  console.log(userNusModsEventsList)
  if (userNusModsEventsList.length) postToBackend(ENDPOINTS.DELETE_MODS + userId, 'DELETE', null, updateDeleteStatus)
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

export const editUserEvents = (action: string, event: SchedulingEvent, userId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  const requestBody = {
    userID: userId,
    eventID: event.eventID,
  }

  if (action === 'remove') {
    const updateEventStatus = (data) => {
      if (data.ok) {
        console.log('SUCCESSFULY REMOVED: eventId - ' + event.eventID + 'for userId: ' + userId)
        dispatch(setEventAttendanceStatus(true, false))
      } else {
        console.log('FAILURE!!!! ' + data.status)
      }
    }
    postToBackend(ENDPOINTS.RSVP_EVENT, 'DELETE', requestBody, updateEventStatus)
  } else if (action === 'add') {
    const updateEventStatus = (data) => {
      if (data.ok) {
        console.log('SUCCESSFULY ADDED: eventId - ' + event.eventID + 'for userId: ' + userId)
        dispatch(setEventAttendanceStatus(false, true))
      } else {
        console.log('FAILURE!!!! ' + data.status)
        dispatch(setEventAttendanceStatus(false, true))
      }
    }

    postToBackend(ENDPOINTS.RSVP_EVENT, 'POST', requestBody, updateEventStatus)
  }
}

export const setEventAttendanceStatus = (eventAttendanceIsSuccessful: boolean, eventAttendanceIsFailure: boolean) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: SCHEDULING_ACTIONS.HANDLE_EVENT_ATTENDANCE_STATUS,
    eventAttendanceIsSuccessful: eventAttendanceIsSuccessful,
    eventAttendanceIsFailure: eventAttendanceIsFailure,
  })
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

export const editHallEventType = (newHallEventType: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_HALL_EVENT_TYPE, newHallEventType: newHallEventType })
}

export const getTargetAudienceList = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  await fetch(DOMAIN_URL.EVENT + ENDPOINTS.USER_CCAS + '/' + dummyUserId, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => resp.json())
    .then((data) => {
      dispatch({
        type: SCHEDULING_ACTIONS.GET_TARGET_AUDIENCE_LIST,
        targetAudienceList: data,
      })
      console.log(data)
      dispatch(setIsLoading(false))
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

export const handleSubmitCreateEvent = () => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(setIsLoading(true))
  const {
    newEventName,
    newEventLocation,
    newEventFromDate,
    newEventToDate,
    newDescription,
    newTargetAudience,
  } = getState().scheduling
  const isPersonal = newTargetAudience === 'Personal'
  const newEvent = {
    eventName: newEventName,
    startDateTime: newEventFromDate.getTime() / 1000,
    endDateTime: newEventToDate.getTime() / 1000,
    description: newDescription,
    location: newEventLocation,
    userID: dummyUserId,
    image: null,
    ccaID: isPersonal ? null : parseInt(newTargetAudience),
    isPrivate: isPersonal,
  }
  fetch(DOMAIN_URL.EVENT + ENDPOINTS.ADD_EVENT, {
    mode: 'cors',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEvent),
  })
    .then((resp) => resp.json())
    .then((data) => {
      console.log(`added successfully: ${data}`)
      dispatch(setIsLoading(false))
    })
    .catch((err) => {
      console.log(err)
    })
}

export const setIsLoading = (desiredState?: boolean) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  const { isLoading } = getState().scheduling
  dispatch({ type: SCHEDULING_ACTIONS.SET_IS_LOADING, isLoading: desiredState ? desiredState : !isLoading })
}
