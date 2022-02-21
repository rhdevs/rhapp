export type GymStatusStates = {
  gymIsOpen: boolean
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
  date: number
  users: UserEntry[]
}

export type UserEntry = {
  gymStatus: string
  time: number
  userDetails: string
}

export type KeyWithArgs = {
  userID: string
  telegramHandle: string
  requesttime: number
  keyStatus: string
}

export type reqArgs = {
  userID: string
  requestTime: number
}

export enum GYM_ACTIONS {
  GET_GYM_STATUS = 'GYM_ACTIONS.GET_GYM_STATUS',
  GET_GYM_HISTORY = 'GYM_ACTIONS.GET_GYM_HISTORY',
  GET_TELEGRAM = 'GYM_ACTIONS.GET_TELEGRAM',
  MOVE_KEY = 'GYM_ACTIONS.MOVE_KEY',
  RETURN_KEY = 'GYM_ACTIONS.RETURN_KEY',
  TOGGLE_GYM = 'GYM_ACTIONS.TOGGLE_GYM', // TO BE CONFIRMED
}

type getGymStatus = {
  type: typeof GYM_ACTIONS.GET_GYM_STATUS
  gymStatus: GymStatusStates
}

type getGymHistory = {
  type: GYM_ACTIONS.GET_GYM_HISTORY
  history: HistoryEntry[]
}

type getTelegram = {
  type: GYM_ACTIONS.GET_TELEGRAM
  telegram: string
}

type moveKey = {
  type: GYM_ACTIONS.MOVE_KEY
  keyArgs: reqArgs
}

type returnKey = {
  type: GYM_ACTIONS.RETURN_KEY
  keyArgs: reqArgs
}

type toggleGym = {
  type: GYM_ACTIONS.TOGGLE_GYM
  args: reqArgs
}

export type ActionTypes = getGymStatus | getGymHistory | getTelegram | moveKey | returnKey | toggleGym
