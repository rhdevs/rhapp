import axios from 'axios'

//https://docs.google.com/spreadsheets/d/1_txnmuoX-rZVrHhZki4wNCBfSZQN3J86lN-PXw1xS4g/edit#gid=328274554
export enum ENDPOINTS {
  MOCK_ENDPOINT = 'this/is/fake/endpoint',
  // USERS
  TELEGRAM_HANDLE = '/users/telegramID',

  // FACILITY
  FACILITY_LIST = '/facilities/all',
  FACILITY_BOOKING = '/bookings/facility',
  BOOKING = '/bookings',
  USER_BOOKINGS = '/bookings/user',

  // LAUNDRY
  MACHINE_LIST = '/location/',
  LAUNDRY_MACHINE = 'laundry/machine',
  LAUNDRY_JOB = '/laundry/job',

  // SCHEDULING
  USER_TIMETABLE = '/timetable/all',
  ALL_USERS = '/user/all',
  USER_PERMISSION = '/permissions/',

  ALL_EVENTS = '/event/all',
  USER_EVENT = '/user_event',
  ADD_EVENT = '/event/add/',
  DELETE_EVENT = '/event/delete/',
  RSVP_EVENT = '/user_event/',
  EDIT_EVENT = '/event/edit/',

  USER_LESSON = 'user_lesson',
  LESSON_DETAILS = '/lesson',

  CCA_DETAILS = '/cca',
  ALL_CCAS = '/cca/all',
  CCA_MEMBER = '/user_CCA',

  EVENT_DETAILS = '/event',
}

export enum DOMAINS {
  FACILITY = 'facility',
  EVENT = 'event',
  LAUNDRY = 'laundry',
}

async function makeRequest(
  url: string,
  domain: DOMAINS,
  method: 'get' | 'post' | 'delete' | 'put',
  additionalHeaders: Record<string, unknown> = {},
  requestBody: Record<string, unknown> = {},
) {
  let DOMAIN_URL
  switch (domain) {
    case DOMAINS.FACILITY:
      DOMAIN_URL = 'https://rhappfacilities.rhdevs.repl.co'
      break
    case DOMAINS.EVENT:
      DOMAIN_URL = 'https://rhappevents.rhdevs.repl.co'
      break
    case DOMAINS.LAUNDRY:
      DOMAIN_URL = 'https://rhapplaundry.rhdevs.repl.co'
      break
  }

  return axios({
    method,
    url: DOMAIN_URL + url,
    headers: {
      ...additionalHeaders,
    },
    data: requestBody,
    withCredentials: true,
    validateStatus: (status) => {
      if (status >= 200 && status < 400) {
        return true
      } else {
        return false
      }
    },
  }).then((response) => response.data)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ResponsePromise = Promise<any>

export function get(endpoint: ENDPOINTS, domain: DOMAINS, subRoute = ''): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'get')
}

export function post(
  endpoint: ENDPOINTS,
  domain: DOMAINS,
  requestBody: Record<string, unknown>,
  additionalHeaders: Record<string, unknown> = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'post', additionalHeaders, requestBody)
}

export function del(
  endpoint: ENDPOINTS,
  domain: DOMAINS,
  additionalHeaders: Record<string, unknown> = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'delete', additionalHeaders)
}

export function put(
  endpoint: ENDPOINTS,
  domain: DOMAINS,
  requestBody: Record<string, unknown>,
  additionalHeaders: Record<string, unknown> = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'put', additionalHeaders, requestBody)
}
