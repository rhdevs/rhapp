// import { DOMAINS, ENDPOINTS, get, post } from '../endpoints'
import { Dispatch } from '../types'
import { ActionTypes, GYM_ACTIONS, KeyWithArgs } from './types'
import { gymHistory, gymStatus } from '../stubs'

// TODO: once backend is set up, set up async to the endpoints
export const getGymStatus = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: GYM_ACTIONS.GET_GYM_STATUS,
    gymStatus: gymStatus,
  })
}

export const getGymHistory = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: GYM_ACTIONS.GET_GYM_HISTORY,
    history: gymHistory,
  })
}

export const getTelegram = (userID: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: GYM_ACTIONS.GET_TELEGRAM,
    telegram: 'Whatthejunxiang',
  })
}

export const setKeyWith = (args: KeyWithArgs) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: GYM_ACTIONS.SET_KEY_WITH,
    keyWith: args.keyStatus,
  })
}
