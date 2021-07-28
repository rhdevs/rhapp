import { calculateArrivalTime } from '../../../routes/Supper/DeliveryDetails'
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
  getFoodMenu,
} from './level1/getReqests'
import {
  resetFoodState,
  setFoodState,
  setIsLoading,
  setOrderId,
  setSelectedSupperGroupStatus,
  setSupperErrorMessage,
  setEstimatedArrivalTime,
} from './setter'

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

export const getAddFoodItemPageDetails = (supperGroupId: string, foodId: string) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(setIsLoading(true))
  await Promise.all([dispatch(getSupperGroupById(supperGroupId)), dispatch(getFoodMenu(foodId))]).catch(() =>
    dispatch(setSupperErrorMessage('Could not get Add Food Item page details! Please try again.')),
  )
  dispatch(setIsLoading(false))
}

export const getDeliveryDetails = (supperGroupId: string) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(setIsLoading(true))
  dispatch(getSupperGroupById(supperGroupId))
    .then(() => {
      const { supperGroup } = getState().supper
      const currentUNIXDate = Math.round(Date.now() / 1000)

      dispatch(
        setEstimatedArrivalTime(
          calculateArrivalTime(
            supperGroup?.estArrivalTime ? Math.round((supperGroup?.estArrivalTime - currentUNIXDate) / 60) : 20,
          ),
        ),
      )
      dispatch(setIsLoading(false))
    })
    .catch(() => dispatch(setSupperErrorMessage('Could not get Delivery Details page details! Please try again.')))
}

export const getEditFoodItemDetails = (orderId: string, foodId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  await Promise.all([dispatch(resetFoodState()), dispatch(getFoodInOrder(orderId, foodId))]).catch(() =>
    dispatch(setSupperErrorMessage('Could not get Edit Food Item page details! Please try again.')),
  )
  dispatch(setIsLoading(false))
}

export const getEditSupperGroupDetails = (supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  dispatch(getSupperGroupById(supperGroupId))
    .then(() => {
      dispatch(setIsLoading(false))
    })
    .catch(() => dispatch(setSupperErrorMessage('Could not get Edit Supper Group page details! Please try again.')))
}

export const getSupperGroupForPaymentList = (supperGroupId: number | undefined) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  if (!supperGroupId) return
  dispatch(setIsLoading(true))
  dispatch(getSupperGroupById(supperGroupId))
    .then(() => {
      dispatch(setIsLoading(false))
    })
    .catch(() => dispatch(setSupperErrorMessage('Could not get Edit Supper Group page details! Please try again.')))
}
