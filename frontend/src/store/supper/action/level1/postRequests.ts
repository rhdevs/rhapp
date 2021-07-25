import { DOMAINS, ENDPOINTS, post } from '../../../endpoints'
import { Dispatch } from '../../../types'
import { ActionTypes, Food, SupperGroup } from '../../types'
import { setIsLoading, setNewSupperGroupId, setOrderId, setSupperErrorMessage, setSupperGroup } from '../setter'
import { getOrderById } from './getReqests'

export const createSupperGroup = (newSupperGroup: SupperGroup) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  let requestBody
  if (newSupperGroup.costLimit === undefined) {
    requestBody = { ...newSupperGroup, costLimit: null }
  } else {
    requestBody = newSupperGroup
  }
  await post(ENDPOINTS.ADD_SUPPER_GROUP, DOMAINS.SUPPER, requestBody)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(setSupperGroup(resp.data.supperGroup))
      dispatch(setNewSupperGroupId(resp.data.supperGroup.supperGroupId))
      dispatch(setIsLoading(false))
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to get all supper groups, please try again later.'))
      dispatch(setIsLoading(false))
    })
}

export const createOrder = (supperGroupId: string | number) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const requestBody = {
    userID: localStorage.userID,
    supperGroupId: Number(supperGroupId),
  }
  await post(ENDPOINTS.CREATE_ORDER, DOMAINS.SUPPER, requestBody, {})
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(setOrderId(resp.data.orderId))
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to create order, please try again.'))
    })
  dispatch(setIsLoading(false))
}

export const addFoodToOrder = (newFood: Food, orderId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = newFood
  dispatch(setIsLoading(true))
  await post(ENDPOINTS.ADD_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${orderId}/food`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderById(orderId))
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to add food, please try again later.'))
    })
  dispatch(setIsLoading(false))
}
