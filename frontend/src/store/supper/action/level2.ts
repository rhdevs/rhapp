import { Dispatch, GetState } from '../../types'
import { ActionTypes } from '../types'
import { getCollatedOrder, getRestaurant, getSupperGroupById, getUserOrder } from './level1/getReqests'
import { setIsLoading, setOrderId, setSupperErrorMessage } from './setter'

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
  ]).catch(() => dispatch(setSupperErrorMessage('Could not get all ordeer page details! Please try again later.')))

  dispatch(setIsLoading(false))
}

export const getOrderSummaryPageDetails = (supperGroupId: string) => async (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  await Promise.all([
    dispatch(getCollatedOrder(supperGroupId)),
    dispatch(getSupperGroupById(supperGroupId)),
  ]).catch(() => dispatch(setSupperErrorMessage('Could not get all ordeer summary details! Please try again later.')))
  dispatch(setIsLoading(false))
}
