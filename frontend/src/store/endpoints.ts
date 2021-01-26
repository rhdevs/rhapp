import axios from 'axios'

//https://docs.google.com/spreadsheets/d/1_txnmuoX-rZVrHhZki4wNCBfSZQN3J86lN-PXw1xS4g/edit#gid=328274554
export enum ENDPOINTS {
  // USERS
  TELEGRAM_HANDLE = '/users/telegramID',
  USER = '/user',
  USER_PROFILE = '/profile',
  USER_DETAILS = '/user/details',
  EDIT_PROFILE = '/profile/edit',
  USER_CCAS = '/user_CCA',
  FRIEND = '/friend',

  // FACILITY
  FACILITY_LIST = '/facilities/all',
  FACILITY = '/facility',
  FACILITY_BOOKING = '/bookings/facility',
  BOOKING = '/bookings',
  USER_BOOKINGS = '/bookings/user',

  // LAUNDRY
  MACHINE_LIST = '/location',
  LAUNDRY_MACHINE = '/laundry/machine',
  UPDATE_MACHINE = '/laundry/machine',
  LAUNDRY_JOB = '/laundry/job',
  EDIT_DURATION = '/laundry/machine/editDuration',

  // SCHEDULING
  USER_TIMETABLE = '/timetable/all',
  ALL_USERS = '/user/all',
  USER_PERMISSION = '/permissions',

  ALL_EVENTS = '/event/all',
  ALL_PUBLIC_EVENTS = '/event/public/all',
  USER_EVENT = '/user_event/',
  ADD_EVENT = '/event/add/',
  DELETE_EVENT = '/event/delete/',
  RSVP_EVENT = '/user_event',
  EDIT_EVENT = '/event/edit/',

  ADD_MODS = '/nusmods/addNUSMods',
  DELETE_MODS = '/nusmods/delete/',
  NUSMODS = '/nusmods/',

  USER_LESSON = 'user_lesson',
  LESSON_DETAILS = '/lesson',

  CCA_DETAILS = '/cca',
  ALL_CCAS = '/cca/all',
  CCA_MEMBER = '/user_CCA',

  EVENT_DETAILS = '/event',

  // FRIENDS
  ALL_FRIENDS = '/friend',

  // SOCIAL
  OFFICIAL_POSTS = '/post/official',
  ALL_POSTS = '/post',
  FRIENDS_OF_USER_POSTS = '/post/friend',
  SPECIFIC_POST = '/post/search',
  DELETE_POST = '/post',
  EDIT_POST = '/post/edit',

  // HOME
  SEARCH = '/search',
}

export enum DOMAINS {
  FACILITY = 'facility',
  EVENT = 'event',
  LAUNDRY = 'laundry',
  SOCIAL = 'social',
}

export enum DOMAIN_URL {
  FACILITY = 'https://rhappfacilities.rhdevs.repl.co',
  EVENT = 'https://rhappevents.rhdevs.repl.co',
  LAUNDRY = 'https://rhapplaundry.rhdevs.repl.co',
  SOCIAL = 'https://rhappsocial.rhdevs.repl.co',
}

async function makeRequest(
  url: string,
  domain: DOMAINS,
  method: 'get' | 'post' | 'delete' | 'put',
  additionalHeaders: Record<string, unknown> = {},
  requestBody: Record<string, unknown> = {},
) {
  let DOMAIN_URL: string
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
    case DOMAINS.SOCIAL:
      DOMAIN_URL = 'https://rhappsocial.rhdevs.repl.co'
      break
  }
  console.log(DOMAIN_URL + url)
  return axios({
    method: method,
    url: DOMAIN_URL + url,
    headers: {
      'Access-Control-Allow-Origin': '*',
      ...additionalHeaders,
    },
    data: requestBody,
    // withCredentials: true,
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
