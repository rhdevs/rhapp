import { userRhEventsDummy } from '../stubs'
import { Dispatch } from '../types'
import { ActionTypes, RHEvent, SCHEDULING_ACTIONS } from './types'

export const fetchUserRhEvents = () => (dispatch: Dispatch<ActionTypes>) => {
  const fetchedData = userRhEventsDummy
  // eventID	INT
  // eventName	VARCHAR
  // startDateTime	LOCALDATETIME
  // endDateTime	LOCALDATETIME
  // description	VARCHAR
  // location	VARCHAR
  // ccaID	INT
  // userID	VARCHAR
  // image	VARCHAR

  // {
  //   eventName: 'dummy event',
  //   location: 'in my room',
  //   day: 'Monday',
  //   endTime: '1200',
  //   startTime: '1000',
  // },

  const formattedEvents: RHEvent[] = []
  fetchedData.forEach((data) => {
    formattedEvents.push({
      eventName: data.eventName,
      location: data.location,
      day: getDayStringFromUNIX(data.startDateTime),
      // endTime: getTimeStringFromUNIX(data.endDateTime),
      // startTime: getTimeStringFromUNIX(data.startDateTime),
      endTime: '1200',
      startTime: '1000',
    })
  })

  dispatch({
    type: SCHEDULING_ACTIONS.GET_RH_EVENTS,
    userRhEvents: formattedEvents,
  })
}

// converts a unix string into date format and returns the day in string
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

const getTimeStringFromUNIX = (unixDate: number) => {
  //assume returns;
  return new Date(unixDate).toLocaleTimeString('en-US').toString()
}
