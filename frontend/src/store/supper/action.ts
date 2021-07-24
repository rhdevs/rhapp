import { ActionTypes, Food, SupperGroup, Updates } from '../supper/types'
import { SUPPER_ACTIONS } from './types'
import { Dispatch, GetState } from '../types'
import { get, put, post, del, ENDPOINTS, DOMAINS } from '../endpoints'
import useSnackbar from '../../hooks/useSnackbar'
import { setIsLoading, setNewSupperGroupId, setOrderId, setSupperGroup } from './action/setter'
import {
  getAllSupperGroups,
  getOrderById,
  getRestaurantMenu,
  getSupperGroupById,
  getSupperNotifications,
} from './action/level1/getReqests'

const [error] = useSnackbar('error')

//------------------------ GET --------------------------
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

export const getCollatedOrder = (supperGroupId: string | number | undefined) => (dispatch: Dispatch<ActionTypes>) => {
  if (!supperGroupId) return
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_COLLATED_ORDER, DOMAINS.SUPPER, `/${supperGroupId}/collated`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_COLLATED_ORDER,
        collatedOrder: { ...resp.data, price: 0.0 },
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get collated order, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getUserOrder = (supperGroupId: string | number | undefined, userId: string) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (!supperGroupId) return
  // dispatch(setIsLoading(true))
  await get(ENDPOINTS.GET_USER_ORDER, DOMAINS.SUPPER, `/${supperGroupId}/user/${userId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      console.log('THIS IS ORDER!!!!!!!!: ', resp.data)
      dispatch({
        type: SUPPER_ACTIONS.GET_ORDER_BY_USER,
        order: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error("Failed to get user's order, please try again later.")
    })
  // dispatch(setIsLoading(false))
}

export const getAllUserJoinedSupperGroup = (userId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_JOINED_SUPPER_GROUP_HISTORY, DOMAINS.SUPPER, `/${userId}/joinGroupHistory`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_JOINED_SUPPER_GROUP_HISTORY,
        joinedSupperGroupHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get joined supper groups, please try again later.')
    })
  dispatch(setIsLoading(false))
}

//------------------------ POST / PUT -------------------------

export const createSupperGroup = (newSupperGroup: SupperGroup) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  let requestBody
  if (newSupperGroup.costLimit === undefined) {
    requestBody = { ...newSupperGroup, costLimit: null }
  } else {
    requestBody = newSupperGroup
  }
  console.log(requestBody)
  await post(ENDPOINTS.ADD_SUPPER_GROUP, DOMAINS.SUPPER, requestBody)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      console.log(resp.data)
      dispatch(setSupperGroup(resp.data.supperGroup))
      dispatch(setNewSupperGroupId(resp.data.supperGroup.supperGroupId))
      dispatch(setIsLoading(false))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get all supper groups, please try again later.')
      dispatch(setIsLoading(false))
    })
}

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
      error('Failed to update order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const createOrder = (userId: string, supperGroupId: string | number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const requestBody = {
    userID: userId,
    supperGroupId: Number(supperGroupId),
  }
  post(ENDPOINTS.CREATE_ORDER, DOMAINS.SUPPER, requestBody, {})
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(setOrderId(resp.data.orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to create order, please try again.')
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
      error('Failed to update order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const updateOrderDetails = (orderId: string, newOrderDetails) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(orderId, newOrderDetails)
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
      error('Failed to update order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const addFoodToOrder = (newFood: Food, orderId: string) => (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = newFood
  dispatch(setIsLoading(true))
  post(ENDPOINTS.ADD_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${orderId}/food`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderById(orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to add food, please try again later.')
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
      error('Failed to update food, please try again later.')
    })
  dispatch(setIsLoading(false))
}
//------------------------ DELETE -----------------------

export const deleteSupperGroup = (supperGroupId?: string | number) => (dispatch: Dispatch<ActionTypes>) => {
  if (!supperGroupId) return
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_SUPPER_GROUP, DOMAINS.SUPPER, {}, `/${supperGroupId}`)
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

export const deleteOrder = (supperGroupId: string | number, orderId?: string) => (dispatch: Dispatch<ActionTypes>) => {
  if (!orderId) return
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_ORDER, DOMAINS.SUPPER, {}, `/${orderId}`)
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

export const deleteFoodInOrder = (orderId: string | undefined, foodId: string | undefined) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (!(orderId || foodId)) return
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_FOOD, DOMAINS.SUPPER, {}, `/${orderId}/food/${foodId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderById(orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to delete food, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const updateSupperGroupPaymentStatus = (supperGroupId: string, paymentUpdateArray) => {
  if (!(paymentUpdateArray?.length || paymentUpdateArray)) return
  const requestBody = paymentUpdateArray
  console.log(paymentUpdateArray)
  put(ENDPOINTS.UPDATE_SUPPER_GROUP_PAYMENT_STATUS, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}/payment`)
}

export const leaveSupperGroup = (supperGroupId: string | number | undefined) => (dispatch: Dispatch<ActionTypes>) => {
  if (!supperGroupId) return
  dispatch(setIsLoading(true))
  del(ENDPOINTS.LEAVE_SUPPER_GROUP, DOMAINS.SUPPER, {}, `/${supperGroupId}/user/${localStorage.userID}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error('Failed to leave supper group, please try again.')
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
      error('Failed to update selected food, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getOwnerEdits = (orderId: string, foodId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  get(ENDPOINTS.GET_OWNER_EDITS, DOMAINS.SUPPER, `/${orderId}/food/${foodId}/owner`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error("Failed to get selected user's food, please try again.")
    })
  dispatch(setIsLoading(false))
}

export const getPlaceOrderPageDetails = (supperGroupId: string, restaurantId: string) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch(setIsLoading(true))
  dispatch(getSupperGroupById(supperGroupId)).then(() => {
    dispatch(getRestaurantMenu(restaurantId)).then(() => {
      dispatch(getUserOrder(supperGroupId, localStorage.userID)).then(() => {
        const { order } = getState().supper

        if (order) {
          dispatch(setOrderId(order.orderId))
        }
        dispatch(setIsLoading(false))
      })
    })
  })
}
