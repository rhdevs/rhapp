import { ActionTypes, Food } from '../supper/types'
import { SUPPER_ACTIONS } from './types'
import { Dispatch } from '../types'
import { get, put, post, del, ENDPOINTS, DOMAINS } from '../endpoints'
import useSnackbar from '../../hooks/useSnackbar'

//const [success] = useSnackbar('success')
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

export const getRestaurant = (restaurantId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_RESTAURANT, DOMAINS.SUPPER, `/${restaurantId}`)
    .then((resp) => resp.json())
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
      error('Failed to get restaurant, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getRestaurantMenu = (restaurantId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_RESTAURANT_MENU, DOMAINS.SUPPER, `/${restaurantId}/menu`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_RESTAURANT_MENU,
        menu: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get restaurant menu, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getMenuFood = (foodMenuId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_MENU_FOOD, DOMAINS.SUPPER, `/${foodMenuId}`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_MENU_FOOD,
        menuFood: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get food from menu, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getFoodInOrder = (supperGroupId: string, orderId: string, foodId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_FOOD, DOMAINS.SUPPER, `/${supperGroupId}/${orderId}/${foodId}`)
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

export const getCollatedOrder = (supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_COLLATED_ORDER, DOMAINS.SUPPER, `/${supperGroupId}/collated`)
    .then((resp) => resp.json())
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_COLLATED_ORDER,
        collatedOrder: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get collated order, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getUserOrder = (supperGroupId: string, userId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_USER_ORDER, DOMAINS.SUPPER, `/${supperGroupId}/user/${userId}`)
    .then((resp) => resp.json())
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
      error("Failed to get user's order, please try again later.")
    })
  dispatch(setIsLoading(false))
}

//------------------------ POST / PUT -------------------------

export const addFoodToOrder = (newFood: Food, supperGroupId: string, orderId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
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
      error('Failed to add food, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const updateFoodInOrder = (newFood: Food, supperGroupId: string, orderId: string, foodId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
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
      error('Failed to update food, please try again later.')
    })
  dispatch(setIsLoading(false))
}
//------------------------ DELETE -----------------------

export const deleteFoodInOrder = (supperGroupId: string, orderId: string, foodId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
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
      error('Failed to delete food, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const setIsLoading = (isLoading: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_IS_LOADING,
    isLoading: isLoading,
  })
}
