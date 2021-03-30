import { Reducer } from 'redux'
import { ActionTypes, FoodMenu, Order, SupperGroup } from '../supper/types'
import { SUPPER_ACTIONS } from './types'

const initialState = {
  isLoading: false,
  supperGroup: null,
  order: null,
  allSupperGroups: [],
  menu: [],
  orderHistory: [],
  supperGroupHistory: [],
}

type State = {
  isLoading: boolean
  supperGroup: SupperGroup | null
  order: Order | null
  allSupperGroups: SupperGroup[]
  menu: FoodMenu[]
  orderHistory: Order[]
  supperGroupHistory: SupperGroup[]
}

export const supper: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SUPPER_ACTIONS.SET_IS_LOADING: {
      return { ...state, isLoading: action.isLoading }
    }
    case SUPPER_ACTIONS.SET_SUPPER_GROUP: {
      return { ...state, supperGroup: action.supperGroup }
    }
    case SUPPER_ACTIONS.GET_SUPPER_GROUP_BY_ID: {
      return { ...state, supperGroup: action.supperGroup }
    }
    case SUPPER_ACTIONS.SET_ORDER: {
      return { ...state, order: action.order }
    }
    case SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS: {
      return { ...state, allSupperGroups: action.allSupperGroups }
    }
    case SUPPER_ACTIONS.GET_RESTAURANT_MENU: {
      return { ...state, menu: action.menu }
    }
    case SUPPER_ACTIONS.GET_ORDER_HISTORY: {
      return { ...state, orderHistory: action.orderHistory }
    }
    case SUPPER_ACTIONS.GET_SUPPER_GROUP_HISTORY: {
      return { ...state, supperGroupHistory: action.supperGroupHistory }
    }
    default:
      return state
  }
}
