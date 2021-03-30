import { Dispatch } from '../types'
import { del, DOMAINS, ENDPOINTS, get, post, put } from '../endpoints'
import { ActionTypes, Order, SupperGroup } from '../supper/types'
import { SUPPER_ACTIONS } from './types'

import useSnackbar from '../../hooks/useSnackbar'

const [error] = useSnackbar('error')

export const getAllSupperGroups = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.ALL_SUPPER_GROUPS, DOMAINS.SUPPER)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS,
        allSupperGroups: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get all supper groups, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const createSupperGroup = (newSupperGroup: SupperGroup) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  const requestBody = newSupperGroup
  post(ENDPOINTS.ADD_SUPPER_GROUP, DOMAINS.SUPPER, requestBody)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get all supper groups, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getSupperGroupById = (supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  get(ENDPOINTS.GET_SUPPER_GROUP_BY_ID, DOMAINS.SUPPER, `/${supperGroupId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_SUPPER_GROUP_BY_ID,
        supperGroup: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get supper group, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const addOrder = (order: Order, supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const requestBody = order
  post(ENDPOINTS.ADD_ORDER, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperGroupById(supperGroupId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to add order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const updateSupperGroup = (order: Order, supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  const requestBody = order
  put(ENDPOINTS.UPDATE_SUPPER_GROUP, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error('Failed to updated order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const deleteSupperGroup = (supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_SUPPER_GROUP, DOMAINS.SUPPER, {}, `/${supperGroupId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error('Failed to delete supper group, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getOrderInSupperGroup = (supperGroupId: string, orderId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_ORDER_IN_SUPPER_GROUP, DOMAINS.SUPPER, `/${supperGroupId}/${orderId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ORDER_BY_ID,
        order: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const updateOrderDetails = (newOrderDetails: Order, supperGroupId: string, orderId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(setIsLoading(true))
  const requestBody = newOrderDetails
  put(ENDPOINTS.UPDATE_ORDER_DETAILS, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}/${orderId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderInSupperGroup(supperGroupId, orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to update order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const deleteOrder = (supperGroupId: string, orderId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_ORDER, DOMAINS.SUPPER, {}, `/${supperGroupId}/${orderId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperGroupById(supperGroupId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to delete order, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getOrderHistory = (userId) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_ORDER_HISTORY, DOMAINS.SUPPER, `/${userId}/orderHistory`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ORDER_HISTORY,
        orderHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to retrieve order history, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getSupperHistory = (userId) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_SUPPER_GROUP_HISTORY, DOMAINS.SUPPER, `/${userId}/supperGroupHistory`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_SUPPER_GROUP_HISTORY,
        supperGroupHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to retrieve supper group history, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const setIsLoading = (isLoading: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_IS_LOADING,
    isLoading: isLoading,
  })
}
