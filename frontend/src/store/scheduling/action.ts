import axios from 'axios'
import { isEmpty, last } from 'lodash'
import { dummyNusModsLink, eventsDummy, getHallEventTypesStub, targetAudienceListStub, userEventsDummy } from '../stubs'
import { Dispatch, GetState } from '../types'
import {
  ActionTypes,
  SchedulingEvent,
  SCHEDULING_ACTIONS,
  LESSON_TO_ABBREV,
  ABBREV_TO_LESSON,
  TimetableEvent,
} from './types'
import { ENDPOINTS, DOMAINS, get, post, DOMAIN_URL } from '../endpoints'

export const fetchUserEvents = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  // const fetchedData = userEventsDummy
  await fetch(DOMAIN_URL.EVENT + ENDPOINTS.ALL_EVENTS, {
    method: 'GET',
    mode: 'cors',
  })
    .then((resp) => {
      return resp.json()
    })
    .then((data) => {
      const timetableFormatEvents: TimetableEvent[] = data.map((singleEvent) => {
        return convertSchedulingEventToTimetableEvent(singleEvent)
      })
      console.log(
        timetableFormatEvents.filter((s) => {
          return (
            s.eventName === 'Donate blood at a local blood center' ||
            s.eventName.includes('Look at pictures and videos of') ||
            s.eventName.includes('Learn how to make a website') ||
            s.eventName.includes('Create a personal website')
          )
        }),
      )

      dispatch({
        type: SCHEDULING_ACTIONS.GET_USER_EVENTS,
        userEvents: transformInformationToTimetableFormat(timetableFormatEvents),
        userEventsStartTime: Number(getTimetableStartTime(timetableFormatEvents)),
        userEventsEndTime: Number(getTimetableEndTime(timetableFormatEvents)),
        userEventsList: timetableFormatEvents,
      })
      dispatch(setIsLoading(false))
    })
}

// const withNusModsEvents = (userEventsList: TimetableEvent[]) => {
//   //fetch nusmodsEvents from backend
//   const nusModsEvent =
//   userEventsList.concat()
// }

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

// ---------------------- NUSMODS ----------------------
export const setUserNusModsLink = (userNusModsLink: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({ type: SCHEDULING_ACTIONS.SET_USER_NUSMODS_LINK, userNusModsLink: userNusModsLink })
  console.log(userNusModsLink)
}

export const getUserNusModsEvents = () => async (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(setIsLoading(true))
  const currentYear = new Date().getFullYear()
  const academicYear = String(currentYear - 1) + '-' + String(currentYear)

  const { userNusModsLink } = getState().scheduling

  // const userNusModsLink = dummyNusModsLink //fetch link *include validation!

  const dataFromLink = extractDataFromLink(userNusModsLink)
  let retrivedEventInformation: TimetableEvent[] = []
  const temporaryData: TimetableEvent[][] = []

  dataFromLink.map(async (oneModuleData) => {
    temporaryData.push(await fetchDataFromNusMods(academicYear, oneModuleData))
    retrivedEventInformation = temporaryData.flat()
    if (oneModuleData === last(dataFromLink)) {
      console.log(retrivedEventInformation)
      dispatch({
        type: SCHEDULING_ACTIONS.GET_NUSMODS_EVENTS,
        userNusModsEvents: retrivedEventInformation,
      })
    }
  })
  //post to userEvents
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
            eventID: 1,
            eventType: 'timetable', //change!
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

export const editUserEvents = (action: string, eventId: number, userId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  // const fetchedUserData = userEventsDummy.map((userEvent) => {
  //   return convertSchedulingEventToTimetableEvent(userEvent)
  // })
  // const fetchedEventsData = eventsDummy.map((event) => {
  //   return convertSchedulingEventToTimetableEvent(event)
  // })
  // let newUserEvents: TimetableEvent[] = []

  if (action === 'remove') {
    console.log('REMOVE: eventId - ' + eventId + '; userId: ' + userId)
    // newUserEvents = fetchedUserData.filter((userEvent) => {
    //   return userEvent.eventID !== eventId
    // })
    // console.log(newUserEvents)
  } else if (action === 'add') {
    console.log('ADD: eventId - ' + eventId + '; userId: ' + userId)
    // newUserEvents = fetchedUserData.concat(
    //   fetchedEventsData.filter((event) => {
    //     return event.eventID === eventId
    //   }),
    // )
    // console.log(newUserEvents)
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
