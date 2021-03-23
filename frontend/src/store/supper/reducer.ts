import { Reducer } from 'redux'
import { User } from '../social/types'
import { ActionTypes, Restaurant, Suborder } from '../supper/types'
import { SUPPER_ACTIONS } from './types'

const initialState = {
  isLoading: false,
  orderer: null,
  restaurant: null,
  allRestaurant: [],
  hopper: null,
  allHopper: [],
  suborder: null,
}

type State = {
  isLoading: boolean
  orderer: User | null
  restaurant: Restaurant | null
  allRestaurant: Restaurant[]
  hopper: User | null
  allHopper: User[]
  suborder: Suborder | null
}

export const supper: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SUPPER_ACTIONS.SET_IS_LOADING: {
      return { ...state, isLoading: action.isLoading }
    }
    case SUPPER_ACTIONS.GET_ORDERER_INFO: {
      return { ...state, orderer: action.orderer }
    }
    case SUPPER_ACTIONS.GET_RESTAURANT_INFO: {
      return { ...state, restaurant: action.restaurant }
    }
    case SUPPER_ACTIONS.GET_ALL_RESTAURANTS_INFO: {
      return { ...state, allRestaurant: action.allRestaurant }
    }
    case SUPPER_ACTIONS.GET_HOPPER_INFO: {
      return { ...state, hopper: action.hopper }
    }
    case SUPPER_ACTIONS.GET_ALL_HOPPERS: {
      return { ...state, allHopper: action.allHopper }
    }
    case SUPPER_ACTIONS.GET_SUBORDER: {
      return { ...state, suborder: action.suborder }
    }

    default:
      return state
  }
}
