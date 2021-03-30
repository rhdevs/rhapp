import { Reducer } from 'redux'
import { ActionTypes, User, Restaurant, CollatedOrder, SupperGroup, SupperGroupStatus, Order } from '../supper/types'
import { SUPPER_ACTIONS } from './types'

const initialState = {
  isLoading: false,
  allOrders: [],
  collatedOrder: null,
  supperGroup: null,
  order: null,
  supperGroupStatus: SupperGroupStatus.OPEN,
  restaurant: null,
  allRestaurants: [],
  user: null,
  allUsers: [],
}

type State = {
  isLoading: boolean
  allOrders: Order[]
  collatedOrder: CollatedOrder | null
  supperGroup: SupperGroup | null
  order: Order | null
  supperGroupStatus: SupperGroupStatus
  restaurant: Restaurant | null
  allRestaurants: Restaurant[]
  user: User | null
  allUsers: User[]
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
    case SUPPER_ACTIONS.GET_ALL_RESTAURANTS_INFO: {
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

    default:
      return state
  }
}
