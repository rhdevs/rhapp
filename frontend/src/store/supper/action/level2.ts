import { Dispatch, GetState } from '../../types'
import { ActionTypes } from '../types'
import {
  getAllSupperGroups,
  getCollatedOrder,
  getCreatedSupperHistory,
  getFoodInOrder,
  getJoinedSupperHistory,
  getRestaurant,
  getSupperGroupById,
  getUserOrder,
} from './level1/getReqests'
import { setFoodState, setIsLoading, setOrderId, setSelectedSupperGroupStatus, setSupperErrorMessage } from './setter'

export const getOrderPageDetails = (supperGroupId: string, restaurantId: string) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch(setIsLoading(true))
  await Promise.all([
    dispatch(getSupperGroupById(supperGroupId)),
    dispatch(getRestaurant(restaurantId)),
    dispatch(getUserOrder(supperGroupId)).then(() => {
      const { order } = getState().supper

      if (order) {
        dispatch(setOrderId(order.orderId))
      }
    }),
  ]).catch(() => dispatch(setSupperErrorMessage('Could not get all order page details! Please try again later.')))

  dispatch(setIsLoading(false))
}

export const getOrderSummaryPageDetails = (supperGroupId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  await Promise.all([
    dispatch(getCollatedOrder(supperGroupId)),
    dispatch(getSupperGroupById(supperGroupId)),
  ]).catch(() =>
    dispatch(setSupperErrorMessage('Could not get all order summary page details! Please try again later.')),
  )
  dispatch(setIsLoading(false))
}

export const getUpdateItemPageDetails = (supperGroupId: string, orderId: string, foodId: string) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(setIsLoading(true))
  await Promise.all([
    dispatch(getSupperGroupById(supperGroupId)),
    dispatch(getFoodInOrder(orderId, foodId)),
  ]).catch(() => dispatch(setSupperErrorMessage('Could not get all update item page details! Please try again later.')))
  dispatch(setIsLoading(false))
}

export const getUpdateAllItemsPageDetails = (supperGroupId: string, foodId: string) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch(setIsLoading(true))
  await dispatch(getCollatedOrder(supperGroupId))
    .then(() => {
      const { collatedOrder } = getState().supper
      const currentFood = collatedOrder?.collatedOrderList.find((food) => food.foodIdList?.includes(foodId))
      dispatch(setFoodState(currentFood))
    })
    .catch(() => dispatch(setSupperErrorMessage('Could not get all update item page details! Please try again later.')))
  dispatch(setIsLoading(false))
}

export const getGroupHistoryPageDetails = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  await Promise.all([dispatch(getCreatedSupperHistory()), dispatch(getJoinedSupperHistory())]).catch(() =>
    dispatch(setSupperErrorMessage('Could not get group history page details! Please try again later.')),
  )
  dispatch(setIsLoading(false))
}

export const getViewOrderPageDetails = (supperGroupId: string) => async (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch(setIsLoading(true))
  await dispatch(getSupperGroupById(supperGroupId))
    .then(() => {
      const { supperGroup } = getState().supper
      if (supperGroup) {
        dispatch(setSelectedSupperGroupStatus(supperGroup?.status ?? null))
        if (supperGroup?.ownerId === localStorage.userID) {
          dispatch(getCollatedOrder(supperGroupId))
        } else {
          dispatch(getUserOrder(supperGroupId))
        }
      }
    })
    .catch(() => dispatch(setSupperErrorMessage('Could not get view order page details! Please try again later.')))
  dispatch(setIsLoading(false))
}

export const getJoinGroupPageDetails = (supperGroupId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  dispatch(getSupperGroupById(supperGroupId))
    .then(() => dispatch(setIsLoading(false)))
    .catch(() => dispatch(setSupperErrorMessage('Could not get join group page details! Please try again later.')))
}

export const getSupperHomePageDetails = () => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  dispatch(getAllSupperGroups())
    .then(() => dispatch(setIsLoading(false)))
    .catch(() => dispatch(setSupperErrorMessage('Could not get supper home page details! Please try again later.')))
}
