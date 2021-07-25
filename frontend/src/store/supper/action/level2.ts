import { calculateArrivalTime } from '../../../routes/Supper/DeliveryDetails'
import { Dispatch, GetState } from '../../types'
import { ActionTypes } from '../types'
import { getFoodInOrder, getFoodMenu, getRestaurant, getSupperGroupById, getUserOrder } from './level1/getReqests'
import { resetFoodState, setEstimatedArrivalTime, setIsLoading, setOrderId, setSupperErrorMessage } from './setter'

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
