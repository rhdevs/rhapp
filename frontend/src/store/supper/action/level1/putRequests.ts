import { DOMAINS, ENDPOINTS, put } from '../../../endpoints'
import { Dispatch } from '../../../types'
import { ActionTypes, Updates } from '../../types'
import { setIsLoading, setSupperErrorMessage } from '../setter'
import { getCollatedOrder, getOrderById, getSupperGroupById } from './getReqests'

export const updateSupperGroup = (supperGroupId: string | number | undefined, updatedInfo) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (!(supperGroupId && updatedInfo)) return
  dispatch(setIsLoading(true))
  const requestBody = updatedInfo
  console.log(requestBody)
  put(ENDPOINTS.UPDATE_SUPPER_GROUP, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperGroupById(supperGroupId))
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to update order, please try again.'))
    })
  dispatch(setIsLoading(false))
}

export const emptyOrderFoodList = (supperGroupId: string, orderId: string) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(supperGroupId, orderId)
  if (!supperGroupId || !orderId) return
  dispatch(setIsLoading(true))
  const requestBody = { foodList: [] }
  console.log(requestBody)
  put(ENDPOINTS.UPDATE_ORDER_DETAILS, DOMAINS.SUPPER, requestBody, {}, `/${orderId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderById(orderId))
    })
    .then(() => dispatch(getSupperGroupById(supperGroupId)))
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to update order, please try again.'))
    })
  dispatch(setIsLoading(false))
}

export const updateOrderDetails = (orderId: string, newOrderDetails) => (dispatch: Dispatch<ActionTypes>) => {
  if (!newOrderDetails || !orderId) return
  dispatch(setIsLoading(true))
  const requestBody = newOrderDetails
  put(ENDPOINTS.UPDATE_ORDER_DETAILS, DOMAINS.SUPPER, requestBody, {}, `/${orderId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderById(orderId))
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to update order, please try again.'))
    })
  dispatch(setIsLoading(false))
}

export const updateFoodInOrder = (newFood, orderId: string, foodId: string) => (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = newFood
  dispatch(setIsLoading(true))
  put(ENDPOINTS.EDIT_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${orderId}/food/${foodId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderById(orderId))
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to update food, please try again later.'))
    })
  dispatch(setIsLoading(false))
}

export const updateOwnerEdits = (
  supperGroupId: number | undefined,
  foodId: string | undefined,
  updates: Updates,
  forAll: boolean,
) => (dispatch: Dispatch<ActionTypes>) => {
  if (!(supperGroupId || foodId)) return
  dispatch(setIsLoading(true))
  const requestBody = { foodId: foodId, updates: { ...updates, global: forAll } }

  put(ENDPOINTS.UPDATE_OWNER_EDITS, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}/owner`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getCollatedOrder(supperGroupId))
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to update selected food, please try again.'))
    })
  dispatch(setIsLoading(false))
}
