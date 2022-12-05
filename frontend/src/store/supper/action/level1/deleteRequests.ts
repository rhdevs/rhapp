import { del, DOMAINS, ENDPOINTS } from '../../../endpoints'
import { Dispatch } from '../../../types'
import { ActionTypes } from '../../types'
import { setIsLoading, setSupperErrorMessage } from '../setter'
import { getAllSupperGroups, getOrderById, getSupperGroupById, getSupperNotifications } from './getReqests'

export const closeSupperNotification = (supperGroupId: number) => (dispatch: Dispatch<ActionTypes>) => {
  del(
    ENDPOINTS.CLOSE_SUPPER_NOTIFICATIONS,
    DOMAINS.SUPPER,
    {},
    `/${localStorage.userID}/supperGroupNotification/${supperGroupId}`,
  )
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperNotifications())
    })
    .catch((err) => {
      console.log(err)
    })
}

export const deleteSupperGroup = (supperGroupId?: string | number) => async (dispatch: Dispatch<ActionTypes>) => {
  if (!supperGroupId) return
  dispatch(setIsLoading(true))
  await del(ENDPOINTS.DELETE_SUPPER_GROUP, DOMAINS.SUPPER, {}, `/${supperGroupId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to delete supper group, please try again.'))
    })
  dispatch(setIsLoading(false))
}

export const deleteOrder =
  (supperGroupId: string | number, orderId?: string) => async (dispatch: Dispatch<ActionTypes>) => {
    if (!orderId) return
    dispatch(setIsLoading(true))
    await del(ENDPOINTS.DELETE_ORDER, DOMAINS.SUPPER, {}, `/${orderId}`)
      .then((resp) => {
        if (resp.status === 'failed') {
          throw resp.err
        }
        dispatch(getSupperGroupById(supperGroupId))
      })
      .catch((err) => {
        console.log(err)
        dispatch(setSupperErrorMessage('Failed to delete order, please try again later.'))
      })
    dispatch(setIsLoading(false))
  }

export const deleteFoodInOrder =
  (orderId: string | undefined, foodId: string | undefined) => async (dispatch: Dispatch<ActionTypes>) => {
    if (!(orderId || foodId)) return
    dispatch(setIsLoading(true))
    await del(ENDPOINTS.DELETE_FOOD, DOMAINS.SUPPER, {}, `/${orderId}/food/${foodId}`)
      .then((resp) => {
        if (resp.status === 'failed') {
          throw resp.err
        }
        dispatch(getOrderById(orderId))
      })
      .catch((err) => {
        console.log(err)
        dispatch(setSupperErrorMessage('Failed to delete food, please try again later.'))
      })
    dispatch(setIsLoading(false))
  }

export const leaveSupperGroup =
  (supperGroupId: string | number | undefined) => async (dispatch: Dispatch<ActionTypes>) => {
    if (!supperGroupId) return
    dispatch(setIsLoading(true))
    await del(ENDPOINTS.LEAVE_SUPPER_GROUP, DOMAINS.SUPPER, {}, `/${supperGroupId}/user/${localStorage.userID}`)
      .then((resp) => {
        if (resp.status === 'failed') {
          throw resp.err
        }
        dispatch(getAllSupperGroups())
      })
      .catch((err) => {
        console.log(err)
        dispatch(setSupperErrorMessage('Failed to leave supper group, please try again.'))
      })
    dispatch(setIsLoading(false))
  }
