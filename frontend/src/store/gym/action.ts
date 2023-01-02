import { DOMAINS, ENDPOINTS, get, post } from '../endpoints'
import { Dispatch } from '../types'
import { ActionTypes, GYM_ACTIONS } from './types'
import { unixToFullDate } from '../../common/unixToFullDate'
import useSnackbar from '../../hooks/useSnackbar'

const [error] = useSnackbar('error')
const DEFAULT_VALUE = { name: '5-122', telegram: 'smchead' }

/**
 *
 * Sends a GET request to the backend to get the gym data.
 *
 * @returns the current status of the gym
 */
export const getGymStatus = () => async (dispatch: Dispatch<ActionTypes>) => {
  await get(ENDPOINTS.GET_GYM_STATUS, DOMAINS.GYM)
    .then((res) => {
      if (res.status === 'failed') {
        throw res.err
      }
      dispatch({
        type: GYM_ACTIONS.GET_GYM_STATUS,
        gymStatus: res.data,
      })
    })
    .catch((err) => {
      console.error(err)
    })
}

/**
 *
 * Sends a GET request to the backend to get the gym history.
 *
 * @returns the history of the gym
 */
export const getGymHistory = () => async (dispatch: Dispatch<ActionTypes>) => {
  await get(ENDPOINTS.GET_GYM_HISTORY, DOMAINS.GYM)
    .then((res) => {
      if (res.status === 'failed') {
        throw res.err
      }
      res.data.map((entry) => (entry.date = unixToFullDate(entry.date)))
      dispatch({
        type: GYM_ACTIONS.GET_GYM_HISTORY,
        history: res.data,
      })
    })
    .catch((err) => {
      error(err)
    })
}

/**
 *
 * Takes in the user's ID, name and telegram. Creates a POST request to update database on the current user who is holding onto the key
 *
 * @param userID (string)
 * @param name (string)
 * @param telegram (string)
 * @returns raises error if error
 *
 */

export const moveKey = (userID: string, name: string, telegram: string) => async (dispatch: Dispatch<ActionTypes>) => {
  await post(ENDPOINTS.MOVE_KEY, DOMAINS.GYM, {}, {}, `/${userID}?token=${localStorage.getItem('token')}`)
    .then((res) => {
      if (res.status === 'failed') {
        throw res.err
      }
      dispatch({
        type: GYM_ACTIONS.MOVE_KEY,
        keyArgs: { name: name, telegram: telegram },
      })
      dispatch(getProfilePic())
    })
    .catch((err) => {
      error(err)
    })
}

/**
 *
 * Takes in the user's ID. Creates a POST request to update database that the key has been returned
 *
 * @param userId
 * @returns raises error if error
 *
 */

export const returnKey = (userId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  await post(ENDPOINTS.RETURN_KEY, DOMAINS.GYM, {}, {}, `/${userId}?token=${localStorage.getItem('token')}`)
    .then((res) => {
      if (res.status === 'failed') {
        throw res.err
      }
      dispatch({
        type: GYM_ACTIONS.RETURN_KEY,
        keyArgs: DEFAULT_VALUE,
      })
      dispatch(getProfilePic())
    })
    .catch((err) => {
      error(err)
    })
}

/**
 *
 * Takes in the user's ID. Creates a POST request to update the usage status of the gym.
 *
 * @param userId (type `string`)
 * @returns updates `type`
 *
 */
export const toggleGym = (userId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  await post(ENDPOINTS.TOGGLE_GYM, DOMAINS.GYM, {}, {}, `/${userId}?token=${localStorage.getItem('token')}`)
    .then((res) => {
      if (res.status === 'failed') {
        throw res.err
      }
      dispatch({
        type: GYM_ACTIONS.TOGGLE_GYM,
      })
    })
    .catch((err) => {
      error(err)
    })
}

/**
 *
 * Creates a GET request to obtain the profile picture of the user.
 *
 * @returns updates `type`, `pic`
 *
 */
export const getProfilePic = () => async (dispatch: Dispatch<ActionTypes>) => {
  await get(ENDPOINTS.GET_PROFILE_PICTURE, DOMAINS.GYM)
    .then((res) => {
      if (res.status === 'failed') {
        throw res.err
      }
      dispatch({
        type: GYM_ACTIONS.GET_PROFILE_PIC,
        pic: res.imageURL,
      })
    })
    .catch((err) => {
      error(err)
    })
}
