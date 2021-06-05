import axios from 'axios'

//https://docs.google.com/spreadsheets/d/1_txnmuoX-rZVrHhZki4wNCBfSZQN3J86lN-PXw1xS4g/edit#gid=328274554
export enum ENDPOINTS {
  // AUTH
  LOGIN = '/login',
  IS_LOGGEDIN = '/protected',
  REGISTER = '/register',

  // USERS
  TELEGRAM_HANDLE = '/users/telegramID', //TODO make backend
  USER = '/user',
  USER_PROFILE = '/profile/',
  USER_PROFILE_PICTURE = '/profile/picture',
  EDIT_PROFILE = '/profiles',
  USER_CCAS = '/user_CCA', //TODO make backend route
  FRIEND = '/friend',

  // FACILITY
  FACILITY_LIST = '/facilities/all',
  FACILITY = '/facility',
  FACILITY_BOOKING = '/bookings/facility',
  BOOKING = '/bookings',
  VIEW_BOOKING = '/booking',
  USER_BOOKINGS = '/bookings/user',

  // LAUNDRY
  MACHINE_LIST = '/location',
  LAUNDRY_MACHINE = '/laundry/machine',
  UPDATE_MACHINE = '/laundry/machine',
  EDIT_DURATION = '/laundry/machine/editDuration',

  // SCHEDULING
  USER_TIMETABLE = '/timetable/all',
  ALL_USERS = '/user/all',
  USER_PERMISSION = '/permissions',

  ALL_EVENTS = '/event/all',
  GET_EVENT_BY_EVENTID = '/event/eventID',
  GET_EVENT_BY_CCAID = '/event/ccaID',
  GET_PUBLIC_EVENTS = '/event/public',
  ALL_PUBLIC_EVENTS = '/event/public/all',
  ALL_PUBLIC_EVENTS_AFTER_SPECIFIC_TIME = '/event/public/afterTime',
  USER_PRIVATE_EVENTS_AFTER_SPECIFIC_TIME = '/event/private',
  USER_EVENT = '/user_event',
  ADD_EVENT = '/event/add',
  DELETE_EVENT = '/event/delete',
  RSVP_EVENT = '/user_event',
  EDIT_EVENT = '/event/edit',

  ADD_MODS = '/nusmods/addNUSMods',
  DELETE_NUSMODS_EVENT = '/nusmods/deleteMod',
  DELETE_MODS = '/nusmods/delete',
  NUSMODS = '/nusmods',

  USER_LESSON = 'user_lesson',
  LESSON_DETAILS = '/lesson',

  CCA_DETAILS = '/cca',
  ALL_CCAS = '/cca/all',
  CCA_MEMBER = '/user_CCA',

  EVENT_DETAILS = '/event',

  // FRIENDS
  ALL_FRIENDS = '/friend',

  // SOCIAL
  ALL_PROFILES = '/profiles',
  OFFICIAL_POSTS = '/posts/official',
  ALL_POSTS = '/posts',
  FRIENDS_OF_USER_POSTS = '/posts/friend',
  SPECIFIC_POST = '/posts',
  DELETE_POST = '/posts',
  EDIT_POST = '/posts',
  CREATE_POSTS = '/posts',

  // HOME
  SEARCH = '/search',

  // SUPPER
  ALL_RESTAURANTS = '/supper/restaurant',
  GET_RESTAURANT = '/supper/restaurant',
  GET_RESTAURANT_MENU = '/supper/restaurant',
  GET_MENU_FOOD = '/supper/restaurant',
  ADD_FOOD = '/supper',
  GET_FOOD = '/supper',
  EDIT_FOOD = '/supper',
  DELETE_FOOD = '/supper',
  GET_COLLATED_ORDER = '/supper',
  GET_USER_ORDER = '/supper',
  ALL_SUPPER_GROUPS = '/supper',
  ADD_SUPPER_GROUP = '/supper',
  GET_SUPPER_GROUP_BY_ID = '/supper',
  ADD_ORDER = '/supper',
  UPDATE_SUPPER_GROUP = '/supper',
  DELETE_SUPPER_GROUP = '/supper',
  GET_ORDER_IN_SUPPER_GROUP = '/supper',
  UPDATE_ORDER_DETAILS = '/supper',
  DELETE_ORDER = '/supper',
  GET_ORDER_HISTORY = '/supper/user',
  GET_SUPPER_GROUP_HISTORY = '/supper/user',
}

export enum DOMAINS {
  FACILITY = 'facility',
  EVENT = 'event',
  LAUNDRY = 'laundry',
  SOCIAL = 'social',
  AUTH = 'auth',
  SUPPER = 'facility', //'supper',
}

export const DOMAIN_URL = {
  FACILITY:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/facilities'
      : '//rhappmiddleware.herokuapp.com/rhappfacilities',
  EVENT:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/scheduling'
      : '//rhappmiddleware.herokuapp.com/rhappevents',
  LAUNDRY:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/laundry'
      : '//rhappmiddleware.herokuapp.com/rhapplaundry',
  SOCIAL:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/social'
      : '//rhappmiddleware.herokuapp.com/rhappsocial',
  AUTH:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhapp-backend.rhdevs.repl.co/auth'
      : '//rhappmiddleware.herokuapp.com/rhappauth',
  //TODO: update with supper domain url
  SUPPER:
    process.env.REACT_APP_MODE === 'production'
      ? '//rhappfacilities.rhdevs.repl.co'
      : '//rhapp-middleware.herokuapp.com/rhappfacilities',
}

async function makeRequest(
  url: string,
  domain: DOMAINS,
  method: 'get' | 'post' | 'delete' | 'put',
  additionalHeaders: Record<string, unknown> = {},
  requestBody: Record<string, unknown> = {},
) {
  let DOMAIN_URL_REQ: string
  switch (domain) {
    case DOMAINS.FACILITY:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhapp-backend.rhdevs.repl.co/facilities'
          : '//rhappmiddleware.herokuapp.com/rhappfacilities'
      break
    case DOMAINS.EVENT:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhapp-backend.rhdevs.repl.co/scheduling'
          : '//rhappmiddleware.herokuapp.com/rhappevents'
      break
    case DOMAINS.LAUNDRY:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhapp-backend.rhdevs.repl.co/laundry'
          : '//rhappmiddleware.herokuapp.com/rhappsocial'
      break
    case DOMAINS.SOCIAL:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhapp-backend.rhdevs.repl.co/social'
          : '//rhappmiddleware.herokuapp.com/rhappsocial'
      break
    case DOMAINS.AUTH:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhapp-backend.rhdevs.repl.co/auth'
          : '//rhappmiddleware.herokuapp.com/rhappauth'
      break
    //TODO: update with supper request url
    case DOMAINS.SUPPER:
      DOMAIN_URL_REQ =
        process.env.REACT_APP_MODE === 'production'
          ? '//rhappsocial.rhdevs.repl.co'
          : '//rhapp-middleware.herokuapp.com/rhappsocial'
      break
  }
  return axios({
    method: method,
    url: DOMAIN_URL_REQ + url,
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
