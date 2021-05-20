import { Reducer } from 'redux'
import {
  ActionTypes,
  Food,
  Restaurant,
  CollatedOrder,
  Order,
  FoodMenu,
  SupperGroup,
  PaymentMethod,
  SupperGroupStatus,
} from '../supper/types'
import { SUPPER_ACTIONS } from './types'

const initialState = {
  isLoading: false,
  collatedOrder: null,
  order: null,
  restaurant: null,
  allRestaurants: [],
  food: null,
  supperGroup: null,
  allSupperGroups: [],
  menu: [],
  menuFood: null,
  orderHistory: [],
  supperGroupHistory: [],
  joinedSupperGroupHistory: [],
  count: 0,
  priceLimit: 0,
  deliveryTime: 0,
  isExpanded: false,
  selectedPaymentMethod: [],
  selectedRestaurant: null,
  selectedSupperGroupStatus: null,
  searchedSupperGroups: [],
  searchValue: '',
  tabsKey: '1',
}

type State = {
  isLoading: boolean
  collatedOrder: CollatedOrder | null
  order: Order | null
  restaurant: Restaurant | null
  allRestaurants: Restaurant[]
  food: Food | null
  supperGroup: SupperGroup | null
  allSupperGroups: SupperGroup[]
  menu: FoodMenu[]
  menuFood: FoodMenu | null
  orderHistory: Order[]
  supperGroupHistory: SupperGroup[]
  joinedSupperGroupHistory: SupperGroup[]
  count: number
  priceLimit: number
  deliveryTime: number
  isExpanded: boolean
  selectedPaymentMethod: PaymentMethod[]
  selectedRestaurant: string | null
  selectedSupperGroupStatus: SupperGroupStatus | null
  searchedSupperGroups: SupperGroup[]
  searchValue: string
  tabsKey: string
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
    case SUPPER_ACTIONS.SET_SUPPER_GROUP: {
      return { ...state, supperGroup: action.supperGroup }
    }
    case SUPPER_ACTIONS.GET_SUPPER_GROUP_BY_ID: {
      return { ...state, supperGroup: action.supperGroup }
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
    case SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS: {
      return { ...state, allSupperGroups: action.allSupperGroups }
    }
    case SUPPER_ACTIONS.GET_RESTAURANT_MENU: {
      return { ...state, menu: action.menu }
    }
    case SUPPER_ACTIONS.GET_MENU_FOOD: {
      return { ...state, menuFood: action.menuFood }
    }
    case SUPPER_ACTIONS.GET_ORDER_HISTORY: {
      return { ...state, orderHistory: action.orderHistory }
    }
    case SUPPER_ACTIONS.GET_SUPPER_GROUP_HISTORY: {
      return { ...state, supperGroupHistory: action.supperGroupHistory }
    }
    case SUPPER_ACTIONS.GET_JOINED_SUPPER_GROUP_HISTORY: {
      return { ...state, joinedSupperGroupHistory: action.joinedSupperGroupHistory }
    }
    case SUPPER_ACTIONS.SET_COUNT: {
      return { ...state, count: action.count }
    }
    case SUPPER_ACTIONS.SET_PRICE_LIMIT: {
      return { ...state, priceLimit: action.priceLimit }
    }
    case SUPPER_ACTIONS.SET_DELIVERY_TIME: {
      return { ...state, deliveryTime: action.deliveryTime }
    }
    case SUPPER_ACTIONS.SET_EXPANDABLE_CARD_STATUS: {
      return { ...state, isExpanded: action.isExpanded }
    }
    case SUPPER_ACTIONS.SET_SELECTED_PAYMENT_METHOD: {
      return { ...state, selectedPaymentMethod: action.selectedPaymentMethod }
    }
    case SUPPER_ACTIONS.SET_SELECTED_RESTAURANT: {
      return { ...state, selectedRestaurant: action.selectedRestaurant }
    }
    case SUPPER_ACTIONS.SET_SELECTED_SUPPER_GROUP_STATUS: {
      return { ...state, selectedSupperGroupStatus: action.selectedSupperGroupStatus }
    }
    case SUPPER_ACTIONS.GET_SEARCHED_SUPPER_GROUPS: {
      return { ...state, searchedSupperGroups: action.searchedSupperGroups }
    }
    case SUPPER_ACTIONS.SET_SEARCH_SUPPER_GROUP_VALUE: {
      return { ...state, searchValue: action.searchValue }
    }
    case SUPPER_ACTIONS.SET_TABS_KEY: {
      return { ...state, tabsKey: action.tabsKey }
    }
    default:
      return state
  }
}
