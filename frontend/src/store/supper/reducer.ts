import { Reducer } from 'redux'
import { ActionTypes, CollatedOrder, Order, OrderStatus, Suborder } from '../supper/types'
import { SUPPER_ACTIONS } from './types'

const initialState = {
  isLoading: false,
  allSuborders: [],
  collatedOrder: null,
  order: null,
  suborder: null,
  orderStatus: OrderStatus.OPEN,
}

type State = {
  isLoading: boolean
  allSuborders: Suborder[]
  collatedOrder: CollatedOrder | null
  order: Order | null
  suborder: Suborder | null
  orderStatus: OrderStatus
}

export const supper: Reducer<State, ActionTypes> = (state = initialState, action) => {
  switch (action.type) {
    case SUPPER_ACTIONS.SET_IS_LOADING: {
      return { ...state, isLoading: action.isLoading }
    }
    case SUPPER_ACTIONS.GET_ALL_SUBORDERS: {
      return { ...state, allSuborders: action.allSuborders }
    }
    case SUPPER_ACTIONS.GET_ORDER: {
      return { ...state, order: action.order }
    }
    case SUPPER_ACTIONS.GET_SUBORDER: {
      return { ...state, suborder: action.suborder }
    }
    case SUPPER_ACTIONS.GET_ORDER_STATUS: {
      return { ...state, orderStatus: action.orderStatus }
    }
    case SUPPER_ACTIONS.SET_ORDER: {
      return { ...state, order: action.order }
    }
    case SUPPER_ACTIONS.SET_SUBORDER: {
      return { ...state, suborder: action.suborder }
    }
    case SUPPER_ACTIONS.SET_ORDER_STATUS: {
      return { ...state, orderStatus: action.orderStatus }
    }
    default:
      return state
  }
}
