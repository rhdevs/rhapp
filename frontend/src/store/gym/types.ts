export type GymStatusStates = {
  gymIsOpen: boolean | null
  avatar: string
  keyHolder: { displayName: string; telegramHandle: string }
  keyIsReturned: boolean
}

export type ButtonStates = {
  keyWithMe: boolean
  returnKey: boolean
  toggleGym: boolean
}

// Added string type to handle some edge cases (specifically toggleGym).
export type ButtonTypes = string | 'keyWithMe' | 'returnKey' | 'closeGym' | 'openGym'

export type HistoryEntry = {
  date: string
  details: UserEntry[]
}

export type UserEntry = {
  statusChange: string
  requestTime: number
  userDetails: string
}

export type KeyWithArgs = {
  userID: string
  telegramHandle: string
  requestTime: number
  keyStatus: string
}

export type ReqArgs = {
  name: string
  telegram: string
}

export enum gymStates {
  KEY_WITH_ME = 'GYM_STATES.KEY_WITH_ME',
  RETURN_KEY = 'GYM_STATES.RETURN_KEY',
  OPEN_GYM = 'GYM_STATES.OPEN_GYM',
  CLOSE_GYM = 'GYM_STATES.CLOSE_GYM',
}

export enum GYM_ACTIONS {
  GET_GYM_STATUS = 'GYM_ACTIONS.GET_GYM_STATUS',
  GET_GYM_HISTORY = 'GYM_ACTIONS.GET_GYM_HISTORY',
  GET_PROFILE_PIC = 'GYM_ACTIONS.GET_PROFILE_PIC',
  MOVE_KEY = 'GYM_ACTIONS.MOVE_KEY',
  RETURN_KEY = 'GYM_ACTIONS.RETURN_KEY',
  TOGGLE_GYM = 'GYM_ACTIONS.TOGGLE_GYM',
}

type GetGymStatus = {
  type: typeof GYM_ACTIONS.GET_GYM_STATUS
  gymStatus: GymStatusStates
}

type GetGymHistory = {
  type: GYM_ACTIONS.GET_GYM_HISTORY
  history: HistoryEntry[]
}

type MoveKey = {
  type: GYM_ACTIONS.MOVE_KEY
  keyArgs: ReqArgs
}

type ReturnKey = {
  type: GYM_ACTIONS.RETURN_KEY
  keyArgs: ReqArgs
}

type ToggleGym = {
  type: GYM_ACTIONS.TOGGLE_GYM
}

type GetProfilePic = {
  type: GYM_ACTIONS.GET_PROFILE_PIC
  pic: string
}

export type ActionTypes = GetGymStatus | GetGymHistory | GetProfilePic | MoveKey | ReturnKey | ToggleGym
