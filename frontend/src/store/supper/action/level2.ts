import { Dispatch, GetState } from '../../types'
import { ActionTypes } from '../types'
import { getFoodMenu, getRestaurant, getSupperGroupById, getUserOrder } from './level1/getReqests'
import { setIsLoading, setOrderId } from './setter'

export const getPlaceOrderPageDetails = (supperGroupId: string, restaurantId: string) => (
  dispatch: Dispatch<ActionTypes>,
  getState: GetState,
) => {
  dispatch(setIsLoading(true))
  dispatch(getSupperGroupById(supperGroupId)).then(() => {
    dispatch(getRestaurant(restaurantId)).then(() => {
      dispatch(getUserOrder(supperGroupId)).then(() => {
        const { order } = getState().supper

        if (order) {
          dispatch(setOrderId(order.orderId))
        }
        dispatch(setIsLoading(false))
      })
    })
  })
}

export const getAddFoodItemPageDetails = (supperGroupId: string, foodId: string) => async (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(setIsLoading(true))
  await Promise.all([dispatch(getSupperGroupById(supperGroupId)), dispatch(getFoodMenu(foodId))])
  dispatch(setIsLoading(false))
}
