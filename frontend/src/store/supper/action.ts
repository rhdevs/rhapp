import { ActionTypes } from '../supper/types'
import { SUPPER_ACTIONS } from './types'
import { Dispatch, GetState } from '../types'
import { get, put, post, del, ENDPOINTS, DOMAINS } from '../endpoints'
import useSnackbar from '../../hooks/useSnackbar'

const [success] = useSnackbar('success')
const [error] = useSnackbar('error')

//------------------------ GET --------------------------

export const getAllRestaurants = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.ALL_RESTAURANTS, DOMAINS.SUPPER)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ALL_RESTAURANTS,
        allRestaurants: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get all restaurants, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getFoodInOrder = (supperGroupId, orderId, foodId) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}/${orderId}/${foodId}`)
    .then((resp) => resp.json())
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
      error('Failed to get food, please try again later.')
    })
  dispatch(setIsLoading(false))
}
//------------------------ POST / PUT -------------------------

export const addFoodToOrder = (newFood, supperGroupId, orderId) => (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = newFood
  dispatch(setIsLoading(true))
  post(ENDPOINTS.ADD_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}/${orderId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      //TODO: UPDATE THE ORDER STATE IN THE STORE
    })
    .catch((err) => {
      console.log(err)
      error('Failed to add Food, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const updateFoodInOrder = (newFood, supperGroupId, orderId, foodId) => (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = newFood
  dispatch(setIsLoading(true))
  put(ENDPOINTS.EDIT_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}/${orderId}/${foodId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      //TODO: UPDATE THE ORDER STATE IN THE STORE
    })
    .catch((err) => {
      console.log(err)
      error('Failed to update Food, please try again later.')
    })
  dispatch(setIsLoading(false))
}
//------------------------ DELETE -----------------------

export const deleteFoodInOrder = (supperGroupId, orderId, foodId) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_FOOD, DOMAINS.SUPPER, {}, `/${supperGroupId}/${orderId}/${foodId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      //TODO: GET THE UPDATED ORDER STATE IN THE STORE
    })
    .catch((err) => {
      console.log(err)
      error('Failed to delete Food, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const setIsLoading = (isLoading: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_IS_LOADING,
    isLoading: isLoading,
  })
}
