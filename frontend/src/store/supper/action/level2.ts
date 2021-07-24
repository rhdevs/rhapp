import { Dispatch, GetState } from '../../types'
import { ActionTypes } from '../types'
import { getRestaurant, getSupperGroupById, getUserOrder } from './level1/getReqests'
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
