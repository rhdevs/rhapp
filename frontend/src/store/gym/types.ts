export type GymStatus = {
  keyStatus: string
  gymStatus: boolean
}

export type HistoryEntry = {
  gymStatus: boolean
  keyStatus: string
  requesttime: number
  telegramHandle: string
  userID: string
}

export type KeyWithArgs = {
  userID: string
  telegramHandle: string
  requesttime: number
  keyStatus: string
}

export enum GYM_ACTIONS {
  GET_GYM_STATUS = 'GYM_ACTIONS.GET_GYM_STATUS',
  SET_KEY_WITH = 'GYM_ACTIONS.SET_KEY_WITH',
  GET_GYM_HISTORY = 'GYM_ACTIONS.GET_GYM_HISTORY',
  GET_TELEGRAM = 'GYM_ACTIONS.GET_TELEGRAM',
  // TOGGLE_GYM = 'GYM_ACTIONS.TOGGLE_GYM', // TO BE CONFIRMED
}

type getGymStatus = {
  type: typeof GYM_ACTIONS.GET_GYM_STATUS
  gymStatus: GymStatus
}

type setKeyWith = {
  type: GYM_ACTIONS.SET_KEY_WITH
  keyWith: string
}

type getGymHistory = {
  type: GYM_ACTIONS.GET_GYM_HISTORY
  history: HistoryEntry[]
}

type getTelegram = {
  type: GYM_ACTIONS.GET_TELEGRAM
  telegram: string
}

export type ActionTypes = getGymStatus | setKeyWith | getGymHistory | getTelegram
