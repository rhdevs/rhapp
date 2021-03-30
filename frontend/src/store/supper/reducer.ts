import { Reducer } from 'redux'
import { ActionTypes, Food, Restaurant, CollatedOrder, Order } from '../supper/types'
import { SUPPER_ACTIONS } from './types'

const initialState = {
  isLoading: false,
  collatedOrder: null,
  order: null,
  restaurant: null,
  allRestaurants: [],
  food: null,
}

type State = {
  isLoading: boolean
  collatedOrder: CollatedOrder | null
  order: Order | null
  restaurant: Restaurant | null
  allRestaurants: Restaurant[]
  food: Food | null
}

export const supper: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SUPPER_ACTIONS.SET_IS_LOADING: {
      return { ...state, isLoading: action.isLoading }
    }
    case SUPPER_ACTIONS.GET_ORDER_BY_ID: {
      return { ...state, order: action.order }
    }
    case SUPPER_ACTIONS.GET_ORDER_BY_USER: {
      return { ...state, order: action.order }
    }
    case SUPPER_ACTIONS.SET_ORDER_BY_ID: {
      return { ...state, order: action.order }
    }
    case SUPPER_ACTIONS.GET_ALL_RESTAURANTS: {
      return { ...state, allRestaurants: action.allRestaurants }
    }
    case SUPPER_ACTIONS.GET_RESTAURANT_BY_ID: {
      return { ...state, restaurant: action.restaurant }
    }
    case SUPPER_ACTIONS.GET_FOOD_BY_ID: {
      return { ...state, food: action.food }
    }
    case SUPPER_ACTIONS.SET_FOOD_BY_ID: {
      return { ...state, food: action.food }
    }
    case SUPPER_ACTIONS.GET_COLLATED_ORDER: {
      return { ...state, collatedOrder: action.collatedOrder }
    }
    default:
      return state
  }
}
