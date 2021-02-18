import { isEmpty, last } from 'lodash'
import { getHallEventTypesStub } from '../stubs'
import { Dispatch, GetState } from '../types'
import { ENDPOINTS, DOMAIN_URL, DOMAINS, put, get, post } from '../endpoints'
import {
  ActionTypes,
  CCADetails,
  DAY_NUMBER_TO_STRING,
  SchedulingEvent,
  SCHEDULING_ACTIONS,
  TimetableEvent,
} from './types'

// ---------------------- GET ----------------------
const getFromBackend = async (endpoint: string, methods) => {
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
    .catch((err) => {
      console.log('something went wronggggg')
      console.log(err)
      return null
    })
  return resp
}
// ---------------------- GET ----------------------

// ---------------------- POST/DELETE ----------------------
const postToBackend = (endpoint: string, method: string, body, functions) => {
  if (body) {
    fetch(DOMAIN_URL.EVENT + endpoint, {
      method: method,
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
      .then((resp) => resp)
      .then((data) => {
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
    dispatch({
      type: SCHEDULING_ACTIONS.GET_ALL_PUBLIC_EVENTS,
      allPublicEvents: data.sort(sortDataByDate),
    })
    dispatch(setIsLoading(false))
  }

  getFromBackend(ENDPOINTS.ALL_PUBLIC_EVENTS, dispatchData)
}

export const fetchAllUserEvents = (userId: string | null, withNusModsEvents: boolean) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (userId !== null) {
    const manipulateData = async (data: SchedulingEvent[]) => {
      const timetableFormatEvents: TimetableEvent[] = data.map((singleEvent) => {
        return convertSchedulingEventToTimetableEvent(singleEvent, false, false)
      })
      let allEvents: TimetableEvent[] = []
      if (withNusModsEvents) {
        const userNusModsEvents = await dispatch(getUserNusModsEvents(userId, false))
        allEvents = userNusModsEvents ? timetableFormatEvents.concat(userNusModsEvents) : timetableFormatEvents
      } else {
        allEvents = timetableFormatEvents
      }

      dispatch({
        type: SCHEDULING_ACTIONS.GET_ALL_USER_EVENTS,
        userAllEventsList: allEvents,
      })
    }

    getFromBackend(ENDPOINTS.USER_EVENT + `/${userId}/all`, manipulateData)
  }
}

// ---------------------- TIMETABLE ----------------------
export const fetchCurrentUserEvents = (userId: string | null, isUserEventsOnly: boolean) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  if (userId !== null) {
    dispatch(setIsLoading(true))
    const manipulateData = async (data: SchedulingEvent[]) => {
      const { selectedProfileEvents, selectedCCAEvents, selectedProfileNusModsEvents } = getState().scheduling
      const allFriendEvents: SchedulingEvent[] = selectedProfileEvents
      const allCCAEvents: SchedulingEvent[] = selectedCCAEvents

      let timetableFormatEvents: TimetableEvent[] = data.map((singleEvent: SchedulingEvent) => {
        return convertSchedulingEventToTimetableEvent(singleEvent, false, false)
      })

      // Add selected friends' & CCA events to current user's list of events
      if (!isUserEventsOnly) {
        const formattedFriendsEvents = allFriendEvents.map((friendEvent: SchedulingEvent) => {
          return convertSchedulingEventToTimetableEvent(friendEvent, true, false)
        })
        timetableFormatEvents = timetableFormatEvents.concat(formattedFriendsEvents)

        const formattedCCAEvents = allCCAEvents.map((CCAEvent: SchedulingEvent) => {
          return convertSchedulingEventToTimetableEvent(CCAEvent, false, true)
        })
        timetableFormatEvents = timetableFormatEvents.concat(formattedCCAEvents)
      }

      const userNusModsEvents: TimetableEvent[] = await dispatch(getUserNusModsEvents(userId, false))
      const friendsNusModsEvents: TimetableEvent[] = selectedProfileNusModsEvents
      const allNusModsEvents: TimetableEvent[] = isUserEventsOnly
        ? userNusModsEvents
        : userNusModsEvents.concat(friendsNusModsEvents)

      const allEvents: TimetableEvent[] = allNusModsEvents
        ? timetableFormatEvents.concat(allNusModsEvents)
        : timetableFormatEvents

      const startTime = allNusModsEvents
        ? Math.min(
            Number(getNusModsEventsStartTime(allNusModsEvents)),
            Number(getTimetableStartTime(timetableFormatEvents)),
          )
        : Number(getTimetableStartTime(timetableFormatEvents))

      const endTime = allNusModsEvents
        ? Math.max(
            Number(getNusModsEventsEndTime(allNusModsEvents)),
            Number(getTimetableEndTime(timetableFormatEvents)),
          )
        : Number(getTimetableEndTime(timetableFormatEvents))

      console.log(transformInformationToTimetableFormat(allEvents))
      dispatch({
        type: SCHEDULING_ACTIONS.GET_CURRENT_USER_EVENTS,
        userCurrentEvents: transformInformationToTimetableFormat(allEvents),
        userCurrentEventsStartTime: startTime,
        userCurrentEventsEndTime: endTime,
        userCurrentEventsList: allEvents,
      })
      dispatch(setIsLoading(false))
    }

    const currentUNIXDate = Math.round(Date.now() / 1000)

    getFromBackend(ENDPOINTS.USER_EVENT + `/${userId}/` + currentUNIXDate, manipulateData)
    dispatch(setIsLoading(false))
  }
}

const getNusModsEventsStartTime = (allNusModsEvents: TimetableEvent[]) => {
  let startTime = allNusModsEvents[0].startTime
  allNusModsEvents.map((event) => {
    if (Number(event.startTime) < Number(startTime)) {
      startTime = event.startTime
    } else return
  })
  return startTime
}

const getNusModsEventsEndTime = (allNusModsEvents: TimetableEvent[]) => {
  let endTime = allNusModsEvents[0].endTime
  allNusModsEvents.map((event) => {
    if (Number(event.endTime) > Number(endTime)) {
      endTime = event.endTime
    } else return
  })
  return endTime
}

const convertSchedulingEventToTimetableEvent = (
  singleEvent: SchedulingEvent,
  isFriendType: boolean,
  isCCAEvent: boolean,
) => {
  const startTime = getTimeStringFromUNIX(singleEvent.startDateTime)
  let endTime = getTimeStringFromUNIX(singleEvent.endDateTime)
  if (startTime > endTime || endTime > '2400') {
    endTime = '2400'
  }
  return {
    eventID: singleEvent.eventID,
    eventName: singleEvent.eventName,
    startDateTime: singleEvent.startDateTime,
    endDateTime: singleEvent.endDateTime,
    description: singleEvent.description,
    location: singleEvent.location,
    ccaID: singleEvent.ccaID,
    userID: singleEvent.userID,
    image: singleEvent.image,

    startTime: startTime,
    endTime: endTime,
    day: getDayStringFromUNIX(singleEvent.startDateTime),
    hasOverlap: false,
    eventType: isFriendType ? 'friends' : isCCAEvent ? 'CCA' : singleEvent.isPrivate ? 'private' : 'public', //change!
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
export const getDayStringFromUNIX = (unixDate: number) => {
  const dayInInt = new Date(unixDate * 1000).getDay()
  return DAY_NUMBER_TO_STRING[dayInInt]
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
export const setUserNusMods = (userId: string | null, userNusModsLink: string) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (userId !== null) {
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

    const resp = await put(ENDPOINTS.ADD_MODS, DOMAINS.EVENT, requestBody)
      .then((resp) => {
        return resp
      })
      .catch((err) => {
        dispatch(setNusModsStatus(false, true))
        console.log(err)
      })

    if (resp.status >= 400) {
      dispatch(setNusModsStatus(false, true))
    } else {
      dispatch(fetchCurrentUserEvents(userId, false))
      dispatch(setNusModsStatus(true, false))
    }
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

const getUserNusModsEvents = (userId: string | null, isFriends: boolean) => async (dispatch: Dispatch<ActionTypes>) => {
  if (userId !== null) {
    dispatch(setIsLoading(true))
    const dispatchData = (data) => {
      dispatch({
        type: SCHEDULING_ACTIONS.GET_USER_NUSMODS_EVENTS,
        userNusModsEventsList: data,
      })
    }
    const resp = await getFromBackend(ENDPOINTS.NUSMODS + `/${userId}`, isFriends ? null : dispatchData)
    dispatch(setIsLoading(false))
    if (resp.length === 0) return null
    else return resp[0].mods
  }
}

export const deleteUserNusModsEvents = (userId: string | null) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  if (userId !== null) {
    const updateDeleteStatus = (data) => {
      if (data.ok) {
        dispatch(fetchCurrentUserEvents(userId, false))
      } else {
        console.log('FAILURE!!!! ' + data.status)
      }
      dispatch(setIsLoading(false))
    }

    const { userNusModsEventsList } = getState().scheduling

    if (userNusModsEventsList.length)
      postToBackend(ENDPOINTS.DELETE_MODS + `/${userId}`, 'DELETE', null, updateDeleteStatus)
    dispatch(setIsLoading(false))
  }
}
// ---------------------- NUSMODS ----------------------

// ---------------------- SHARE SEARCH ----------------------
export const getShareSearchResults = () => (dispatch: Dispatch<ActionTypes>) => {
  // const { user } = getState().profile
  // const { userID } = user
  const userId = 'A1234567B' // TODO: Revert to previous line after integration of userID
  // Uncomment when endpoint for share search is obtained from backend
  get(ENDPOINTS.ALL_FRIENDS, DOMAINS.SOCIAL, `/${userId}`).then((results) => {
    dispatch({
      type: SCHEDULING_ACTIONS.GET_SHARE_SEARCH_RESULTS,
      shareSearchResults: results,
    })
  })
  dispatch(setIsLoading(false))
}

export const giveTimetablePermission = async (recipientUserId: string) => {
  const userId = 'A1234567B' // TODO: Revert to previous line after integration of userID
  const requestBody = {
    donor: userId,
    recipient: recipientUserId,
  }

  try {
    await post(ENDPOINTS.USER_PERMISSION, DOMAINS.EVENT, requestBody)
  } catch (err) {
    return Promise.reject()
  }
}
// ---------------------- SHARE SEARCH ----------------------

// ---------------------- SEARCH EVENTS ----------------------
export const getSearchedEvents = (query: string) => async (dispatch: Dispatch<ActionTypes>) => {
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

export const editUserEvents = (action: string, eventID: string, userId: string | null, isNUSModsEvent: boolean) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (userId !== null) {
    const requestBody = {
      userID: userId,
      eventID: eventID,
    }

    if (action === 'remove') {
      const updateEventStatus = (data) => {
        if (data.ok) {
          dispatch(fetchCurrentUserEvents(userId, false))
          dispatch(fetchAllUserEvents(userId, true))
          dispatch(setEventAttendanceStatus(true, false))
        } else {
          dispatch(setEventAttendanceStatus(false, true))
          console.log('FAILURE!!!! ' + data.status)
        }
      }
      if (isNUSModsEvent) {
        postToBackend(ENDPOINTS.DELETE_NUSMODS_EVENT, 'PUT', requestBody, updateEventStatus)
      } else postToBackend(ENDPOINTS.RSVP_EVENT, 'DELETE', requestBody, updateEventStatus)
    } else if (action === 'add') {
      const updateEventStatus = (data) => {
        if (data.ok) {
          dispatch(fetchCurrentUserEvents(userId, false))
          dispatch(fetchAllUserEvents(userId, true))
          dispatch(setEventAttendanceStatus(true, false))
        } else {
          console.log('FAILURE!!!! ' + data.status)
          dispatch(setEventAttendanceStatus(false, true))
        }
      }

      postToBackend(ENDPOINTS.RSVP_EVENT, 'POST', requestBody, updateEventStatus)
    }
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

  await fetch(DOMAIN_URL.EVENT + ENDPOINTS.USER_CCAS + `/${localStorage.getItem('userID')}`, {
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
    startDateTime: Math.round(newEventFromDate.getTime() / 1000),
    endDateTime: Math.round(newEventToDate.getTime() / 1000),
    description: newDescription,
    location: newEventLocation,
    userID: localStorage.getItem('userID'),
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
// ---------------------- CREATE EVENTS ----------------------

// ---------------------- VIEW EVENTS ----------------------
export const setSelectedEvent = (selectedEvent: TimetableEvent | null, eventID: string | null) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  let event
  if (selectedEvent) event = selectedEvent
  else if (eventID) {
    const eventFromBackend = await getFromBackend(ENDPOINTS.GET_EVENT_BY_EVENTID + `/${eventID}`, null)
    if (eventFromBackend.err) {
      const userNusModsEvents = await dispatch(getUserNusModsEvents(localStorage.getItem('userID'), false))
      event = userNusModsEvents.find((indivEvent) => {
        return indivEvent.eventID === eventID
      })
    } else {
      const ccaDetails = dispatch(getCCADetails(eventFromBackend.ccaID))
      event = {
        eventID: eventFromBackend.eventID,
        eventName: eventFromBackend.eventName,
        startDateTime: eventFromBackend.startDateTime,
        endDateTime: eventFromBackend.endDateTime,
        description: eventFromBackend.description,
        location: eventFromBackend.location,
        ccaID: eventFromBackend.ccaID,
        userID: eventFromBackend.userID,
        image: eventFromBackend.image,

        startTime: eventFromBackend.startTime,
        endTime: eventFromBackend.endTime,
        day: eventFromBackend.day,
        eventType: eventFromBackend.isPrivate ? 'private' : 'public',
        CCADetails: ccaDetails,
      }
    }
  }
  dispatch({
    type: SCHEDULING_ACTIONS.SET_SELECTED_EVENT,
    selectedEvent: event,
  })
}
// ---------------------- VIEW EVENTS ----------------------

// ---------------------- CCA/FRIENDS(USERS) ----------------------
export const fetchAllCCAs = () => (dispatch: Dispatch<ActionTypes>) => {
  get(ENDPOINTS.ALL_CCAS, DOMAINS.EVENT).then(async (resp) => {
    const sortedCCAs = resp.sort((a, b) => {
      return a.ccaName.localeCompare(b.ccaName)
    })
    dispatch({ type: SCHEDULING_ACTIONS.GET_ALL_CCA, ccaList: sortedCCAs })
  })

  dispatch(setIsLoading(false))
}

export const getCCADetails = (ccaID: number) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const dispatchData = (data: CCADetails[]) => {
    dispatch({
      type: SCHEDULING_ACTIONS.GET_CCA_DETAILS,
      ccaDetails: data[0],
    })
  }
  const ccaDetails = await getFromBackend(ENDPOINTS.CCA_DETAILS + `/${ccaID}`, dispatchData)
  dispatch(setIsLoading(false))
  return ccaDetails[0]
}

export const setSelectedCCAIds = (selectedCCAIds: number[]) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { selectedProfileIds } = getState().scheduling

  dispatch(fetchCCAEvents(selectedCCAIds))
  dispatch(
    fetchCurrentUserEvents(
      localStorage.getItem('userID'),
      selectedProfileIds.length === 0 && selectedCCAIds.length === 0,
    ),
  )
  dispatch({ type: SCHEDULING_ACTIONS.SET_SELECTED_CCA_IDS, selectedCCAIds: selectedCCAIds })
}

const fetchCCAEvents = (ccaIds: number[]) => (dispatch: Dispatch<ActionTypes>) => {
  let allSelectedCCAEvents: SchedulingEvent[] = []
  let counter = 0

  if (ccaIds.length === 0) {
    dispatch({
      type: SCHEDULING_ACTIONS.GET_SELECTED_CCA_EVENTS,
      selectedCCAEvents: allSelectedCCAEvents,
    })
  } else
    ccaIds.map((ccaId) => {
      counter++
      const currentUNIXDate = Math.round(Date.now() / 1000)
      get(ENDPOINTS.GET_EVENT_BY_CCAID, DOMAINS.EVENT, `/${ccaId}/` + currentUNIXDate).then(async (resp) => {
        allSelectedCCAEvents = allSelectedCCAEvents.concat(resp)
        if (counter === ccaIds.length) {
          dispatch({
            type: SCHEDULING_ACTIONS.GET_SELECTED_CCA_EVENTS,
            selectedCCAEvents: allSelectedCCAEvents,
          })
        } else {
          return allSelectedCCAEvents
        }
      })
      return allSelectedCCAEvents
    })
}

export const fetchAllProfiles = () => (dispatch: Dispatch<ActionTypes>) => {
  get(ENDPOINTS.ALL_PROFILES, DOMAINS.SOCIAL).then(async (resp) => {
    const sortedProfiles = resp.sort((a, b) => {
      return a.displayName.localeCompare(b.displayName)
    })
    dispatch({ type: SCHEDULING_ACTIONS.GET_ALL_PROFILES, profileList: sortedProfiles })
  })
  dispatch(setIsLoading(false))
}

/**
 * Fetches each friend's timetable and updates the selectedProfileEvents state
 *
 * @param friendsIds array of profile IDs selected by the user
 */
const fetchFriendTimetables = (friendsIds: string[]) => (dispatch: Dispatch<ActionTypes>) => {
  let allSelectedFriendsEvents: SchedulingEvent[] = []
  let counter = 0
  dispatch(fetchFriendsNusModsTimetable(friendsIds))

  if (friendsIds.length === 0) {
    dispatch({
      type: SCHEDULING_ACTIONS.GET_SELECTED_PROFILE_EVENTS,
      selectedProfileEvents: allSelectedFriendsEvents,
    })
  } else
    friendsIds.map(async (friendId) => {
      counter++
      const currentUNIXDate = Math.round(Date.now() / 1000)
      get(ENDPOINTS.USER_EVENT, DOMAINS.EVENT, `/${friendId}/` + currentUNIXDate).then(async (resp) => {
        allSelectedFriendsEvents = allSelectedFriendsEvents.concat(resp)
        if (counter === friendsIds.length) {
          dispatch({
            type: SCHEDULING_ACTIONS.GET_SELECTED_PROFILE_EVENTS,
            selectedProfileEvents: allSelectedFriendsEvents,
          })
        } else {
          return allSelectedFriendsEvents
        }
      })
      return allSelectedFriendsEvents
    })
}

const fetchFriendsNusModsTimetable = (friendsIds: string[]) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  let friendsNusModsEvents: TimetableEvent[] = []
  let counter = 0
  if (friendsIds.length === 0) {
    dispatch({
      type: SCHEDULING_ACTIONS.GET_SELECTED_PROFILE_NUSMODS_EVENTS,
      selectedProfileNusModsEvents: [],
    })
  } else {
    friendsIds.map(async (friendsId) => {
      counter++
      const friendNusModsEvents = await dispatch(getUserNusModsEvents(friendsId, true))
      friendsNusModsEvents = friendsNusModsEvents.concat(friendNusModsEvents)
      if (counter === friendsIds.length) {
        const reformatFriendsNusModsEvents: TimetableEvent[] = friendsNusModsEvents.map((event) => {
          return { ...event, eventType: 'friends' }
        })
        dispatch({
          type: SCHEDULING_ACTIONS.GET_SELECTED_PROFILE_NUSMODS_EVENTS,
          selectedProfileNusModsEvents: reformatFriendsNusModsEvents,
        })
      }
      return friendNusModsEvents
    })
  }
  dispatch(setIsLoading(false))
}

/**
 * Fetches selected friend's timetables from backend, updates the currently displaying timetable
 * and updates selectedProfileIds state
 *
 * @param selectedProfileIds array of profile IDs selected by the user
 */
export const setSelectedProfileIds = (selectedProfileIds: string[]) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  const { selectedCCAIds } = getState().scheduling

  dispatch(fetchFriendTimetables(selectedProfileIds))
  dispatch(
    fetchCurrentUserEvents(
      localStorage.getItem('userID'),
      selectedProfileIds.length === 0 && selectedCCAIds.length === 0,
    ),
  )
  dispatch({ type: SCHEDULING_ACTIONS.SET_SELECTED_PROFILE_IDS, selectedProfileIds: selectedProfileIds })
}
// ---------------------- CCA/FRIENDS(USERS) ----------------------

export const setIsLoading = (desiredState: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_IS_LOADING, isLoading: desiredState })
}
