import axios from 'axios'

//https://docs.google.com/spreadsheets/d/1_txnmuoX-rZVrHhZki4wNCBfSZQN3J86lN-PXw1xS4g/edit#gid=328274554
export enum ENDPOINTS {
  // AUTH
  LOGIN = '/login',
  IS_LOGGEDIN = '/protected',
  REGISTER = '/register',
  FORGET_PASSWORD = '/forgot',
  RESET_PASSWORD = '/reset',

  // USERS
  TELEGRAM_HANDLE = '/users/telegramID', //TODO make backend
  USER = '/user',
  USER_PROFILE = '/profile',
  USER_PROFILE_PICTURE = '/profile/picture',
  EDIT_PROFILE = '/profiles',
  USER_CCAS = '/user_CCA',
  FRIEND = '/friend',

  // FACILITY
  FACILITY_LIST = '/facilities',
  FACILITY = '/facilities',
  FACILITY_BOOKING = '/bookings/facility',
  BOOKING = '/bookings',
  VIEW_BOOKING = '/bookings',
  USER_BOOKINGS = '/bookings/user',
  JCRC_BLOCKOUT = '/bookings/blockout',

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
  ALL_CCAS = '/cca',
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
  GET_SUPPER_NOTIFICATIONS = '/user',
  CLOSE_SUPPER_NOTIFICATIONS = '/user',
  ALL_RESTAURANTS = '/restaurants',
  GET_RESTAURANT = '/restaurant',
  GET_RESTAURANT_MENU = '/restaurant',
  GET_MENU_FOOD = '/restaurant/food',
  ADD_FOOD = '/order',
  GET_FOOD = '/order',
  EDIT_FOOD = '/order',
  DELETE_FOOD = '/order',
  GET_COLLATED_ORDER = '/supperGroup',
  GET_USER_ORDER = '/supperGroup',
  ALL_SUPPER_GROUPS = '/supperGroup',
  ADD_SUPPER_GROUP = '/supperGroup',
  GET_SUPPER_GROUP_BY_ID = '/supperGroup',
  CREATE_ORDER = '/order',
  UPDATE_SUPPER_GROUP = '/supperGroup',
  DELETE_SUPPER_GROUP = '/supperGroup',
  GET_ORDER_BY_ID = '/order',
  UPDATE_ORDER_DETAILS = '/order',
  DELETE_ORDER = '/order',
  GET_ORDER_HISTORY = '/user',
  GET_SUPPER_GROUP_HISTORY = '/user',
  GET_JOINED_SUPPER_GROUP_HISTORY = '/user',
  UPDATE_SUPPER_GROUP_PAYMENT_STATUS = '/supperGroup',
  LEAVE_SUPPER_GROUP = '/supperGroup',
  GET_OWNER_EDITS = '/order',
  UPDATE_OWNER_EDITS = '/supperGroup',

  // GYM
  GET_GYM_HISTORY = '/',
  GET_GYM_STATUS = '/status',
  GET_PROFILE_PICTURE = '/keyHolder/profilepic',
  MOVE_KEY = '/movekey',
  RETURN_KEY = '/returnkey',
  TOGGLE_GYM = '/togglegym',
}

export enum DOMAINS {
  FACILITY = 'facilities',
  EVENT = 'event',
  LAUNDRY = 'laundry',
  SOCIAL = 'social',
  AUTH = 'auth',
  SUPPER = 'supper',
  GYM = 'gym',
}

function proxy(url: string) {
  return 'https://cors-anywhere-rhapp.herokuapp.com/https:' + url
}

function prod(domain: DOMAINS) {
  const url = '//rhapp-backend.rhdevs.repl.co/'
  return url + domain
}

function dev(domain: DOMAINS) {
  const url = '//rhapp-backend-devel.rhdevs.repl.co/'
  return proxy(url + domain)
}

export const DOMAIN_URL = {
  FACILITY: process.env.REACT_APP_MODE === 'production' ? prod(DOMAINS.FACILITY) : dev(DOMAINS.FACILITY),
  EVENT: process.env.REACT_APP_MODE === 'production' ? prod(DOMAINS.EVENT) : dev(DOMAINS.EVENT),
  LAUNDRY: process.env.REACT_APP_MODE === 'production' ? prod(DOMAINS.LAUNDRY) : dev(DOMAINS.LAUNDRY),
  SOCIAL: process.env.REACT_APP_MODE === 'production' ? prod(DOMAINS.SOCIAL) : dev(DOMAINS.SOCIAL),
  AUTH: process.env.REACT_APP_MODE === 'production' ? prod(DOMAINS.AUTH) : dev(DOMAINS.AUTH),
  SUPPER: process.env.REACT_APP_MODE === 'production' ? prod(DOMAINS.SUPPER) : dev(DOMAINS.SUPPER),
  GYM: process.env.REACT_APP_MODE === 'production' ? prod(DOMAINS.GYM) : dev(DOMAINS.GYM),
}

async function makeRequest(
  url: string,
  domain: DOMAINS,
  method: 'get' | 'post' | 'delete' | 'put',
  additionalHeaders: HeadersInit | undefined = {},
  requestBody: Record<string, unknown> = {},
) {
  let DOMAIN_URL_REQ: string
  switch (domain) {
    case DOMAINS.FACILITY:
      DOMAIN_URL_REQ = DOMAIN_URL.FACILITY
      break
    case DOMAINS.EVENT:
      DOMAIN_URL_REQ = DOMAIN_URL.EVENT
      break
    case DOMAINS.LAUNDRY:
      DOMAIN_URL_REQ = DOMAIN_URL.LAUNDRY
      break
    case DOMAINS.SOCIAL:
      DOMAIN_URL_REQ = DOMAIN_URL.SOCIAL
      break
    case DOMAINS.AUTH:
      DOMAIN_URL_REQ = DOMAIN_URL.AUTH
      break
    case DOMAINS.SUPPER:
      DOMAIN_URL_REQ = DOMAIN_URL.SUPPER
      break
    case DOMAINS.GYM:
      DOMAIN_URL_REQ = DOMAIN_URL.GYM
      break
  }
  return axios({
    method: method,
    url: DOMAIN_URL_REQ + url,
    headers: {
      ...additionalHeaders,
    },
    data: requestBody,
    // withCredentials: true,
    validateStatus: (status) => status >= 200 && status < 400,
  })
    .then((response) => response.data)
    .catch((err) => console.log(err))
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
  additionalHeaders: HeadersInit | undefined = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'post', additionalHeaders, requestBody)
}

export function del(
  endpoint: ENDPOINTS,
  domain: DOMAINS,
  additionalHeaders: HeadersInit | undefined = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'delete', additionalHeaders)
}

export function put(
  endpoint: ENDPOINTS,
  domain: DOMAINS,
  requestBody: Record<string, unknown>,
  additionalHeaders: HeadersInit | undefined = {},
  subRoute = '',
): ResponsePromise {
  return makeRequest(endpoint + subRoute, domain, 'put', additionalHeaders, requestBody)
}
