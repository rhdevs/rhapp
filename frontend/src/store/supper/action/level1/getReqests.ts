import { DOMAINS, ENDPOINTS, get } from '../../../endpoints'
import { Dispatch } from '../../../types'
import { ActionTypes, SUPPER_ACTIONS } from '../../types'
import { setIsLoading, setSupperErrorMessage } from '../setter'

export const getSupperNotifications = () => async (dispatch: Dispatch<ActionTypes>) => {
  await get(ENDPOINTS.GET_SUPPER_NOTIFICATIONS, DOMAINS.SUPPER, `/${localStorage.userID}/supperGroupNotification`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_SUPPER_NOTIFICATIONS,
        supperNotifications: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
    })
}

export const getAllSupperGroups = () => async (dispatch: Dispatch<ActionTypes>) => {
  await get(ENDPOINTS.ALL_SUPPER_GROUPS, DOMAINS.SUPPER)
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
      setSupperErrorMessage('Failed to get all supper groups, please try again later.')
    })
}

export const getSupperGroupById =
  (supperGroupId: string | number | undefined) => async (dispatch: Dispatch<ActionTypes>) => {
    if (supperGroupId === undefined) return
    await get(ENDPOINTS.GET_SUPPER_GROUP_BY_ID, DOMAINS.SUPPER, `/${supperGroupId}`)
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
        setSupperErrorMessage('Failed to get supper group, please try again later.')
      })
  }

export const getCreatedSupperHistory = () => async (dispatch: Dispatch<ActionTypes>) => {
  await get(ENDPOINTS.GET_SUPPER_GROUP_HISTORY, DOMAINS.SUPPER, `/${localStorage.userID}/supperGroupHistory`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_SUPPER_GROUP_HISTORY,
        createdSupperHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to retrieve supper group history, please try again.'))
    })
}

export const getJoinedSupperHistory = () => async (dispatch: Dispatch<ActionTypes>) => {
  await get(ENDPOINTS.GET_JOINED_SUPPER_GROUP_HISTORY, DOMAINS.SUPPER, `/${localStorage.userID}/joinGroupHistory`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_JOINED_SUPPER_GROUP_HISTORY,
        joinedSupperHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to get joined supper groups, please try again later.'))
    })
}

export const getOrderById = (orderId: string | undefined) => async (dispatch: Dispatch<ActionTypes>) => {
  if (!orderId) return
  dispatch(setIsLoading(true))
  await get(ENDPOINTS.GET_ORDER_BY_ID, DOMAINS.SUPPER, `/${orderId}`)
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
      setSupperErrorMessage('Failed to get order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getRestaurant = (restaurantId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  await get(ENDPOINTS.GET_RESTAURANT, DOMAINS.SUPPER, `/${restaurantId}/menu`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_RESTAURANT_BY_ID,
        restaurant: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to get restaurant, please try again later.'))
    })
}

export const getFoodMenu = (foodMenuId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  await get(ENDPOINTS.GET_MENU_FOOD, DOMAINS.SUPPER, `/${foodMenuId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_MENU_FOOD,
        foodMenu: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to get food from menu, please try again later.'))
    })
  dispatch(setIsLoading(false))
}

export const getFoodInOrder = (orderId?: string, foodId?: string) => async (dispatch: Dispatch<ActionTypes>) => {
  if (!(orderId && foodId)) return
  await get(ENDPOINTS.GET_FOOD, DOMAINS.SUPPER, `/${orderId}/food/${foodId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_FOOD_BY_ID,
        food: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage('Failed to get food, please try again later.'))
    })
}

export const getCollatedOrder =
  (supperGroupId: string | number | undefined) => async (dispatch: Dispatch<ActionTypes>) => {
    if (!supperGroupId) return
    await get(ENDPOINTS.GET_COLLATED_ORDER, DOMAINS.SUPPER, `/${supperGroupId}/collated`)
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
        dispatch(setSupperErrorMessage('Failed to get collated order, please try again later.'))
      })
  }

export const getUserOrder = (supperGroupId: string | number | undefined) => async (dispatch: Dispatch<ActionTypes>) => {
  if (!supperGroupId) return
  await get(ENDPOINTS.GET_USER_ORDER, DOMAINS.SUPPER, `/${supperGroupId}/user/${localStorage.userID}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ORDER_BY_USER,
        order: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      dispatch(setSupperErrorMessage("Failed to get user's order, please try again later."))
    })
}
