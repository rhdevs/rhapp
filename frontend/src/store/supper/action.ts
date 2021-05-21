import { ActionTypes, Food, Order, PaymentMethod, SupperGroup, SupperGroupStatus } from '../supper/types'
import { SUPPER_ACTIONS } from './types'
import { Dispatch, GetState } from '../types'
import { get, put, post, del, ENDPOINTS, DOMAINS } from '../endpoints'
import useSnackbar from '../../hooks/useSnackbar'

const [error] = useSnackbar('error')

//------------------------ GET --------------------------
export const getAllSupperGroups = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.ALL_SUPPER_GROUPS, DOMAINS.SUPPER)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ALL_SUPPER_GROUPS,
        allSupperGroups: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get all supper groups, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getSupperGroupById = (supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  get(ENDPOINTS.GET_SUPPER_GROUP_BY_ID, DOMAINS.SUPPER, `/${supperGroupId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      const newId = readableSupperGroupId(resp.data.supperGroupId)
      const newClosingTime = unixTo12HourTime(resp.data.closingTime)
      dispatch({
        type: SUPPER_ACTIONS.GET_SUPPER_GROUP_BY_ID,
        supperGroup: { ...resp.data, supperGroupId: newId, closingTime: newClosingTime },
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get supper group, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const getSupperHistory = (userId) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_SUPPER_GROUP_HISTORY, DOMAINS.SUPPER, `/${userId}/supperGroupHistory`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_SUPPER_GROUP_HISTORY,
        supperGroupHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to retrieve supper group history, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getOrderInSupperGroup = (orderId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_ORDER_IN_SUPPER_GROUP, DOMAINS.SUPPER, `/${orderId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ORDER_BY_ID,
        order: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getOrderHistory = (userId) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_ORDER_HISTORY, DOMAINS.SUPPER, `/${userId}/orderHistory`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_ORDER_HISTORY,
        orderHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to retrieve order history, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const getAllRestaurants = () => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.ALL_RESTAURANTS, DOMAINS.SUPPER)
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

export const getFoodInOrder = (orderId: string, foodId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_FOOD, DOMAINS.SUPPER, `/${orderId}/food/${foodId}`)
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
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_COLLATED_ORDER,
        collatedOrder: { ...resp.data, supperGroupId: readableSupperGroupId(resp.data.supperGroupId), price: 0.0 },
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

export const getSearchedSupperGroups = (query: string) => (dispatch: Dispatch<ActionTypes>, getState: GetState) => {
  dispatch(setIsLoading(true))
  dispatch(getAllSupperGroups())
  const { allSupperGroups } = getState().supper
  const filteredSearchSupperGroups = allSupperGroups.filter((supperGroup) =>
    supperGroup.restaurantName.toLowerCase().includes(query.toLowerCase()),
  )
  dispatch({
    type: SUPPER_ACTIONS.GET_SEARCHED_SUPPER_GROUPS,
    searchedSupperGroups: filteredSearchSupperGroups,
  })
  dispatch(setIsLoading(false))
}

export const getAllUserJoinedSupperGroup = (userId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  get(ENDPOINTS.GET_JOINED_SUPPER_GROUP_HISTORY, DOMAINS.SUPPER, `/${userId}/joinGroupHistory`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch({
        type: SUPPER_ACTIONS.GET_JOINED_SUPPER_GROUP_HISTORY,
        joinedSupperGroupHistory: resp.data,
      })
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get joined supper groups, please try again later.')
    })
  dispatch(setIsLoading(false))
}

//------------------------ POST / PUT -------------------------

export const createSupperGroup = (newSupperGroup: SupperGroup) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  const requestBody = newSupperGroup
  post(ENDPOINTS.ADD_SUPPER_GROUP, DOMAINS.SUPPER, requestBody)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error('Failed to get all supper groups, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const updateSupperGroup = (order: Order, supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))

  const requestBody = order
  put(ENDPOINTS.UPDATE_SUPPER_GROUP, DOMAINS.SUPPER, requestBody, {}, `/${supperGroupId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperGroupById(supperGroupId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to update order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const addOrder = (order: Order, supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const requestBody = order
  post(ENDPOINTS.ADD_ORDER, DOMAINS.SUPPER, requestBody, {})
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperGroupById(supperGroupId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to add order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const updateOrderDetails = (newOrderDetails: any, orderId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  const requestBody = newOrderDetails
  put(ENDPOINTS.UPDATE_ORDER_DETAILS, DOMAINS.SUPPER, requestBody, {}, `/${orderId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderInSupperGroup(orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to update order, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const addFoodToOrder = (newFood: Food, orderId: string) => (dispatch: Dispatch<ActionTypes>) => {
  const requestBody = newFood
  dispatch(setIsLoading(true))
  post(ENDPOINTS.ADD_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${orderId}/food`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderInSupperGroup(orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to add food, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const updateFoodInOrder = (newFood: Food, orderId: string, foodId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  const requestBody = newFood
  dispatch(setIsLoading(true))
  put(ENDPOINTS.EDIT_FOOD, DOMAINS.SUPPER, requestBody, {}, `/${orderId}/${foodId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderInSupperGroup(orderId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to update food, please try again later.')
    })
  dispatch(setIsLoading(false))
}
//------------------------ DELETE -----------------------

export const deleteSupperGroup = (supperGroupId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_SUPPER_GROUP, DOMAINS.SUPPER, {}, `/${supperGroupId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getAllSupperGroups())
    })
    .catch((err) => {
      console.log(err)
      error('Failed to delete supper group, please try again.')
    })
  dispatch(setIsLoading(false))
}

export const deleteOrder = (supperGroupId: string, orderId: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_ORDER, DOMAINS.SUPPER, {}, `/${orderId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getSupperGroupById(supperGroupId))
    })
    .catch((err) => {
      console.log(err)
      error('Failed to delete order, please try again later.')
    })
  dispatch(setIsLoading(false))
}

export const deleteFoodInOrder = (supperGroupId: string, orderId: string, foodId: string) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch(setIsLoading(true))
  del(ENDPOINTS.DELETE_FOOD, DOMAINS.SUPPER, {}, `/${orderId}/food/${foodId}`)
    .then((resp) => {
      if (resp.status === 'failed') {
        throw resp.err
      }
      dispatch(getOrderInSupperGroup(orderId))
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

export const setCount = (newCount: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_COUNT,
    count: newCount,
  })
}

export const setPriceLimit = (newPriceLimit: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_PRICE_LIMIT,
    priceLimit: newPriceLimit,
  })
}

export const setDeliveryTime = (newDeliveryTime: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_DELIVERY_TIME,
    deliveryTime: newDeliveryTime,
  })
}

export const setExpandableCardStatus = (isExpanded: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_EXPANDABLE_CARD_STATUS,
    isExpanded: isExpanded,
  })
}

export const setSelectedPaymentMethod = (selectedPaymentMethod: PaymentMethod[]) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_SELECTED_PAYMENT_METHOD,
    selectedPaymentMethod: selectedPaymentMethod,
  })
}

export const setSelectedRestaurant = (selectedRestaurant: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_SELECTED_RESTAURANT,
    selectedRestaurant: selectedRestaurant,
  })
}

export const setSelectedSupperGroupStatus = (selectedSupperGroupStatus: SupperGroupStatus) => (
  dispatch: Dispatch<ActionTypes>,
) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_SELECTED_SUPPER_GROUP_STATUS,
    selectedSupperGroupStatus: selectedSupperGroupStatus,
  })
}

export const setSearchValue = (query: string) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_SEARCH_SUPPER_GROUP_VALUE,
    searchValue: query,
  })
}

export const unixTo12HourTime = (unixDate: number) => {
  if (!unixDate) {
    return '-'
  }
  const date = new Date(unixDate * 1000)
  const hours = '0' + date.getHours()
  const minutes = '0' + date.getMinutes()
  let letters = 'PM'

  if (Number(hours) < 12) {
    letters = 'AM'
  }

  const formattedTime = hours.substr(-2) + ':' + minutes.substr(-2) + letters

  return formattedTime
}

export const readableSupperGroupId = (supperGroupId: number) => {
  const readableSupperGroupId = '0000000000' + supperGroupId
  return String('RHSO#' + readableSupperGroupId.substr(-4))
}

export const setTabsKey = (section: string) => (dispatch: Dispatch<ActionTypes>) => {
  console.log(section === 'created')
  const key = section === 'created' ? '1' : '2'
  console.log(key)
  dispatch({
    type: SUPPER_ACTIONS.SET_TABS_KEY,
    tabsKey: key,
  })
}

export const setExpandAll = (isExpandAll: boolean) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_EXPAND_ALL,
    isExpandAll: isExpandAll,
  })
}

export const setPaymentExpandedCount = (expandedCount: number) => (dispatch: Dispatch<ActionTypes>) => {
  dispatch({
    type: SUPPER_ACTIONS.SET_PAYMENT_EXPANDED_COUNT,
    expandedCount: expandedCount,
  })
}
