import { DOMAINS, ENDPOINTS, get, post } from '../endpoints'
import { Dispatch } from '../types'
import { ActionTypes, GYM_ACTIONS } from './types'
import { unixToFullDate } from '../../common/unixToFullDate'

export const getGymStatus = () => async (dispatch: Dispatch<ActionTypes>) => {
  await get(ENDPOINTS.GET_GYM_STATUS, DOMAINS.GYM)
    .then((res) => {
      if (res.status == 'failed') {
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
      console.log(err)
    })
}

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
      console.log(err)
    })
}

export const returnKey = (userID: string) => async (dispatch: Dispatch<ActionTypes>) => {
  await post(ENDPOINTS.RETURN_KEY, DOMAINS.GYM, {}, {}, `/${userID}?token=${localStorage.getItem('token')}`)
    .then((res) => {
      if (res.status === 'failed') {
        throw res.err
      }
      dispatch({
        type: GYM_ACTIONS.RETURN_KEY,
        keyArgs: { name: '5-122', telegram: 'smchead' },
      })
      dispatch(getProfilePic())
    })
    .catch((err) => {
      console.log(err)
    })
}

export const toggleGym = (userID: string) => async (dispatch: Dispatch<ActionTypes>) => {
  await post(ENDPOINTS.TOGGLE_GYM, DOMAINS.GYM, {}, {}, `/${userID}?token=${localStorage.getItem('token')}`)
    .then((res) => {
      if (res.status === 'failed') {
        throw res.err
      }
      dispatch({
        type: GYM_ACTIONS.TOGGLE_GYM,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

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
      console.log(err)
    })
}
