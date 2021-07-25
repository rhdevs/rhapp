import { Dispatch, GetState } from '../../types'
import { ActionTypes } from '../types'
import { getCollatedOrder, getFoodInOrder, getRestaurant, getSupperGroupById, getUserOrder } from './level1/getReqests'
import { setFoodState, setIsLoading, setOrderId, setSupperErrorMessage } from './setter'

export const getPlaceOrderPageDetails = (supperGroupId: string, restaurantId: string) => async (
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
